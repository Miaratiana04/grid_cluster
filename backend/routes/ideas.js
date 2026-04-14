import express from 'express';
import Idea from '../models/Idea.js';

const router = express.Router();

// GET toutes les idées de l'utilisateur
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des idées' });
  }
});

// GET une idée spécifique
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findOne({ _id: req.params.id, userId: req.userId });
    if (!idea) {
      return res.status(404).json({ message: 'Idée non trouvée' });
    }
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST créer une nouvelle idée
router.post('/', async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Le titre est obligatoire' });
    }

    const newIdea = new Idea({
      userId: req.userId,
      title,
      description: description || '',
      category: category || 'autre',
      tags: tags || []
    });

    await newIdea.save();
    res.status(201).json(newIdea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création' });
  }
});

// PUT mettre à jour une idée
router.put('/:id', async (req, res) => {
  try {
    const { title, description, category, isCompleted, tags } = req.body;

    const idea = await Idea.findOne({ _id: req.params.id, userId: req.userId });
    if (!idea) {
      return res.status(404).json({ message: 'Idée non trouvée' });
    }

    if (title) idea.title = title;
    if (description !== undefined) idea.description = description;
    if (category) idea.category = category;
    if (isCompleted !== undefined) idea.isCompleted = isCompleted;
    if (tags) idea.tags = tags;

    await idea.save();
    res.json(idea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

// DELETE supprimer une idée
router.delete('/:id', async (req, res) => {
  try {
    const idea = await Idea.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!idea) {
      return res.status(404).json({ message: 'Idée non trouvée' });
    }
    res.json({ message: 'Idée supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;