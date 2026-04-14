import { useState, useEffect } from 'react';
import { X, Save, Type, AlignLeft, Tags, Layers } from 'lucide-react';
import './IdeaModal.css';

export default function IdeaModal({ idea, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'autre',
    tags: ''
  });

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title || '',
        description: idea.description || '',
        category: idea.category || 'autre',
        tags: idea.tags ? idea.tags.join(', ') : ''
      });
    }
  }, [idea]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      : [];
    
    onSave({
      ...formData,
      tags: tagsArray
    });
  };

  return (
    <div className="modal-backdrop animate-in" onClick={onClose}>
      <div 
        className="modal-content card" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="title-area">
            <div className="header-icon">
              {idea ? <Layers size={20} /> : <Save size={20} />}
            </div>
            <h2>{idea ? 'Éditer l’idée' : 'Nouvelle Idée'}</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <div className="input-group">
                <Type size={16} className="input-icon" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Donnez un nom à votre concept..."
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <div className="input-group">
                <Layers size={16} className="input-icon" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="business">Business</option>
                  <option value="étude">Étude</option>
                  <option value="personnel">Personnel</option>
                  <option value="créatif">Créatif</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (optinnelle)</label>
              <div className="input-group align-start">
                <AlignLeft size={16} className="input-icon mt-2" />
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Détails, objectifs, premières étapes..."
                  rows={4}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (séparés par des virgules)</label>
              <div className="input-group">
                <Tags size={16} className="input-icon" />
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="ex: tech, durable, local"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Save size={18} />
              <span>{idea ? 'Mettre à jour' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}