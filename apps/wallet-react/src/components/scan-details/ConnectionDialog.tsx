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
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../utils/theme';

interface IConnectionDialog {
  connectionLink: string;
  isDialogOpen: boolean;
  closeDialog: () => void;
}

export default function ConnectionDialog({
  connectionLink,
  isDialogOpen,
  closeDialog,
}: IConnectionDialog) {
  const push = useNavigate();
  const theme = useTheme();
  return (
    <Dialog open={isDialogOpen} onClose={closeDialog}>
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
            <IconButton size="small" onClick={closeDialog}>
              <Icon icon={close} />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Would you like to establish a connection?
          <Typography
            component="span"
            sx={{ color: theme.palette.primary.dark }}
          >{`Connection string: ${connectionLink}`}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => push('/credential-type')}
        >
          Connect
        </Button>
        <Button variant="contained" color="inherit" onClick={closeDialog}>
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
}
