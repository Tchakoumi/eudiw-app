import { eventBus } from '@datev/event-bus';
import { OID4VCIService } from '@datev/oid4vc';
import back from '@iconify/icons-fluent/arrow-left-48-filled';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScanDetails from '../../components/scan-details/LoadingScanDetails';
import Scanner from '../../components/scanner/Scanner';
import { useTheme } from '../../utils/theme';

export default function Scan() {
  const theme = useTheme();
  const push = useNavigate();
  const [connectionString, setConnectionString] = useState<string>('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] =
    useState<boolean>(false);

  const OIDVCI = new OID4VCIService(eventBus);

  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState>('prompt');

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

  function resolveCredentialOffer(result: string) {
    setIsDetailsDialogOpen(true);
    setConnectionString(result);
    OIDVCI.resolveCredentialOffer({ credentialOffer: result });
  }

  return (
    <>
      <LoadingScanDetails
        isDialogOpen={!!connectionString && isDetailsDialogOpen}
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
        <Scanner handleScanResult={resolveCredentialOffer} />
      </Box>
    </>
  );
}
