import { Box, Skeleton, Typography } from '@mui/material';

export default function CredentialCardSkeleton() {
  return (
    <Box
      sx={{
        background: '#FFFFFF',
        padding: '24px',
        borderRadius: '8px',
        display: 'grid',
        rowGap: '13px',
        boxShadow: '0px 1px 24px 0px #2C333517',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid #D1D5DB',
      }}
    >
      <Skeleton variant="circular" height={35} width={35} animation="wave" />
      <Box sx={{ display: 'grid', rowGap: '3px' }}>
        <Typography>
          <Skeleton animation="wave" width="40%" />
        </Typography>
        <Typography>
          <Skeleton animation="wave" width="15%" />
        </Typography>
      </Box>
    </Box>
  );
}
