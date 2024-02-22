import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function CredentialDetailLine({
  title,
  value,
  showAll,
}: {
  title: string;
  value: string;
  showAll: boolean;
}) {
  const [showValue, setShowValue] = useState<boolean>(false);
  useEffect(() => {
    setShowValue(showAll);
  }, [showAll]);
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
          {showValue ? value : '*****'}
        </Typography>
      </Box>
      <Button
        variant="text"
        color="secondary"
        size="small"
        onClick={() => setShowValue((prev) => !prev)}
      >
        {showValue ? 'Hide' : 'Show'}
      </Button>
    </Box>
  );
}
