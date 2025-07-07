import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet email.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 heure

    try {
      await prisma.user.update({
        where: { email },
        data: {
          resetToken,
          resetTokenExpires,
        },
      });
      return res.status(200).json({ message: 'Token généré pour la réinitialisation du mot de passe.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du token.' });
    }
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
