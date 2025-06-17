'use client';

import { useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

const supabase = getSupabaseClient();

interface Issue {
  id: string;
  title: string;
  link: string;
  image?: string;
  description: string;
  card_id: string;
}

export default function CardListener({
  cardId,
  onNewIssue,
}: {
  cardId: string;
  onNewIssue: (issue: Issue) => void;
}) {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!cardId || typeof onNewIssue !== 'function') {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Invalid props passed to CardListener');
      }
      return;
    }

    const setupSubscription = async () => {
      // Clean up old channel if exists
      if (channelRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('🧹 Cleaning up previous channel...');
        }
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('🟢 Subscribing to cardId:', cardId);
      }

      // Create new channel instance
      const newChannel = supabase.channel(`realtime-issues-${cardId}`);

      interface PostgresChangesPayload<T> {
        schema: string;
        table: string;
        commit_timestamp: string;
        eventType: string;
        new: T;
        old: T | null;
        errors?: any;
      }

      interface OnEventCallback<T> {
        (payload: PostgresChangesPayload<T>): void;
      }

      interface Channel {
        on(
          type: 'postgres_changes',
          filter: {
        event: 'INSERT';
        schema: string;
        table: string;
        filter: string;
          },
          callback: OnEventCallback<Issue>
        ): Channel;
        subscribe(callback: (status: string) => void): Promise<{ error?: Error }>;
      }

      newChannel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'issues',
          filter: `card_id=eq.${cardId}`,
        },
        (payload: PostgresChangesPayload<Issue>) => {
          if (process.env.NODE_ENV === 'development') {
        console.log('📡 Received payload:', payload);
          }
          const newIssue = payload.new as Issue;
          if (newIssue.card_id?.toString() === cardId.toString()) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 Issue matches card:', cardId);
        }
        onNewIssue(newIssue);
          }
        }
      );

      const { error } = await newChannel.subscribe((status: string) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('🚦 Subscription status:', status);
        }
      });

      if (error && process.env.NODE_ENV === 'development') {
        console.error('❌ Failed to subscribe:', error);
        return;
      }

      // Store the actual subscribed channel
      channelRef.current = newChannel;
    };

    setupSubscription();

    return () => {
      const cleanup = async () => {
        if (channelRef.current) {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔌 Unsubscribing...');
          }
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
      cleanup();
    };
  }, [cardId, onNewIssue]);

  return null;
}
