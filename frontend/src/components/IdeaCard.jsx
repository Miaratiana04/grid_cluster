import { 
  Calendar, 
  Tag, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Circle,
  Briefcase,
  BookOpen,
  Target,
  Palette,
  Sparkles
} from 'lucide-react';
import './IdeaCard.css';

const CATEGORY_MAP = {
  business: { icon: Briefcase, color: '#6366f1', label: 'Business' },
  étude: { icon: BookOpen, color: '#8b5cf6', label: 'Étude' },
  personnel: { icon: Target, color: '#ec4899', label: 'Personnel' },
  créatif: { icon: Palette, color: '#f59e0b', label: 'Créatif' },
  autre: { icon: Sparkles, color: '#94a3b8', label: 'Autre' }
};

export default function IdeaCard({ idea, onEdit, onDelete, onToggleComplete }) {
  const category = CATEGORY_MAP[idea.category] || CATEGORY_MAP.autre;
  const CategoryIcon = category.icon;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Voulez-vous vraiment supprimer cette idée ?')) {
      onDelete(idea._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(idea);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleComplete(idea._id, idea.isCompleted);
  };

  return (
    <div 
      className={`card idea-card ${idea.isCompleted ? 'completed' : ''}`}
      onClick={handleEdit}
    >
      <div className="card-top">
        <div className="category-indicator" style={{ '--cat-color': category.color }}>
          <CategoryIcon size={14} />
          <span>{category.label}</span>
        </div>
        <button 
          className={`toggle-check ${idea.isCompleted ? 'active' : ''}`}
          onClick={handleToggle}
        >
          {idea.isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
        </button>
      </div>

      <div className="card-body">
        <h3>{idea.title}</h3>
        {idea.description && (
          <p className="description">{idea.description}</p>
        )}
      </div>

      <div className="card-footer">
        <div className="tags-row">
          {idea.tags && idea.tags.length > 0 ? (
            idea.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="tag-pill">
                <Tag size={10} />
                {tag}
              </span>
            ))
          ) : (
            <span className="no-tags">Aucun tag</span>
          )}
          {idea.tags && idea.tags.length > 3 && (
            <span className="tag-more">+{idea.tags.length - 3}</span>
          )}
        </div>
        
        <div className="actions">
          <button className="icon-btn edit" onClick={handleEdit} title="Modifier">
            <Edit3 size={16} />
          </button>
          <button className="icon-btn delete" onClick={handleDelete} title="Supprimer">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="card-meta">
        <Calendar size={12} />
        <span>
          {new Date(idea.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
          })}
        </span>
      </div>
    </div>
  );
}