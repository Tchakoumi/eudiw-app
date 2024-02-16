import { Box } from '@mui/material';
import NoCredentials from '../../components/credentials/NoCredentials';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

export default function Credentials() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header />
      <NoCredentials />
      <Footer showArrow={false} />
    </Box>
  );
}
