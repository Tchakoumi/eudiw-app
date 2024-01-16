import { ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import '../assets/styles/global.css';
import { routes } from '../routes';
import { useTheme } from '../utils/theme';

export default function App() {
  const routing = useRoutes(routes);
  return <ThemeProvider theme={useTheme()}>{routing}</ThemeProvider>;
}
