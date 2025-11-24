require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Webhook } = require('svix');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 4000;

// Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Webhook secret
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

// Use body-parser to read the raw body, which is needed for webhook verification
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!webhookSecret) {
      throw new Error('CLERK_WEBHOOK_SECRET is not set in .env');
    }

    const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(webhookSecret);
    const evt = wh.verify(JSON.stringify(payload), headers);

    const { type, data } = evt;

    if (type === 'user.created' || type === 'user.updated') {
      const { id, first_name, last_name, email_addresses, image_url } = data;
      const email = email_addresses?.[0]?.email_address;

      const { error } = await supabase
        .from('users')
        .upsert({
          id,
          first_name,
          last_name,
          email,
          avatar_url: image_url || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) {
        console.error('Supabase upsert error:', error);
        return res.status(500).json({ error: 'Failed to sync user to Supabase' });
      }
      console.log('User synced to Supabase:', id);
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send('Webhook verification failed');
  }
});

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
