import { QrScanner } from '@datev/qr-scanner';
import swapCamera from '@iconify/icons-fluent/arrow-sync-24-regular';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import CameraAccessDialog from '../scan-details/CameraAccessDialog';

interface ScanProps {
  handleScanResult: (scanResult: string) => void;
}
export default function Scanner({ handleScanResult }: ScanProps) {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment'
  );

  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState>('prompt');
  const [isRequestCameraDialogOpen, setIsRequestCameraDialogOpen] =
    useState<boolean>(true);

  const checkCameraPermission = async () => {
    try {
      const cameraPermission = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });
      setPermissionStatus(cameraPermission.state);
      return cameraPermission.state;
    } catch (error) {
      console.error('Error checking camera permission:', error);
    }
  };

  useEffect(() => {
    checkCameraPermission();
  }, [permissionStatus]);

  const requestCameraPermission = () => {
    setIsRequestCameraDialogOpen(false);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setPermissionStatus('granted');
      })
      .catch((error) => {
        setPermissionStatus('denied');
      });
  };

  return (
    <>
      <CameraAccessDialog
        isDialogOpen={
          isRequestCameraDialogOpen &&
          (permissionStatus === 'prompt' || permissionStatus === 'denied')
        }
        usage={permissionStatus as Omit<PermissionState, 'granted'>}
        requestPermission={requestCameraPermission}
      />

      <Box
        sx={{
          display: 'grid',
          height: '100%',
          position: 'relative',
        }}
      >
        <QrScanner
          onResult={handleScanResult}
          validate={(result) => {
            return String(result);
          }}
          onError={(error) => console.log(error.message)}
          facingMode={facingMode}
        />
        <Tooltip arrow title={'Swap Camera'}>
          <IconButton
            color="secondary"
            sx={{
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
            onClick={() =>
              setFacingMode((prev) =>
                prev === 'environment' ? 'user' : 'environment'
              )
            }
          >
            <Icon icon={swapCamera} style={{ color: 'black' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
}
