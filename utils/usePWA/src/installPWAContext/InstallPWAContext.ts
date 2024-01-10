import { createContext } from 'react';
import { InstallPWA } from './installPWA.interface';

const InstallPWAContext = createContext<InstallPWA>({
  deferredPrompt: null,
  is_installing: false,
  installPWADispatch: () => null,
});

export default InstallPWAContext;
