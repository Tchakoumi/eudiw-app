import { eventBus } from '@datev/event-bus';
import { OID4VCIService } from '@datev/oid4vc';
import back from '@iconify/icons-fluent/arrow-left-48-filled';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScanDetails from '../../components/scan-details/LoadingScanDetails';
import Scanner from '../../components/scanner/Scanner';
import { useTheme } from '../../utils/theme';

export default function IssuanceScan() {
  const theme = useTheme();
  const push = useNavigate();
  const [scanResult, setScanResult] = useState<string>('');
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] =
    useState<boolean>(false);

  const OIDVCI = new OID4VCIService(eventBus);

  function resolveCredentialOffer(result: string) {
    setIsLoadingDialogOpen(true);
    setScanResult(result);
    OIDVCI.resolveCredentialOffer({ credentialOffer: result });
  }

  return (
    <>
      <LoadingScanDetails isDialogOpen={!!scanResult && isLoadingDialogOpen} />

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
