import back from '@iconify/icons-fluent/chevron-left-24-filled';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

export default function BackTitleBar({
  pageTitle,
  onBack,
}: {
  pageTitle: string;
  onBack: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: '8px',
        alignItems: 'center',
        padding: '16px 16px 16px 8px',
      }}
    >
      <Tooltip arrow title="Back">
        <IconButton size="small" onClick={onBack}>
          <Icon icon={back} fontSize={24} />
        </IconButton>
      </Tooltip>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '16px',
        }}
      >
        {pageTitle}
      </Typography>
    </Box>
  );
}
