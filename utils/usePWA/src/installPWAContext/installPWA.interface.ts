export interface InstallPWAContextProviderProps {
  children: JSX.Element;
}

export type Action =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'SET_PROMPT'; payload: any | null }
  | { type: 'UPDATE_INSTALLATION_STATUS'; payload: boolean }
  | { type: 'CLEANUP' };

export interface InstallPWA {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deferredPrompt: any | null;
  is_installing: boolean;
  installPWADispatch: React.Dispatch<Action>;
}

export type State = InstallPWA;
