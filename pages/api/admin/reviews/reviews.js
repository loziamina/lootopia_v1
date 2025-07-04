import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    // Admin only can access this endpoint
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method === 'GET') {
      // Fetch all reviews
      const reviews = await prisma.review.findMany({
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
          hunt: {
            select: { title: true },
          },
        },
      });

      return res.status(200).json(reviews);
    }

    if (req.method === 'POST') {
      const { userId, huntId, score, comment } = req.body;

      if (!userId || !huntId || !score || !comment) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create a new review
      const newReview = await prisma.review.create({
        data: {
          userId,
          huntId,
          score,
          comment,
        },
      });

      return res.status(201).json(newReview);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
