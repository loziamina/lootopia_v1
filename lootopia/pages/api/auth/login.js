import jwt from 'jsonwebtoken';

const users = [
  { id: 1, email: 'test@lootopia.com', password: 'password123' }, // Exemple d'utilisateur pour les tests
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const user = users.find((user) => user.email === email && user.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Crée un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({ token });
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
