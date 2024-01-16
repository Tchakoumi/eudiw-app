import { ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from '../routes';
import { useTheme } from '../utils/theme';

export default function App({ children }: { children?: ReactNode }) {
  const routing = useRoutes(routes);
  return <ThemeProvider theme={useTheme()}>{routing}</ThemeProvider>;
}
