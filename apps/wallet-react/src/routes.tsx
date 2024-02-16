import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Scan from './pages/scan/Scan';
import CredentialType from './pages/credential-type/CredentialType';

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
    element: <CredentialType />,
    path: '/credential-type',
  },
  {
    element: <Navigate to="/" />,
    path: '*',
  },
];
