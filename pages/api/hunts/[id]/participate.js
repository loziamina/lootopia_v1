import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  const authHeader = req.headers.authorization;

  // Vérifie la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  // Vérifie le token dans le header Authorization
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

  const huntId = parseInt(id);
  const userId = decoded.id;

  try {
    // Vérifie si la chasse existe
    const hunt = await prisma.treasureHunt.findUnique({
      where: { id: huntId },
    });

    if (!hunt) {
      return res.status(404).json({ message: 'Chasse non trouvée' });
    }

    // Vérifie si l'utilisateur participe déjà
    const existingParticipation = await prisma.participation.findFirst({
      where: {
        userId,
        huntId,
      },
    });

    if (existingParticipation) {
      return res.status(200).json({
        message: 'Vous participez déjà à cette chasse.',
        alreadyParticipating: true,
      });
    }

    // Crée une nouvelle participation
    const participation = await prisma.participation.create({
      data: {
        userId,
        huntId,
      },
    });

    return res.status(200).json({
      message: 'Participation enregistrée avec succès.',
      participation,
      alreadyParticipating: false,
    });
  } catch (error) {
    console.error('Erreur lors de la participation :', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
