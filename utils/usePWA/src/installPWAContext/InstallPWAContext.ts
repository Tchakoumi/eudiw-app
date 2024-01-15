import { createContext } from 'react';
import { InstallPWA } from './installPWA.interface';

export const initialState: InstallPWA = {
  deferredPrompt: null,
  is_installing: false,
  installPWADispatch: () => null,
};
const InstallPWAContext = createContext(initialState);

export default InstallPWAContext;
