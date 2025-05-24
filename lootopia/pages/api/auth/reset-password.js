import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token ou mot de passe manquant.' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { resetToken: token },
      });

      if (!user) {
        return res.status(400).json({ message: 'Token invalide ou expiré.' });
      }

      if (user.resetTokenExpires < new Date()) {
        return res.status(400).json({ message: 'Le token a expiré.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { resetToken: token },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpires: null,
        },
      });

      return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe :', error);
      return res.status(500).json({ message: 'Erreur serveur lors de la réinitialisation du mot de passe.' });
    }
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
