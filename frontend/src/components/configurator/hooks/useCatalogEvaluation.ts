'use client';

import { useEffect, useRef, useState } from 'react';
import { evaluateCatalog } from '@/api/catalogApi';
import type { ConfigSelections, EvaluationResult } from '@/types/catalog';

type Args = {
  enabled: boolean;
  productId: string | null;
  customerType: string | null;
  selections: ConfigSelections;
  debounceMs?: number;
};

/**
 * useCatalogEvaluation(...)
 *
 * What it does:
 * - Runs backend evaluation when inputs change (productId, customerType, selections).
 * - Debounces calls to avoid spamming the API while the user is clicking.
 * - Ignores stale/out-of-order responses using a sequence number.
 * - Avoids re-evaluating the exact same payload twice using lastPayloadRef.
 *
 * What it DOES NOT do:
 * - It does not mutate your selections itself. It only returns `evaluation`.
 *   (Applying resolvedSelections should be done in ProductConfigurator where state lives.)
 *
 * Debugging notes:
 * - Logs show each scheduled evaluation and each response:
 *   - "[eval] schedule payloadKey=..."
 *   - "[eval] RUN seq=..."
 *   - "[eval] DONE seq=..."
 *   - "[eval] STALE response ignored seq=... current=..."
 */
export function useCatalogEvaluation({
  enabled,
  productId,
  customerType,
  selections,
  debounceMs = 200,
}: Args) {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const mountIdRef = useRef(Math.random().toString(16).slice(2));

  // payloadKey guard: do not run the same exact evaluation twice
  const lastPayloadRef = useRef<string>('');

  // sequence guard: ignore out-of-order responses
  const seqRef = useRef(0);

  // debounce timer
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    console.log(
      `[eval][${mountIdRef.current}] effect fired enabled=${enabled} productId=${productId} customerType=${customerType}`,
    );

    if (!enabled) {
      console.log(`[eval][${mountIdRef.current}] disabled -> skip`);
      return;
    }
    if (!productId) {
      console.log(`[eval][${mountIdRef.current}] missing productId -> skip`);
      return;
    }
    if (!customerType) {
      console.log(`[eval][${mountIdRef.current}] missing customerType -> skip`);
      return;
    }

    const payload = { productId, customerType, selections };
    const payloadKey = JSON.stringify(payload);

    console.log(`[eval][${mountIdRef.current}] schedule payloadKeyLen=${payloadKey.length}`);

    if (timerRef.current) {
      console.log(`[eval][${mountIdRef.current}] clearing previous debounce timer`);
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (lastPayloadRef.current === payloadKey) {
        console.log(`[eval][${mountIdRef.current}] payloadKey unchanged -> skip run`);
        return;
      }
      lastPayloadRef.current = payloadKey;

      const seq = ++seqRef.current;
      console.log(`[eval][${mountIdRef.current}] RUN seq=${seq} productId=${productId} customerType=${customerType}`);
      setIsEvaluating(true);

      evaluateCatalog(payload)
        .then((res) => {
          if (seq !== seqRef.current) {
            console.warn(
              `[eval][${mountIdRef.current}] STALE response ignored seq=${seq} current=${seqRef.current}`,
            );
            return;
          }

          console.log(`[eval][${mountIdRef.current}] DONE seq=${seq}`);
          console.log(
            `[eval][${mountIdRef.current}] result: disabled=${Object.keys(res.disabledOptions ?? {}).length
            } hidden=${Object.keys(res.hiddenOptions ?? {}).length
            } requirements=${res.requirements?.length ?? 0}`,
          );

          setEvaluation(res);
        })
        .catch((err) => {
          if (seq !== seqRef.current) {
            console.warn(
              `[eval][${mountIdRef.current}] STALE error ignored seq=${seq} current=${seqRef.current}`,
            );
            return;
          }
          console.error(`[eval][${mountIdRef.current}] FAILED seq=${seq}`, err);
        })
        .finally(() => {
          if (seq === seqRef.current) {
            console.log(`[eval][${mountIdRef.current}] isEvaluating=false seq=${seq}`);
            setIsEvaluating(false);
          } else {
            console.log(
              `[eval][${mountIdRef.current}] not clearing isEvaluating because stale seq=${seq} current=${seqRef.current}`,
            );
          }
        });
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        console.log(`[eval][${mountIdRef.current}] cleanup: clear debounce timer`);
        clearTimeout(timerRef.current);
      }
    };
  }, [enabled, productId, customerType, selections, debounceMs]);

  return { evaluation, isEvaluating };
}
