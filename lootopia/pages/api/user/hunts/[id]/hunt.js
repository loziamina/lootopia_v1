import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non autorisé : token manquant' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }

  if (decoded.role !== 'USER') {
    return res.status(403).json({ message: 'Accès refusé : réservé aux users' });
  }

  if (req.method === 'GET') {
    try {
      const hunt = await prisma.treasureHunt.findUnique({
        where: { id: parseInt(id) },
        include: {
          createdBy: {
            select: { id: true, email: true }
          }
        }
      });

      if (!hunt) {
        return res.status(404).json({ message: 'Chasse non trouvée' });
      }

      return res.status(200).json(hunt);
    } catch (error) {
      console.error('Erreur GET chasse :', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }


  return res.status(405).json({ message: 'Méthode non autorisée' });
}
