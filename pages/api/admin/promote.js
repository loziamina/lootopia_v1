import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID utilisateur requis.' });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role: 'ADMIN' },
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la promotion.' });
    }
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée.' });
  }
}
