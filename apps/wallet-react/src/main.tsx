import { InstallPWAContextProvider } from '@datev/usePWA';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App, { TempApp } from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <InstallPWAContextProvider>
      <TempApp>
        <App />
      </TempApp>
    </InstallPWAContextProvider>
  </StrictMode>
);
