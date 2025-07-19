import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY =
  process.env.JWT_SECRET ||
  '792b55da86fd528acda88b1af15ef3430a8933d58ce12ab686cf84208b4e667e1257df222b0a4dd55ed95d3dc2b3657553557a2d826fc1d4e566cc6b223fc57f';

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

  const userRole = decoded.role;
  if (userRole !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  try {
    const hunts = await prisma.treasureHunt.findMany({
      include: {
        participations: true, // pour accéder à tous les statuts des users
      },
    });

    const huntsWithStatus = hunts.map((hunt) => {
      let status = 'PENDING'; // par défaut

      const participations = hunt.participations;

      if (participations.length > 0) {
        const hasCompleted = participations.some((p) => p.status === 'COMPLETED');
        const hasInProgress = participations.some((p) => p.status === 'IN_PROGRESS');

        if (hasCompleted) {
          status = 'COMPLETED';
        } else if (hasInProgress) {
          status = 'IN_PROGRESS';
        } else {
          status = 'PENDING';
        }
      }

      return {
        id: hunt.id,
        title: hunt.title,
        description: hunt.description,
        image: hunt.image || null,
        status, // 'PENDING', 'IN_PROGRESS', 'COMPLETED'
      };
    });

    return res.status(200).json(huntsWithStatus);
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
