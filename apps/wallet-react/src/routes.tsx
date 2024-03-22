import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CredentialTypes from './pages/credential-types/CredentialTypes';
import Credentials from './pages/credentials/Credentials';
import Scan from './pages/scan/Scan';

export interface IRoute {
  path: string;
  element: JSX.Element;
  children?: IRoute[];
}

export const routes: IRoute[] = [
  {
    element: <Home />,
    path: '/',
  },
  {
    element: <Scan />,
    path: '/scan',
  },
  {
    element: <CredentialTypes />,
    path: '/credential-types',
  },
  {
    element: <Credentials />,
    path: '/credentials',
  },
  {
    element: <Navigate to="/" />,
    path: '*',
  },
];
