import { InstallPWAContextProvider } from '@datev/usePWA';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import App from './pages/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <InstallPWAContextProvider>
        <App />
      </InstallPWAContextProvider>
    </BrowserRouter>
  </StrictMode>
);
