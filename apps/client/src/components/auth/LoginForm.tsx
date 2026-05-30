import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { GoogleLoginButton } from './GoogleLoginButton';

interface User {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  provider: 'local' | 'google' | 'github';
  providerId?: string | null;
  createdAt?: string;
}

interface LoginFormProps {
  onLoginSuccess: (user: User, token: string) => void;
  apiUrl: string;
  googleClientId: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  apiUrl,
  googleClientId,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Map id from format "input-xxxx" or direct field name
    const field = id.includes('-') ? id.split('-')[0] : id;
    const key = field === 'email' ? 'email' : field === 'firstName' ? 'firstName' : field === 'lastName' ? 'lastName' : 'password';

    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (isRegister) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const endpoint = isRegister ? '/api/v1/auth/register' : '/api/v1/auth/login';
    const payload = isRegister
      ? {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName || null,
          password: formData.password,
        }
      : { email: formData.email }; // Login schema on server only requires email

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Google authentication failed');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google authentication failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: Error) => {
    setErrorMessage(error.message);
  };

  return (
    <Card className="auth-card animate-fade-in">
      <div className="auth-header">
        <h2>{isRegister ? 'Create an Account' : 'Welcome Back'}</h2>
        <p className="auth-subtitle">
          {isRegister
            ? 'Sign up to get started with Google OAuth Service'
            : 'Sign in to access your secure developer dashboard'}
        </p>
      </div>

      {errorMessage && (
        <div className="alert alert-error animate-shake">
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {isRegister && (
          <div className="form-row">
            <Input
              label="First Name"
              type="text"
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              type="text"
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          id="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
        />

        {isRegister && (
          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
          />
        )}

        <Button type="submit" isLoading={isLoading} className="w-full mt-4">
          {isRegister ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <div className="social-auth-container">
        <GoogleLoginButton
          clientId={googleClientId}
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>

      <div className="auth-footer">
        <p>
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage(null);
              setErrors({});
            }}
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </Card>
  );
};
