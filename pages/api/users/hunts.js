import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'ton-secret';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }

  const userId = decoded.id;

  try {
    const participations = await prisma.participation.findMany({
      where: { userId },
      include: { hunt: true },
    });

    const huntsWithStatus = participations.map((p) => ({
      ...p.hunt,
      status: p.status,
    }));

    return res.status(200).json(huntsWithStatus);
  } catch (error) {
    console.error('Erreur API /api/users/hunts:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
