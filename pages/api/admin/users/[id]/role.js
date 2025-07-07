import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const { id } = req.query;
    const { role } = req.body;

    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('Erreur changement de rôle :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
