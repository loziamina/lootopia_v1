import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'ton-secret';

// La fonction handler doit être exportée par défaut
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'PUT') {
    return handlePut(req, res);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res);
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

// Récupérer les informations de l'utilisateur
async function handleGet(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, address: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Erreur vérification JWT :', error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

// Mettre à jour les informations de l'utilisateur
async function handlePut(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérification des informations envoyées par l'utilisateur
    const { firstName, lastName, email, address } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        firstName,
        lastName,
        email,
        address,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour des informations' });
  }
}

// Supprimer le profil de l'utilisateur
async function handleDelete(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Supprimer les participations liées à cet utilisateur
    await prisma.participation.deleteMany({
      where: { userId: decoded.id },
    });

    // Supprimer les critiques liées à cet utilisateur
    await prisma.review.deleteMany({
      where: { userId: decoded.id },
    });

    // Supprimer l'utilisateur
    const deletedUser = await prisma.user.delete({
      where: { id: decoded.id },
    });

    return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
}
