import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'ID requis' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: 'ADMIN' },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erreur promotion utilisateur :', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
