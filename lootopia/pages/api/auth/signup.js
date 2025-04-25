import jwt from 'jsonwebtoken';

let users = [
  { id: 1, email: 'test@lootopia.com', password: 'password123' }, // Exemple d'utilisateur pour tests
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Vérifier si l'email est déjà utilisé
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Créer un nouvel utilisateur
    const newUser = { id: users.length + 1, email, password };
    users.push(newUser);

    // Créer un token JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(201).json({ message: 'Utilisateur créé avec succès', token });
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
