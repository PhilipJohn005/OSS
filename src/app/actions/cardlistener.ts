'use client';

import { useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload, RealtimePostgresInsertPayload } from '@supabase/supabase-js';

const supabase = getSupabaseClient();

interface Issue {
  id: string;
  title: string;
  link: string;
  image?: string;
  description: string;
  card_id: string;
  tags: string[];
}

type SystemEvent = 
  | { message: string; status: string; extension?: string; channel?: string }
  | 'CHANNEL_ERROR'
  | 'SUBSCRIBED'
  | 'CLOSED';

type SubscriptionStatus = 
  | 'SUBSCRIBED'
  | 'CHANNEL_ERROR'
  | 'CLOSED'
  | 'TIMED_OUT'
  | 'CHANNEL_LEAVING';

export default function CardListener({
  cardId,
  onNewIssue,
}: {
  cardId: string;
  onNewIssue: (issue: Issue) => void;
}) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isMountedRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMountedRef.current = true;

    const setupSubscription = async () => {
      if (!cardId || !isMountedRef.current) return;

      // Clean up previous channel if exists
      if (channelRef.current) {
        try {
          await supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.error('Error removing channel:', error);
        }
        channelRef.current = null;
      }

      // Clear any pending retries
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      // Create new channel with unique name
      const channelName = `realtime-issues-${cardId}-${Date.now()}`;
      const newChannel = supabase.channel(channelName, {
        config: {
          broadcast: { ack: true },
          presence: { key: cardId },
        },
      });

      newChannel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'issues',
          filter: `card_id=eq.${cardId}`,
        },
        (payload: RealtimePostgresInsertPayload<Issue>) => {
          if (isMountedRef.current) {
            const newIssue = payload.new;
            onNewIssue(newIssue);
          }
        }
      );

      newChannel.on('system', {}, (event: SystemEvent) => {
        if (!isMountedRef.current) return;
        
        console.log('System event:', event);
        if (event === 'CHANNEL_ERROR') {
          const retryCount = retryTimeoutRef.current ? 1 : 0;
          const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
          retryTimeoutRef.current = setTimeout(setupSubscription, delay);
        }
      });

      const { error } = await newChannel.subscribe((status: SubscriptionStatus) => {
        console.log('Subscription status:', status);
      });

      if (error) {
        console.error('Initial subscription error:', error);
        const delay = retryTimeoutRef.current ? 2000 : 1000;
        retryTimeoutRef.current = setTimeout(setupSubscription, delay);
        return;
      }

      channelRef.current = newChannel;
    };

    // Initial connection with small delay to avoid race conditions
    const initialDelay = setTimeout(setupSubscription, 100);

    return () => {
      isMountedRef.current = false;
      
      clearTimeout(initialDelay);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      const cleanup = async () => {
        if (channelRef.current) {
          try {
            await supabase.removeChannel(channelRef.current);
          } catch (error) {
            console.error('Cleanup error:', error);
          }
          channelRef.current = null;
        }
      };
      
      cleanup();
    };
  }, [cardId, onNewIssue]);

  return null;
}