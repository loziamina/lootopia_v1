import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou mal formé' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }

  try {
    const participation = await prisma.participation.create({
      data: {
        huntId: parseInt(id),
        userId: decoded.id,
      },
    });
    return res.status(200).json(participation);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la participation' });
  }
}
