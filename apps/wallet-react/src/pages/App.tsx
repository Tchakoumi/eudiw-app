import { ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import '../assets/styles/global.css';
import { routes } from '../routes';
import { useTheme } from '../utils/theme';
import { usePWA } from '@datev/usePWA';
import { OID4VCIServiceImpl } from '@datev/oid4vci';
import { eventBus } from '@datev/event-bus';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const service = new OID4VCIServiceImpl(eventBus);
    console.log({ env: process.env });
  });

  usePWA();
  const routing = useRoutes(routes);
  return <ThemeProvider theme={useTheme()}>{routing}</ThemeProvider>;
}
