import React, { useEffect, useRef } from 'react';

interface GoogleLoginButtonProps {
  clientId: string;
  onSuccess: (idToken: string) => void;
  onError?: (error: Error) => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  clientId,
  onSuccess,
  onError,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      const google = window.google;
      if (google?.accounts?.id) {
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: { credential?: string }) => {
              if (response.credential) {
                onSuccess(response.credential);
              } else {
                if (onError) onError(new Error('No credentials returned from Google authentication'));
              }
            },
          });

          if (buttonRef.current) {
            google.accounts.id.renderButton(buttonRef.current, {
              theme: 'filled_black',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              width: 320,
            });
          }
        } catch (err) {
          if (onError) onError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.google?.accounts?.id) {
        clearInterval(interval);
        initializeGoogleSignIn();
      } else if (attempts >= 50) {
        clearInterval(interval);
        if (onError) onError(new Error('Google Sign-In SDK failed to load. Please check your network connection.'));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [clientId, onSuccess, onError]);

  return <div ref={buttonRef} className="google-btn-wrapper" />;
};
