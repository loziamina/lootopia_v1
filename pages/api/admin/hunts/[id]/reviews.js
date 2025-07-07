import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'USER' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method === 'GET') {
      const reviews = await prisma.review.findMany({
        where: {
          huntId: parseInt(id),
        },
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
          hunt: {
            select: { title: true },
          },
        },
      });

      return res.status(200).json(reviews);
    }

    if (req.method === 'POST') {
      const { userId, score, comment } = req.body;

      if (!userId || !score || !comment) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newReview = await prisma.review.create({
        data: {
          userId,
          huntId: parseInt(id),
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
