import close from '@iconify/icons-fluent/dismiss-48-filled';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';

export default function ConnectionDialog({
  connectionLink,
  isDialogOpen,
}: {
  connectionLink: string;
  isDialogOpen: boolean;
}) {
  const { push } = useRouter();
  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle sx={{ paddingRight: '8px' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: 0.5,
          }}
        >
          <Typography>DATEV eG</Typography>
          <Tooltip arrow title="Close">
            <IconButton size="small">
              <Icon icon={close} />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Would you like to establish a connection?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => push(connectionLink)}
        >
          Connect
        </Button>
        <Button variant="contained" color="inherit">
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
}
