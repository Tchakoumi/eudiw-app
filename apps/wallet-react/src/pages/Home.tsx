import { usePWA } from '@datev/usePWA';
import { Box } from '@mui/material';
import Footer from '../components/home/Footer';
import Header from '../components/home/Header';
import HomeBody from '../components/home/HomeBody';
import InstallPWABanner from '../components/home/InstallPWABanner';

export default function Home() {
  const { isInstallable, installApp } = usePWA();

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
      {isInstallable && <InstallPWABanner installApp={installApp} />}
      <Header />
      <HomeBody />
      <Footer />
    </Box>
  );
}
