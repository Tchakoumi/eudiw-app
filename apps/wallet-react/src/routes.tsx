import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CredentialTypes from './pages/credential-types/CredentialTypes';
import Credentials from './pages/credentials/Credentials';
import IssuanceScan from './pages/issuanceScan/IssuanceScan';
import PresentationScan from './pages/presentationScan/PresentationScan';

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
    element: <IssuanceScan />,
    path: '/issuance-scan',
  },
  {
    element: <PresentationScan />,
    path: '/presentation-scan',
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
