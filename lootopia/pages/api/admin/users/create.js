import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Non autorisé' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { firstName, lastName, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error('Erreur API création utilisateur :', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
