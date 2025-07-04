import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    if (req.method === 'GET') {
      return res.status(200).json(user);
    }

    if (req.method === 'PUT') {
      const { email, password } = req.body;

      // Mise à jour des informations de l'utilisateur
      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          email: email || user.email, // Ne pas changer si l'email n'est pas fourni
          password: password || user.password, // Utiliser un mot de passe haché dans un vrai projet
        },
      });

      return res.status(200).json(updatedUser);
    }

    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}
