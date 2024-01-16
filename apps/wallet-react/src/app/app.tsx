import { ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import { useTheme } from '../utils/theme';
import NxWelcome from './nx-welcome';

export function TempApp({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={useTheme()}>{children}</ThemeProvider>;
}

export default function App() {
  return (
    <div>
      <NxWelcome title="wallet-react" />
    </div>
  );
}
