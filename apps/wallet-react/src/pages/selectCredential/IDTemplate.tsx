import { Box, Typography } from '@mui/material';

export default function IDTemplate({
  chosenCredentialType,
  vcItems,
  toggleDisplayDetails,
  showDetails = 3,
}: {
  chosenCredentialType: string;
  vcItems: Record<string, string>;
  toggleDisplayDetails: () => void;
  showDetails: 3 | -1;
}) {
  function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <Box
      onClick={toggleDisplayDetails}
      sx={{
        display: 'grid',
        border: '1px solid grey',
        borderRadius: '8px',
        padding: '4px 8px',
        width: 'fit-content',
        cursor: 'pointer',
        transition: 'background-color 0.5s, box-shadow 0.5s',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0)',
        '&:hover': {
          backgroundColor: '#a1df4663',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: '4px',
          marginBottom: '4px',
        }}
      >
        <Typography>Id type: </Typography>
        <Typography sx={{ fontWeight: 700 }}>{chosenCredentialType}</Typography>
      </Box>
      {Object.keys(vcItems)
        .slice(0, showDetails)
        .map((key) => (
          <Typography variant="body2">
            {`${key
              .split('_')
              .map((jj) => capitalize(jj))
              .join(' ')}: ${vcItems[key]}`}
          </Typography>
        ))}
    </Box>
  );
}
