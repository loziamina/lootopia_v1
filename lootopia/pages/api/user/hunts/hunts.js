import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou mal formé' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Erreur de vérification du token :", error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }

  if (decoded.role !== 'USER') {
    return res.status(403).json({ message: 'Accès refusé : réservé aux utilisateurs' });
  }

  if (req.method === 'GET') {
    try {
      const hunts = await prisma.treasureHunt.findMany({
        include: {
          createdBy: {
            select: { id: true, email: true },
          },
        },
      });
      return res.status(200).json(hunts);
    } catch (error) {
      console.error("Erreur lors de la récupération des chasses :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
