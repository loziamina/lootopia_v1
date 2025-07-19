import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Non autorisé' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'ADMIN') return res.status(403).json({ message: 'Accès interdit' });

    const { id } = req.query;

    if (req.method === 'DELETE') {
      await prisma.review.delete({ where: { id: parseInt(id) } });
      return res.status(200).json({ message: 'Review supprimée' });
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
