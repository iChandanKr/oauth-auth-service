import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface UserDashboardProps {
  user: {
    id: string;
    firstName: string;
    lastName?: string | null;
    email: string;
    provider: 'local' | 'google' | 'github';
    providerId?: string | null;
    createdAt?: string;
  };
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const getInitials = () => {
    const first = user.firstName ? user.firstName[0] : '';
    const last = user.lastName ? user.lastName[0] : '';
    return (first + last).toUpperCase() || 'U';
  };

  const getProviderIcon = () => {
    switch (user.provider) {
      case 'google':
        return (
          <svg className="provider-icon google-color" viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="currentColor"
              d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.92 1 1 5.92 1 12s4.92 11 11.24 11c6.6 0 11-4.65 11-11.2 0-.756-.08-1.333-.18-1.815H12.24z"
            />
          </svg>
        );
      case 'github':
        return (
          <svg className="provider-icon github-color" viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="currentColor"
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
        );
      default:
        return (
          <svg className="provider-icon local-color" viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
            />
          </svg>
        );
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <Card className="dashboard-card">
        <div className="dashboard-header">
          <div className="avatar-container">
            <div className="avatar-circle">
              {getInitials()}
            </div>
            <span className={`status-badge badge-${user.provider}`}>
              {getProviderIcon()} {user.provider}
            </span>
          </div>
          <div className="user-title">
            <h2>{user.firstName} {user.lastName || ''}</h2>
            <p className="user-email">{user.email}</p>
          </div>
        </div>

        <div className="dashboard-details">
          <h3>Authentication Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">User ID</span>
              <span className="detail-value monospace">{user.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Authentication Method</span>
              <span className="detail-value capitalize">{user.provider} Auth</span>
            </div>
            {user.providerId && (
              <div className="detail-item">
                <span className="detail-label">OAuth Provider ID</span>
                <span className="detail-value monospace">{user.providerId}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Account Created</span>
              <span className="detail-value">{formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-info-section">
          <h3>Multi-Provider Architecture Ready</h3>
          <p>
            Your account is linked using the unified <code>providerId</code> database schema. In the future, when we integrate GitHub, Discord, or other OAuth providers, users will be mapped to this exact record seamlessly.
          </p>
        </div>

        <div className="dashboard-actions">
          <Button variant="danger" onClick={onLogout} className="w-full">
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};
