import { useEffect, useState } from 'react';

export function usePWA() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  useEffect(() => {
    //TODO: find-out how to type the event on `handleBeforeInstallPrompt`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const checkIsAppInstalled = () => {
      setDeferredPrompt(null);
    };

    const cleanup = () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', checkIsAppInstalled);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', checkIsAppInstalled);

    return cleanup;
  }, []);

  async function installApp() {
    setIsInstalling(true);
    deferredPrompt.prompt().then(() => {
      setIsInstalling(false);
    });
  }

  return {
    isInstalled: !deferredPrompt,
    isInstallable: !!deferredPrompt && !isInstalling,
    isInstalling: isInstalling && !!deferredPrompt,
    installApp,
  };
}
