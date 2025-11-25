
const express = require('express');
const bodyParser = require('body-parser');
const { Webhook } = require('svix');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3001;

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(bodyParser.json());

app.post('/api/webhooks/clerk', async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return res.status(400).send('Webhook secret is not configured.');
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(JSON.stringify(req.body), {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).send('Error occured');
  }

  const { id, ...attributes } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { data, error } = await supabase
      .from('userinfo')
      .upsert([{ 
        id: id, 
        email: attributes.email_addresses[0].email_address,
        name: `${attributes.first_name} ${attributes.last_name}`,
        username: attributes.username
      }]);

    if (error) {
      console.error('Error upserting user:', error);
      return res.status(500).send('Error upserting user');
    }

    return res.status(200).json({ success: true, data });
  }

  res.status(200).send('Webhook processed');
});

app.listen(port, () => {
  console.log(`Webhook server listening at http://localhost:${port}`);
});
