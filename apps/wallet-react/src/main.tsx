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

// const registerServiceWorker = async () => {
//   if ('serviceWorker' in navigator) {
//     try {
//       const registration = await navigator.serviceWorker.register(
//         '/service-worker.js',
//         {
//           scope: '/',
//         }
//       );
//       if (registration.installing) {
//         console.log('Service worker installing');
//       } else if (registration.waiting) {
//         console.log('Service worker installed');
//       } else if (registration.active) {
//         console.log('Service worker active');
//       }
//     } catch (error) {
//       console.error(`Registration failed with ${error}`);
//     }
//   }
// };

// registerServiceWorker();
