import { Box, Button, Typography } from '@mui/material';

export default function CredentialDetailLine({
  title,
  value,
  handleShowValue,
  showClaimValue,
}: {
  title: string;
  value: string;
  handleShowValue: () => void;
  showClaimValue: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: 1,
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography sx={{ fontSize: '14px' }}>{title}</Typography>
        <Typography sx={{ fontSize: '14px' }}>
          {showClaimValue ? value : '*****'}
        </Typography>
      </Box>
      <Button
        variant="text"
        color="secondary"
        size="small"
        onClick={handleShowValue}
      >
        {showClaimValue ? 'Hide' : 'Show'}
      </Button>
    </Box>
  );
}
