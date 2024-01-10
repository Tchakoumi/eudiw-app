import { useEffect } from 'react';
import { useInstallPWA } from '../installPWAContext/installPWAContextProvider';

export function usePWA() {
  const { deferredPrompt, is_installing, installPWADispatch } = useInstallPWA();
  useEffect(() => {
    //TODO: find-out how to type the event on `handleBeforeInstallPrompt`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      installPWADispatch({ payload: e, type: 'SET_PROMPT' });
    };

    const checkIsAppInstalled = () => {
      installPWADispatch({ payload: null, type: 'SET_PROMPT' });
    };

    const cleanup = () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', checkIsAppInstalled);
      installPWADispatch({ type: 'CLEANUP' });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', checkIsAppInstalled);

    return cleanup;
  }, [installPWADispatch]);

  async function installApp() {
    installPWADispatch({ payload: true, type: 'UPDATE_INSTALLATION_STATUS' });
    deferredPrompt.prompt().then(() => {
      installPWADispatch({
        payload: false,
        type: 'UPDATE_INSTALLATION_STATUS',
      });
    });
  }

  return {
    isInstalled: !deferredPrompt,
    isInstallable: !!deferredPrompt && !is_installing,
    isInstalling: is_installing && !!deferredPrompt,
    installApp,
  };
}
