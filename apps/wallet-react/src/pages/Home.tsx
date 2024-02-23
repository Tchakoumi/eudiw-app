import { Box } from '@mui/material';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import HomeBody from '../components/home/HomeBody';

export default function Home() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header />
      <HomeBody />
      <Footer />
    </Box>
  );
}
