import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès interdit' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }

  if (method === 'DELETE') {
    try {
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
