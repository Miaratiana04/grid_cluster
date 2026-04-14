import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['business', 'étude', 'personnel', 'créatif', 'autre'],
    default: 'autre'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Mise à jour automatique de updatedAt
ideaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Idea', ideaSchema);