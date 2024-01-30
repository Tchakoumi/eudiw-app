import { useEffect } from 'react';
import { useInstallPWA } from '../installPWAContext/InstallPWAProvider';
import { BeforeInstallPromptEvent } from '../installPWAContext/installPWA.interface';

type EventHandler = EventListenerOrEventListenerObject;

export function usePWA() {
  const { deferredPrompt, isInstalling, installPWADispatch } = useInstallPWA();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt: EventHandler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      installPWADispatch({
        payload: e as BeforeInstallPromptEvent,
        type: 'SET_PROMPT',
      });
    };

    const handleAppInstalled: EventHandler = () => {
      installPWADispatch({ payload: null, type: 'SET_PROMPT' });
    };

    const cleanup = () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      installPWADispatch({ type: 'CLEANUP' });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return cleanup;
  }, [installPWADispatch]);

  async function installApp() {
    installPWADispatch({ payload: true, type: 'UPDATE_INSTALLATION_STATUS' });
    deferredPrompt?.prompt().then(() => {
      installPWADispatch({
        payload: false,
        type: 'UPDATE_INSTALLATION_STATUS',
      });
    });
  }

  return {
    isInstalled: !deferredPrompt,
    isInstallable: !!deferredPrompt && !isInstalling,
    isInstalling: isInstalling && !!deferredPrompt,
    installApp,
  };
}
