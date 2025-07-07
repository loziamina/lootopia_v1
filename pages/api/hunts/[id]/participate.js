import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;  // Récupère l'ID de la chasse depuis l'URL
  const authHeader = req.headers.authorization;

  // Vérification du token JWT
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

  // Vérification si l'utilisateur a déjà participé à cette chasse
  try {
    // Vérification si la chasse existe
    const hunt = await prisma.treasureHunt.findUnique({
      where: { id: parseInt(id) },
    });

    if (!hunt) {
      return res.status(404).json({ message: 'Chasse non trouvée' });
    }

    // Vérification si l'utilisateur a déjà participé
    const existingParticipation = await prisma.participation.findFirst({
      where: {
        userId: decoded.id,
        huntId: parseInt(id),
      },
    });

    if (existingParticipation) {
      return res.status(400).json({ message: 'Vous participez déjà à cette chasse' });
    }

    // Créer une nouvelle participation
    const participation = await prisma.participation.create({
      data: {
        huntId: parseInt(id),
        userId: decoded.id,
      },
    });

    return res.status(200).json(participation);
  } catch (error) {
    console.error('Erreur lors de la participation:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
