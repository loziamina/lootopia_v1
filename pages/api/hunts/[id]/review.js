import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const huntId = req.query.id;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Vérifie ton JWT
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }

  const userId = decoded.id;

  if (req.method === 'POST') {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Contenu vide' });
    }

    try {
      const review = await prisma.review.create({
        data: {
          content,
          userId,
          huntId: parseInt(huntId),
        },
        include: { user: true },
      });
      return res.status(201).json(review);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur', details: error });
    }
  }

  if (req.method === 'GET') {
    try {
      const reviews = await prisma.review.findMany({
        where: { huntId: parseInt(huntId) },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur', details: error });
    }
  }

  if (req.method === 'DELETE') {
    const { reviewId } = req.body;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (review?.userId !== userId) {
      return res.status(403).json({ error: 'Interdit' });
    }

    await prisma.review.delete({ where: { id: reviewId } });
    return res.status(204).end();
  }

  if (req.method === 'PUT') {
    const { reviewId, content } = req.body;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (review?.userId !== userId) {
      return res.status(403).json({ error: 'Interdit' });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { content },
    });

    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
