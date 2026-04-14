import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const userExists = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l’inscription' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.comparePassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la connexion' });
  }
});

router.get("/", (req, res) => {
  res.json({ message: "Auth API is running" });
});

export default router;
