// server.js (loyihaning ildizida)
require('dotenv').config();
const express = require('express');
const { Webhook } = require('svix');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Supabase (service_role key bilan – RLS ni chetlab o‘tadi)
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ← CORRECTED AND SECURE
);

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET; // ← CORRECTED AND SECURE

// IMPORTANT: Use express.raw to get the raw body as a buffer for the webhook route
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const headers = req.headers;
  // Use the raw buffer directly. This is the most reliable method.
  const payload = req.body;

  try {
    if (!webhookSecret) {
        throw new Error('CLERK_WEBHOOK_SECRET is not set in .env file');
    }

    const wh = new Webhook(webhookSecret);
    const evt = wh.verify(payload, {
      'svix-id': headers['svix-id'],
      'svix-timestamp': headers['svix-timestamp'],
      'svix-signature': headers['svix-signature'],
    });

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { id, first_name, last_name, image_url } = evt.data;
      const email = evt.data.email_addresses?.[0]?.email_address || null;

      const { error } = await supabase
        .from('users')
        .upsert({
          id,
          first_name: first_name || null,
          last_name: last_name || null,
          email,
          avatar_url: image_url || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      console.log('User synced → Supabase:', id);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).json({ error: 'Webhook verification failed' });
  }
});

// React ilovasini serve qilish
app.use(express.static('build'));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'build' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
});
