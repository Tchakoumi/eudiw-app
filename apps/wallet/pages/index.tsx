import { usePWA } from '@datev/usePWA';
import { Box } from '@mui/material';
import Footer from '../components/home/Footer';
import Header from '../components/home/Header';
import HomeBody from '../components/home/HomeBody';
import InstallPWA from '../components/home/InstallPWA';

export default function Index() {
  const { isInstallable } = usePWA();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: isInstallable
          ? 'auto auto 1fr auto'
          : 'auto 1fr auto',
      }}
    >
      {isInstallable && <InstallPWA />}
      <Header />
      <HomeBody />
      <Footer />
    </Box>
  );
}
