const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ppxuxwfliidxyxrlzhms.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweHV4d2ZsaWlkeHl4cmx6aG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTIxMjIsImV4cCI6MjA2NDk2ODEyMn0.6nhUYHcK0FGGaV3LYL974vAgvCFVKtNJuazf5EgkL7E'
);

const channel = supabase.channel('issues');

channel
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'issues',
  }, (payload: any) => {
    console.log('Change received!', payload);
  })
  .subscribe((status: any) => {
    console.log('Subscribe status:', status);
  });
