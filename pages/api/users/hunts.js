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
  const userRole = decoded.role;  // Récupère le rôle de l'utilisateur

  // Empêcher le cache côté client
  res.setHeader('Cache-Control', 'no-store');

  try {
    // Si l'utilisateur est admin, il peut voir toutes les chasses créées par lui-même
    if (userRole === 'ADMIN') {
      const createdHunts = await prisma.treasureHunt.findMany({
        where: {
          createdById: userId, // Toutes les chasses créées par l'utilisateur admin
        },
      });

      if (!createdHunts || createdHunts.length === 0) {
        return res.status(404).json({ message: 'Aucune chasse trouvée' });
      }

      return res.status(200).json(createdHunts);  // Retourne les chasses créées par l'admin
    }

    // Sinon, pour un utilisateur standard, on récupère toutes les chasses créées par un admin
    const hunts = await prisma.treasureHunt.findMany({
      where: {
        // Optionnel: Tu peux filtrer pour montrer uniquement les chasses créées par un admin spécifique
      },
    });

    // Si aucune chasse n'est trouvée
    if (!hunts || hunts.length === 0) {
      return res.status(404).json({ message: 'Aucune chasse trouvée' });
    }

    // On récupère les participations de l'utilisateur à ces chasses
    const participations = await prisma.participation.findMany({
      where: { userId },
      include: {
        hunt: true,  // Inclure les informations des chasses auxquelles l'utilisateur a participé
      },
    });

    // Transformer les chasses en ajoutant le statut de participation
    const huntsWithParticipationStatus = hunts.map((hunt) => {
      const participation = participations.find((p) => p.huntId === hunt.id);
      return {
        ...hunt,
        status: participation ? participation.status : 'NOT_PARTICIPATED', // Indiquer si l'utilisateur a participé
      };
    });

    return res.status(200).json(huntsWithParticipationStatus);  // Retourner toutes les chasses avec leur statut
  } catch (error) {
    console.error('Erreur API /api/users/hunts:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
