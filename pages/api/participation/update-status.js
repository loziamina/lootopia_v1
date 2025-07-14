import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY =
  process.env.JWT_SECRET ||
  '792b55da86fd528acda88b1af15ef3430a8933d58ce12ab686cf84208b4e667e1257df222b0a4dd55ed95d3dc2b3657553557a2d826fc1d4e566cc6b223fc57f';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

  const userId = decoded.id; // 👈 Assure-toi que c'est bien "id" dans ton token
  const { huntId, status } = req.body;

  if (!huntId || !status) {
    return res.status(400).json({ message: 'huntId et status requis' });
  }

  try {
    const participation = await prisma.participation.findFirst({
      where: {
        userId,
        huntId: parseInt(huntId, 10), // ✅ conversion ici
      },
    });

    if (!participation) {
      return res.status(404).json({ message: 'Participation non trouvée' });
    }

    const updated = await prisma.participation.update({
      where: { id: participation.id },
      data: { status },
    });

    return res.status(200).json({ message: 'Statut mis à jour', participation: updated });
  } catch (error) {
    console.error('Erreur de mise à jour :', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
