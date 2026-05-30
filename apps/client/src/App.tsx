import { useState, useEffect } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { ThemeSwitcher } from './components/ui/ThemeSwitcher';
import './App.css';

interface User {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  provider: 'local' | 'google' | 'github';
  providerId?: string | null;
  createdAt?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Environment variables with fallback defaults
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER.apps.googleusercontent.com";
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    // Restore session on mount
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Clear corrupt state
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsCheckingSession(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User, sessionToken: string) => {
    setUser(loggedInUser);
    localStorage.setItem('auth_token', sessionToken);
    localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    // Clear Google Identity Services session if loaded
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.disableAutoSelect();
    }
  };

  if (isCheckingSession) {
    return (
      <div className="app-loader">
        <div className="loader-spinner"></div>
        <p>Initializing Session...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-navbar">
        <div className="nav-brand">
          <span className="logo-icon">🔑</span>
          <h1>OAuth Service</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <div className="nav-status">
            <span className="status-dot online"></span>
            <span className="status-text">Backend Connected</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {user ? (
          <UserDashboard user={user} onLogout={handleLogout} />
        ) : (
          <div className="auth-wrapper">
            <LoginForm
              googleClientId={googleClientId}
              apiUrl={apiUrl}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} OAuth Authentication Service. Built with React & Express.</p>
      </footer>
    </div>
  );
}

export default App;
