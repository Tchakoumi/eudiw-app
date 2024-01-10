import { Reducer, useContext, useReducer } from 'react';
import InstallPWAContext from './InstallPWAContext';

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
      return { ...state, is_installing: action.payload };
    }
    case 'CLEANUP': {
      return {
        deferredPrompt: null,
        installPWADispatch: () => null,
        is_installing: false,
      };
    }
    default:
      return state;
  }
};

export function InstallPWAContextProvider({
  children,
}: InstallPWAContextProviderProps): JSX.Element {
  const initialState: InstallPWA = {
    deferredPrompt: null,
    is_installing: false,
    installPWADispatch: () => null,
  };

  const [installPWAState, installPWADispatch] = useReducer(
    installPWAReducer,
    initialState
  );
  const value = {
    deferredPrompt: installPWAState.deferredPrompt,
    is_installing: installPWAState.is_installing,
    installPWADispatch,
  };

  return (
    <InstallPWAContext.Provider value={value}>
      {children}
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
