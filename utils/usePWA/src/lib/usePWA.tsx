import { useEffect } from 'react';
import { useInstallPWA } from '../installPWAContext/InstallPWAProvider';
import { BeforeInstallPromptEvent } from '../installPWAContext/installPWA.interface';

type EventHandler = EventListenerOrEventListenerObject;

//This is to make type window.safari
// (detect safari browser on desktop) usage typesafe
declare global {
  interface Window {
    safari: unknown;
  }
}

export function isIosOrSafariDesktop() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) || window.safari !== undefined;
}

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
    isInstallable:
      !!deferredPrompt &&
      !isInstalling &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches),
    isInstalling: isInstalling && !!deferredPrompt,
    iOS: {
      isInstallable: !window.matchMedia('(display-mode: standalone)'),
      isInstalled: !!window.matchMedia('(display-mode: standalone)'),
    },
    installApp,
  };
}
