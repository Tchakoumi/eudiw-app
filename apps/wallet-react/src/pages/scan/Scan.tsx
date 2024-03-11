import { eventBus } from '@datev/event-bus';
import { OID4VCIServiceImpl } from '@datev/oid4vci';
import { QrScanner } from '@datev/qr-scanner';
import back from '@iconify/icons-fluent/arrow-left-48-filled';
import swapCamera from '@iconify/icons-fluent/arrow-sync-24-regular';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraAccessDialog from '../../components/scan-details/CameraAccessDialog';
import LoadingScanDetails from '../../components/scan-details/LoadingScanDetails';
import { useTheme } from '../../utils/theme';

export default function Scan() {
  const theme = useTheme();
  const push = useNavigate();
  const [connectionString, setConnectionString] = useState<string>('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] =
    useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment'
  );

  const OIDVCI = new OID4VCIServiceImpl(eventBus);

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

  function resolveCredentialOffer(result: string) {
    setIsDetailsDialogOpen(true);
    setConnectionString(result);
    // TODO: Resolve the credentialOffer name to credentialURI
    OIDVCI.resolveCredentialOffer({ credentialOffer: result });
  }

  return (
    <>
      <LoadingScanDetails
        isDialogOpen={!!connectionString && isDetailsDialogOpen}
      />

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
          rowGap: 1,
          gridTemplateRows: 'auto 1fr',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            alignContent: 'center',
            justifyContent: 'start',
            padding: '8px',
            backgroundColor: theme.palette.secondary.light,
          }}
        >
          <Tooltip arrow title="Back">
            <IconButton size="small" onClick={() => push('/')}>
              <Icon icon={back} color="black" />
            </IconButton>
          </Tooltip>
        </Box>
        <QrScanner
          onResult={resolveCredentialOffer}
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
