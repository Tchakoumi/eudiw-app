import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../../components/home/Footer';
import Header from '../../components/home/Header';

type ICredentialType = string[];

export default function SelectCredential() {
  const [credentialTypes, setCredentialTypes] = useState<ICredentialType>([]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
      }}
    >
      <Header />
      <Box
        sx={{
          backgroundColor: '#F6F7F9',
          padding: '12px',
          display: 'grid',
          rowGap: 2,
          alignContent: 'start',
        }}
      >
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          Select the desired credential types
        </Typography>
        <Box>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>{' '}
          <Box
            style={{
              padding: '4px 2px',
              backgroundColor: 'green',
              color: 'black',
              borderRadius: '2px',
              border: '1px solid grey',
            }}
          >
            This is the first credential
          </Box>
          <Box
            style={{
              padding: '4px 2px',
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '2px',
              border: '1px solid grey',
            }}
          >
            This is the second credential
          </Box>
        </Box>
      </Box>
      <Footer showArrow={false} />
    </Box>
  );
}
