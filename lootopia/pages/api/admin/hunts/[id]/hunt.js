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

  if (decoded.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès refusé : réservé aux admins' });
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

  if (req.method === 'PUT') {
    const { title, description, location, startDate, endDate, imageUrl } = req.body;

    try {
      const updated = await prisma.treasureHunt.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          location,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          mapStyle: imageUrl || null,
        },
      });

      return res.status(200).json(updated);
    } catch (error) {
      console.error('Erreur PUT chasse :', error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.treasureHunt.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ message: 'Chasse supprimée avec succès' });
    } catch (error) {
      console.error('Erreur DELETE chasse :', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
