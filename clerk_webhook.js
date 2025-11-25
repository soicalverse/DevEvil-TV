const prisma = require('../prisma/client');

async function handler(req, res) {
  const event = req.body;

  if (event.type === 'user.created' || event.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, username } = event.data;
    await prisma.userInfo.upsert({
      where: { clerkId: id },
      update: {
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        username: username,
      },
      create: {
        clerkId: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        username: username,
      },
    });
  }

  res.status(200).send('OK');
}

module.exports = handler;
