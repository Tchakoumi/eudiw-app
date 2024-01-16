import NxWelcome from './app/nx-welcome';

export interface IRoute {
  path: string;
  element: JSX.Element;
  children?: IRoute[];
}

export const routes: IRoute[] = [
  {
    element: <NxWelcome title="wallet-react" />,
    path: '/home',
  },
];
