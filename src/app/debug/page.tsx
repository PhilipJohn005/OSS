'use client';

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DebugRealtime() {
  useEffect(() => {
    const channel = supabase
      .channel('debug-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'issues',
        },
        (payload) => {
          console.log('✅ Got realtime payload!', payload);
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscribe status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-6 text-white bg-black">
      <h1>🔍 Realtime Debug Page</h1>
      <p>Open console and insert a row into the <code>issues</code> table to test.</p>
    </div>
  );
}
