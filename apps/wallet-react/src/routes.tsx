import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Scan from './pages/scan/Scan';
import SelectCredential from './pages/selectCredential/SelectCredential';

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
    element: <SelectCredential />,
    path: '/credential-type',
  },
  {
    element: <Navigate to="/" />,
    path: '*',
  },
];
