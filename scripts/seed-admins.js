const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

const admins = [
  { email: process.env.ADMIN1_EMAIL },
  { email: process.env.ADMIN2_EMAIL },
  { email: process.env.ADMIN3_EMAIL },
];

const password = process.env.ADMIN_DEFAULT_PASSWORD;

async function seedAdmins() {
  for (const admin of admins) {
    const exists = await prisma.user.findUnique({ where: { email: admin.email } });

    if (!exists) {
      await prisma.user.create({
        data: {
          email: admin.email,
          password: await bcrypt.hash(password, 10),
          role: 'ADMIN',
          firstName: 'Admin',
          lastName: admin.email.split('@')[0],
        },
      });
      console.log(`✅ Admin créé : ${admin.email}`);
    } else {
      console.log(`ℹ️ Admin déjà existant : ${admin.email}`);
    }
  }

  await prisma.$disconnect();
}

seedAdmins()
  .then(() => {
    console.log('✅ Tous les admins ont été traités');
  })
  .catch((error) => {
    console.error('❌ Erreur dans le script :', error);
    prisma.$disconnect();
    process.exit(1);
  });
