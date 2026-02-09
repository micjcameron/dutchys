// components/DebugClientLog.tsx
'use client';

import { useEffect } from 'react';

export default function DebugClientLog(props: { name: string; value: any }) {
  useEffect(() => {
    console.log(`[${props.name}]`, props.value);
  }, [props.name, props.value]);

  return null;
}
