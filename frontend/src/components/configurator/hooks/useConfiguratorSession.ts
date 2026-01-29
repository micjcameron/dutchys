'use client';

import { useEffect, useRef, useState } from 'react';
import { getConfiguratorSessionId, setConfiguratorSessionId } from '@/utils/localStorage';
import { createSession, updateSession } from '@/api/sessionApi';

/**
 * useConfiguratorSession(productType)
 *
 * What it does:
 * - Ensures you have a configurator sessionId for this productType.
 * - Tries to reuse an existing session from localStorage.
 * - If not found, creates a new session via backend and stores it.
 * - Updates the session with productType once session exists.
 *
 * Why it exists:
 * - Keeps ProductConfigurator.tsx readable (session lifecycle is noisy)
 * - Avoids session logic being duplicated across multiple configurators (hottub/sauna/coldplunge)
 *
 * Debugging notes:
 * - Watch logs:
 *   - "[session] reuse existing sessionId=..."
 *   - "[session] creating new session..."
 *   - "[session] created sessionId=..."
 *   - "[session] updating session..."
 */
export function useConfiguratorSession(productType: string) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Just to make log sequences clearer
  const mountIdRef = useRef(Math.random().toString(16).slice(2));

  useEffect(() => {
    console.log(`[session][${mountIdRef.current}] hook mount productType=${productType}`);

    const existing = getConfiguratorSessionId(productType);
    if (existing) {
      console.log(
        `[session][${mountIdRef.current}] reuse existing sessionId=${existing} productType=${productType}`,
      );
      setSessionId(existing);
      return;
    }

    console.log(`[session][${mountIdRef.current}] no existing session, creating... productType=${productType}`);

    const create = async () => {
      try {
        const res = await createSession();
        console.log(`[session][${mountIdRef.current}] created sessionId=${res.id} (saving to storage)`);
        setConfiguratorSessionId(res.id, productType);
        setSessionId(res.id);
      } catch (err) {
        console.error(`[session][${mountIdRef.current}] FAILED to create session`, err);
      }
    };

    create();
  }, [productType]);

  useEffect(() => {
    if (!sessionId) {
      console.log(`[session][${mountIdRef.current}] sessionId not ready yet, skipping update`);
      return;
    }

    console.log(
      `[session][${mountIdRef.current}] updating sessionId=${sessionId} with productType=${productType}`,
    );

    updateSession(sessionId, { productType })
      .then(() => {
        console.log(`[session][${mountIdRef.current}] session updated ok sessionId=${sessionId}`);
      })
      .catch((err) => {
        console.error(`[session][${mountIdRef.current}] FAILED to update session sessionId=${sessionId}`, err);
      });
  }, [sessionId, productType]);

  return { sessionId };
}
