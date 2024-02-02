import { Reducer, useContext, useEffect, useReducer, useState } from 'react';
import InstallPWAContext, { initialState } from './installPWAContext';

import Banner from '../lib/components/Banner';
import Tooltip from '../lib/components/Tooltip';
import { isIosOrSafariDesktop } from '../lib/usePWA';
import {
  Action,
  InstallPWA,
  InstallPWAContextProviderProps,
  State,
} from './installPWA.interface';

const installPWAReducer: Reducer<InstallPWA, Action> = (
  state: State,
  action: Action
) => {
  switch (action.type) {
    case 'SET_PROMPT': {
      return { ...state, deferredPrompt: action.payload };
    }
    case 'UPDATE_INSTALLATION_STATUS': {
      return { ...state, isInstalling: action.payload };
    }
    case 'CLEANUP': {
      return initialState;
    }
    default:
      return state;
  }
};

export function InstallPWAContextProvider({
  children,
  component = isIosOrSafariDesktop() ? 'tooltip' : 'banner',
}: InstallPWAContextProviderProps): JSX.Element {
  const [installPWAState, installPWADispatch] = useReducer(
    installPWAReducer,
    initialState
  );

  const value = {
    ...installPWAState,
    installPWADispatch,
  };

  const isInstallable =
    !!value.deferredPrompt &&
    !value.isInstalling &&
    !(
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches
    );

  async function installApp() {
    installPWADispatch({ payload: true, type: 'UPDATE_INSTALLATION_STATUS' });
    value.deferredPrompt?.prompt().then(() => {
      installPWADispatch({
        payload: false,
        type: 'UPDATE_INSTALLATION_STATUS',
      });
    });
  }

  const isAppleInstallable =
    !window.matchMedia('(display-mode: standalone)') &&
    isIosOrSafariDesktop() &&
    !value.deferredPrompt;

  const [isIosInstallOpen, setIsIosInstallOpen] = useState<boolean>(true);

  function getPresentation() {
    switch (component) {
      case 'banner':
        return (
          <Banner
            installApp={installApp}
            isAppleDevice={isAppleInstallable}
            close={() => setIsIosInstallOpen(false)}
          />
        );
      case 'tooltip':
        return <Tooltip close={() => setIsIosInstallOpen(false)} />;
      case 'popup':
        return (
          <Banner
            installApp={installApp}
            isAppleDevice={isAppleInstallable}
            close={() => setIsIosInstallOpen(false)}
          />
        );
      default:
        return component;
    }
  }

  useEffect(() => {
    if (!isIosInstallOpen && isAppleInstallable) {
      setTimeout(() => {
        setIsIosInstallOpen(true);
      }, 3000);
    }
  }, [isAppleInstallable, isIosInstallOpen]);

  const showInstall = (isInstallable || isAppleInstallable) && isIosInstallOpen;

  // export function isIosOrSafariDesktop() {
  //   const userAgent = window.navigator.userAgent.toLowerCase();
  //   return /iphone|ipad|ipod/.test(userAgent) || window.safari !== undefined;
  // }

  console.log(
    `isIosOrSafariDesktop: ${isIosOrSafariDesktop() ? 'true' : 'false'}`
  );
  console.log(`window.safari: ${window.safari ? 'true' : 'false'}`);
  console.log(`isInstallable: ${isInstallable}`);
  console.log(`isAppleInstallable: ${isAppleInstallable}`);
  console.log(`isIosInstallOpen: ${isIosInstallOpen}`);
  console.log(`showInstall: ${showInstall}`);

  return (
    <InstallPWAContext.Provider value={value}>
      <div
        style={{
          display: 'grid',
          gridTemplateRows:
            showInstall && component === 'banner' ? 'auto 1fr' : '1fr',
          height: '100%',
        }}
      >
        {showInstall && getPresentation()}
        {children}
      </div>
    </InstallPWAContext.Provider>
  );
}

export default InstallPWAContextProvider;

export const useInstallPWA = () => {
  const context = useContext(InstallPWAContext);
  if (!context) {
    throw new Error(
      'useInstallPWA must be used as a descendant of InstallPWAProvider'
    );
  } else return context;
};
