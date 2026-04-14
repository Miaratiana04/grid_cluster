import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShieldCheck, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.username, formData.email, formData.password, formData.confirmPassword);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la communication avec le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content animate-in">
        <div className="auth-header">
          <div className="logo-box">
            <LogIn size={32} className="logo-icon" />
          </div>
          <h1>{isLogin ? 'Connexion' : 'Création de compte'}</h1>
          <p className="description">
            {isLogin 
              ? 'Accédez à votre coffre-fort d’idées.' 
              : 'Commencez à organiser vos projets dès aujourd’hui.'}
          </p>
        </div>

        <div className="card auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <div className="input-container">
                  <User size={18} className="field-icon" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="mon_pseudo"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <div className="input-container">
                <Mail size={18} className="field-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-container">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmez le mot de passe</label>
                <div className="input-container">
                  <ShieldCheck size={18} className="field-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="error-alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                  <span>{isLogin ? 'Se connecter' : 'Créer un compte'}</span>
                </div>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>ou</span>
          </div>

          <button
            type="button"
            className="btn-ghost w-full"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ username: '', email: '', password: '', confirmPassword: '' });
            }}
          >
            {isLogin ? "S'inscrire gratuitement" : "Déjà membre ? Se connecter"}
          </button>
        </div>

        <p className="auth-legal">
          En continuant, vous acceptez nos <span>Conditions d'utilisation</span> et notre <span>Politique de confidentialité</span>.
        </p>
      </div>
    </div>
  );
}