import { useEffect, useState } from 'react';
import { ideaService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  LogOut, 
  Filter, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  LayoutGrid, 
  Search,
  User as UserIcon
} from 'lucide-react';

import IdeaCard from '../components/IdeaCard';
import IdeaModal from '../components/IdeaModal';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const data = await ideaService.getAll();
      setIdeas(data);
    } catch (err) {
      console.error('Erreur chargement idées:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleSave = async (ideaData) => {
    try {
      if (selectedIdea) {
        await ideaService.update(selectedIdea._id, ideaData);
      } else {
        await ideaService.create(ideaData);
      }
      setIsModalOpen(false);
      setSelectedIdea(null);
      fetchIdeas();
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    try {
      await ideaService.delete(id);
      fetchIdeas();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleEdit = (idea) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  const handleToggleComplete = async (id, currentValue) => {
    try {
      await ideaService.update(id, { isCompleted: !currentValue });
      fetchIdeas();
    } catch (err) {
      console.error('Erreur toggle:', err);
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    const matchesFilter = 
      filter === 'all' ? true : 
      filter === 'completed' ? idea.isCompleted : 
      !idea.isCompleted;
    
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (idea.description && idea.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-layout animate-in">
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-left">
            <div className="brand-logo">
              <Lightbulb className="brand-icon" size={24} />
              <span>IdeaVault</span>
            </div>
            <div className="nav-divider"></div>
            <div className="nav-search">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Rechercher une idée..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="nav-right">
            <div className="user-badge">
              <UserIcon size={16} />
              <span>{user?.username || user?.email}</span>
            </div>
            <button className="btn-logout" onClick={logout} title="Déconnexion">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-header">
          <div className="header-info">
            <h1>Tableau de bord</h1>
            <p>Gérez et organisez vos concepts innovants.</p>
          </div>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setSelectedIdea(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} />
            <span>Nouvelle Idée</span>
          </button>
        </div>

        <div className="content-filters">
          <div className="filter-group">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <LayoutGrid size={16} />
              Toutes
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              <Clock size={16} />
              Actives
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              <CheckCircle2 size={16} />
              Terminées
            </button>
          </div>
          <div className="stats-mini">
            <span>{filteredIdeas.length} {filteredIdeas.length > 1 ? 'idées' : 'idée'}</span>
          </div>
        </div>

        <div className="ideas-grid">
          {loading ? (
            <div className="status-box">
              <div className="spinner"></div>
              <p>Synchronisation...</p>
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="status-box empty">
              <Lightbulb size={48} className="empty-icon" />
              <h3>Aucune idée trouvée</h3>
              <p>Explorez de nouveaux horizons ou ajustez vos filtres.</p>
              {searchTerm && (
                <button className="btn-ghost" onClick={() => setSearchTerm('')}>
                  Effacer la recherche
                </button>
              )}
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea._id}
                idea={idea}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))
          )}
        </div>
      </main>

      {isModalOpen && (
        <IdeaModal
          idea={selectedIdea}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedIdea(null);
          }}
        />
      )}
    </div>
  );
}