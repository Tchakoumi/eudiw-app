import { InstallPWAContextProvider, isIosOrSafariDesktop } from '@datev/usePWA';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import App from './pages/App';

import { baseHref } from './utils/config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter basename={baseHref}>
      <InstallPWAContextProvider
        component={isIosOrSafariDesktop() ? 'tooltip' : 'banner'}
      >
        <App />
      </InstallPWAContextProvider>
    </BrowserRouter>
  </StrictMode>
);
