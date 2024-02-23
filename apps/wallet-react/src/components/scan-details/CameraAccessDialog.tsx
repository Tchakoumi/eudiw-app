import close from '@iconify/icons-fluent/dismiss-24-regular';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import unblockCameraDirection from '../../assets/camera_access_denied.png';
import DialogTransition from '../layout/DialogTransition';
import siteInformation from './SiteInformation.svg';

export default function CameraAccessDialog({
  isDialogOpen,
  requestPermission,
  usage = 'prompt',
}: {
  isDialogOpen: boolean;
  requestPermission: () => void;
  usage?: Omit<PermissionState, 'granted'>;
}) {
  const push = useNavigate();
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => null}
      TransitionComponent={DialogTransition}
    >
      <Box
        sx={{
          display: 'grid',
          alignContent: 'center',
          rowGap: '24px',
          height: '100%',
          padding: '16px',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: '8px',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">
            {usage === 'denied'
              ? 'Datev-Wallet has been blocked from Camera'
              : 'Allow Camera Use'}
          </Typography>
          <Tooltip arrow title="Close">
            <IconButton size="small">
              <Icon icon={close} fontSize={24} />
            </IconButton>
          </Tooltip>
        </Box>
        {usage === 'denied' && (
          <img
            src={unblockCameraDirection}
            alt="loading wallet"
            style={{ justifySelf: 'center', width: '200px' }}
          />
        )}
        <Box sx={{ display: 'grid', rowGap: '16px' }}>
          {usage === 'prompt' ? (
            <Typography>
              To continue using DATEV-Wallet scan feature, please allow camera
              The Camera is used to scan QR codes that initiate a credential
              offer or credential request. No information about the images is
              stored, used for analytics, or shared.
            </Typography>
          ) : (
            <Box>
              <Typography>
                1. Click the{' '}
                <img src={siteInformation} alt="url bar site url icon" /> page
                info icon in your browser's address bar
              </Typography>
              <Typography>2. Turn on the Camera</Typography>
            </Box>
          )}
          <Typography>
            To continue using DATEV-Wallet scan feature, please allow camera
            permissions.
          </Typography>
        </Box>
        {usage === 'prompt' && (
          <Box sx={{ display: 'grid', rowGap: '16px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={requestPermission}
            >
              Allow
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => push('/credentials')}
            >
              Not now
            </Button>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
