import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return res.status(201).json({ message: 'Utilisateur créé avec succès', token });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
