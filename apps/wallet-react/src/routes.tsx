import Home from './pages/Home';

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
];
