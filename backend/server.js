import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import ideaRoutes from './routes/ideas.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (plus robuste)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/idea-vault')
// mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/idea-vault')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => {
    console.error('Erreur MongoDB:', err);
    process.exit(1); // stop app si DB KO
  });

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/ideas', authenticate, ideaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Gestion erreurs globale (important)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});