import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './public/uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou mal formé' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }

  if (decoded.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  if (req.method === 'GET') {
    try {
      const hunts = await prisma.treasureHunt.findMany({
        include: { createdBy: { select: { id: true, email: true } } },
      });
      return res.status(200).json(hunts);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  if (req.method === 'POST') {
    upload.single('image')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: 'Erreur de téléchargement de l\'image' });
      } else if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      const { title, description, location, startDate, endDate } = req.body;
      const imageUrl = `/uploads/${req.file.filename}`; 

      if (!title || !location) {
        return res.status(400).json({ message: 'Champs obligatoires manquants' });
      }

      try {
        const hunt = await prisma.treasureHunt.create({
          data: {
            title,
            description,
            location,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            createdById: decoded.id,
            imageUrl: imageUrl, 
          },
        });

        return res.status(201).json(hunt);
      } catch (error) {
        console.error('Erreur lors de la création de la chasse:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
    });
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
