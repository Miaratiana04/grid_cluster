import { useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import './App.css';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <Auth />;
}