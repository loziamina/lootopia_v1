import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // The hunt ID
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    // Allow only user or admin
    if (decoded.role !== 'USER' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method === 'GET') {
      // Fetch reviews for a specific hunt (id)
      const reviews = await prisma.review.findMany({
        where: {
          huntId: parseInt(id),
        },
        include: {
          user: {
            select: { firstName: true, lastName: true },
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

      // Create a new review for a specific hunt (id)
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

    if (req.method === 'DELETE') {
      // Delete the review
      const { reviewId } = req.body;

      if (!reviewId) {
        return res.status(400).json({ message: 'Review ID is required' });
      }

      const deletedReview = await prisma.review.delete({
        where: {
          id: reviewId,
        },
      });

      return res.status(200).json(deletedReview);
    }

    if (req.method === 'PUT') {
      const { reviewId, score, comment } = req.body;

      if (!reviewId || !score || !comment) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Update the review
      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          score,
          comment,
        },
      });

      return res.status(200).json(updatedReview);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
