import { InstallPWAContextProvider } from '@datev/usePWA';
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
        component={'banner'}
        installPromptTimeout={30000}
      >
        <App />
      </InstallPWAContextProvider>
    </BrowserRouter>
  </StrictMode>
);
