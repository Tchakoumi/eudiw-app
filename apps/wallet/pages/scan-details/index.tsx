import { Box } from '@mui/material';
import ConnectionDialog from '../../components/scanDetails/connectionDialog';

export default function Index() {
  return (
    <Box>
      <ConnectionDialog
        connectionLink="https://google.com"
        isDialogOpen={true}
      />
      Scan details page
    </Box>
  );
}
