import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
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
    element: <Navigate to="/" />,
    path: '*',
  },
];
