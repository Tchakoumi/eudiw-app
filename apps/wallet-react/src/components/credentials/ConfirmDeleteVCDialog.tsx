import caret from '@iconify/icons-fluent/chevron-down-24-filled';
import dot from '@iconify/icons-fluent/circle-24-filled';
import { Icon } from '@iconify/react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import BackTitleBar from '../layout/BackTitleBar';
import DialogTransition from '../layout/DialogTransition';

export default function ConfirmDeleteVCDialog({
  isDialogOpen,
  closeDialog,
  confirmDelete,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirmDelete: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  //TODO: CALL API HERE TO DELETE VC
  function deleteVC() {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      confirmDelete();
    }, 3000);
  }

  return (
    <Dialog
      fullScreen
      open={isDialogOpen}
      onClose={closeDialog}
      TransitionComponent={DialogTransition}
    >
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        <BackTitleBar
          pageTitle="Remove Credential"
          onBack={() => (isDeleting ? null : closeDialog())}
        />
        <Box
          sx={{
            backgroundColor: '#F6F7F9',
            padding: '16px',
            display: 'grid',
            gridTemplateRows: 'auto auto auto auto 1fr',
            alignItems: 'end',
            rowGap: 1.5,
          }}
        >
          <Typography fontWeight={700}>
            Remove credentials from your wallet
          </Typography>
          <Typography>
            You will lose your ability to prove the information on this
            credential with this Wallet.
          </Typography>
          <Accordion>
            <AccordionSummary
              sx={{ backgroundColor: '#E8ECEF' }}
              expandIcon={<Icon icon={caret} fontSize={24} />}
            >
              <Typography fontWeight={700}>You will not lose</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', rowGap: 1 }}>
                {[
                  'Your credential within the system that issued you your credential.',
                  'The issuing organization as a Contact.',
                ].map((line) => (
                  <Box
                    sx={{
                      display: 'grid',
                      alignItems: 'center',
                      gridTemplateColumns: 'auto 1fr',
                      columnGap: 1,
                    }}
                  >
                    <Icon icon={dot} fontSize={12} />
                    <Typography>{line}</Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              sx={{ backgroundColor: '#E8ECEF' }}
              expandIcon={<Icon icon={caret} fontSize={24} />}
            >
              <Typography fontWeight={700}>
                How to get this credential back
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', rowGap: 1 }}>
                {[
                  'You will have to go to the organization that issued you this credential and request it again.',
                ].map((line) => (
                  <Box
                    sx={{
                      display: 'grid',
                      alignItems: 'center',
                      gridTemplateColumns: 'auto 1fr',
                      columnGap: 1,
                    }}
                  >
                    <Icon icon={dot} fontSize={12} />
                    <Typography>{line}</Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Button
            color="error"
            variant="contained"
            onClick={deleteVC}
            endIcon={
              isDeleting && (
                <CircularProgress thickness={5} color="error" size={24} />
              )
            }
            disabled={isDeleting}
          >
            Remove from wallet
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
