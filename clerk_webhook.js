import { createClient } from '@supabase/supabase-js'
import { Webhook } from 'svix'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export default async function handler(req, res) {
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
  const payload = await req.json()

  try {
    const evt = webhook.verify(JSON.stringify(payload), {
      'svix-id': req.headers.get('svix-id'),
      'svix-timestamp': req.headers.get('svix-timestamp'),
      'svix-signature': req.headers.get('svix-signature'),
    })

    const { id, ...attributes } = evt.data

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { data, error } = await supabase
        .from('users')
        .upsert({ id, ...attributes }, { onConflict: ['id'] })

      if (error) {
        console.error('Error upserting user', error)
        return res.status(500).json({ error: 'Error upserting user' })
      }
    }

    return res.status(200).json({ message: 'Webhook received' })
  } catch (err) {
    console.error('Error verifying webhook', err)
    return res.status(400).json({ error: 'Error verifying webhook' })
  }
}
