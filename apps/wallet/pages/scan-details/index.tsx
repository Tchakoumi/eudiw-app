import { Box } from '@mui/material';
import ConnectionDialog from '../../components/scanDetails/connectionDialog';
import { useRouter } from 'next/router';

export default function Index() {
  const {
    query: { connection_string },
  } = useRouter();
  return (
    <Box>
      <ConnectionDialog
        connectionLink={(connection_string as string) ?? ''}
        isDialogOpen={true}
      />
    </Box>
  );
}
