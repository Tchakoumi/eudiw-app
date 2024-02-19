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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25"
                  width="25"
                  viewBox="0 -960 960 960"
                >
                  <path
                    fill="currentColor"
                    d="M700-130q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q733-190 756.5-213.265q23.5-23.264 23.5-56.5Q780-303 756.735-326.5q-23.264-23.5-56.5-23.5Q667-350 643.5-326.735q-23.5 23.264-23.5 56.5Q620-237 643.265-213.5q23.264 23.5 56.5 23.5ZM120-240v-60h360v60H120Zm140-310q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q293-610 316.5-633.265q23.5-23.264 23.5-56.5Q340-723 316.735-746.5q-23.264-23.5-56.5-23.5Q227-770 203.5-746.735q-23.5 23.264-23.5 56.5Q180-657 203.265-633.5q23.264 23.5 56.5 23.5ZM480-660v-60h360v60H480Z"
                  ></path>
                </svg>{' '}
                page info icon in your browser's address bar
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
