import { usePWA } from '@datev/usePWA';
import { Box } from '@mui/material';
import Footer from '../components/home/Footer';
import Header from '../components/home/Header';
import HomeBody from '../components/home/HomeBody';
import dbService from '../database';
import { WalletDBSchema } from '../database/schema';
import { StoreRecord } from '@datev/storage';
import { useEffect, useState } from 'react';

export default function Home() {
  usePWA();

  const [payload, setPayload] = useState<StoreRecord<WalletDBSchema>>({
    value: {
      age: 21,
      email: 'kuidjamarco@gmail.com',
      name: 'Marco Kuidja',
    },
  });

  console.log('The end of times...', dbService);
  useEffect(() => {
    dbService
      .insert('profile', payload)
      .then((addedKey) => {
        setPayload({
          ...payload,
          value: { ...payload.value, profileId: addedKey as number },
        });
        console.log('Added keys', addedKey);
      })
      .catch((error) => console.log(error));

    // dbService
    //   .findOne('profile', payload.key)
    //   .then((value) =>
    //     console.log(
    //       'findOne assertion: ',
    //       JSON.stringify(payload) === JSON.stringify(value)
    //     )
    //   )
    //   .catch((error) => console.log(error));

    dbService
      .findAll('profile')
      .then((values) =>
        console.log({
          insertValue: values.find((value) => value?.key === payload.key),
          values,
        })
      )
      .catch((error) => console.log(error));

    dbService
      .update('profile', payload.value.profileId as number, {
        age: 18,
      })
      .then(() => console.log('Record updated successfully !'))
      .catch((error) => console.log(error));

    // dbService
    //   .delete('profile', payload.key)
    //   .then(() => console.log('Record deleted successfully !'))
    //   .catch((error) => console.log(error));
  }, [payload]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header />
      <HomeBody />
      <Footer />
    </Box>
  );
}
