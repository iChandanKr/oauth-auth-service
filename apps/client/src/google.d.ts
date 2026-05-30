export {};

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential?: string }) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'small' | 'medium' | 'large';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      width?: number;
    }
  ) => void;
  disableAutoSelect: () => void;
}

interface GoogleSDK {
  accounts?: {
    id?: GoogleAccountsId;
  };
}

declare global {
  interface Window {
    google?: GoogleSDK;
  }
}
