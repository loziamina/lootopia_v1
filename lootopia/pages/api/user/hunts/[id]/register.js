import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou mal formé" });
  }

  const token = authHeader.split(" ")[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Erreur de vérification du token :", error);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }

  if (decoded.role !== "USER") {
    return res.status(403).json({ message: "Accès refusé : réservé aux utilisateurs" });
  }

  const { id } = req.query;

  if (req.method === "POST") {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "Nom complet et email sont obligatoires." });
    }

    try {
      // Vérifier que la chasse existe bien
      const hunt = await prisma.treasureHunt.findUnique({
        where: { id: parseInt(id) },
      });

      if (!hunt) {
        return res.status(404).json({ message: "Chasse non trouvée." });
      }

      // Vérifier qu’il n’y a pas déjà une inscription avec ce mail pour cette chasse
      const existingRegistration = await prisma.registration.findFirst({
        where: {
          huntId: hunt.id,
          email: email,
        },
      });

      if (existingRegistration) {
        return res.status(409).json({ message: "Vous êtes déjà inscrit à cette chasse." });
      }

      // Créer l'inscription
      const registration = await prisma.registration.create({
        data: {
          fullName,
          email,
          huntId: hunt.id,
          userId: decoded.id,  // lien avec utilisateur connecté
        },
      });

      return res.status(201).json({ message: "Inscription réussie.", registration });
    } catch (error) {
      console.error("Erreur lors de la création de l'inscription :", error);
      return res.status(500).json({ message: "Erreur serveur." });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée." });
  }
}
