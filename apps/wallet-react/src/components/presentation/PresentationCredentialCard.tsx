import { Box, Typography } from '@mui/material';
import AuthleteLogo from '../../assets/authlete-logo.png';
import { IVerifiableCredential } from '../../types/credentials.types';
import { capitalizeEveryWord, domainToClearString } from '../../utils/common';

export default function PresentationCredentialCard({
  credential: { issuer, logo, title },
  openDetails,
}: {
  credential: IVerifiableCredential;
  openDetails?: () => void;
}) {
  return (
    <Box
      onClick={() => (openDetails ? openDetails() : null)}
      sx={{
        background: '#FFFFFF',
        padding: '12px',
        display: 'grid',
        rowGap: '13px',
        transition: 'all 0.3s ease-in-out',
        borderBottom: '1px solid #D1D5DB',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.003)',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          columnGap: 2,
          alignItems: 'center',
          justifyItems: 'start',
        }}
      >
        <img src={logo ?? AuthleteLogo} height={35} alt="authlete logo" />
        <Box>
          <Typography
            sx={{
              fontWeight: '600',
              fontSize: '16px',
              lineHeight: '24px',
            }}
          >
            {title ?? 'N/A'}
          </Typography>
          <Typography sx={{ fontSize: '14px', lineHeight: '21px' }}>
            {issuer ? capitalizeEveryWord(domainToClearString(issuer)) : 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
