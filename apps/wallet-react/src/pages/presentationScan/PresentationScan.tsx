import back from '@iconify/icons-fluent/arrow-left-48-filled';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScanDetails from '../../components/scan-details/LoadingScanDetails';
import Scanner from '../../components/scanner/Scanner';
import { useTheme } from '../../utils/theme';

export default function PresentationScan() {
  const theme = useTheme();
  const push = useNavigate();
  const [scanResult, setScanResult] = useState<string>('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] =
    useState<boolean>(false);
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] =
    useState<boolean>(false);

  function resolvePresentationRequest(result: string) {
    setIsLoadingDialogOpen(true);
    setScanResult(result);
    //TODO: integrate presentation request resolution service here
  }

  function presentationDetailsListener() {
    //TODO: integrate listening of event that holds presentation details here
    setTimeout(() => {
      setIsLoadingDialogOpen(false);
      setIsDetailsDialogOpen(true);
    }, 3000);
  }

  return (
    <>
      <LoadingScanDetails
        isDialogOpen={!!scanResult && isLoadingDialogOpen}
        resultListener={presentationDetailsListener}
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
        <Scanner handleScanResult={resolvePresentationRequest} />
      </Box>
    </>
  );
}
