import { eventBus } from '@datev/event-bus';
import { OID4VCIServiceEventChannel } from '@datev/oid4vci';
import { Box } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CredentialTypeCard from '../../components/credential-types/CredentialTypeCard';
import CredentialTypeDetails from '../../components/credential-types/CredentialTypeDetails';
import {
  CredentialOfferResponse,
  CredentialOfferResponsePayload,
  ICredentialCard,
  ISupportedCredential,
} from '../../components/credential-types/credentials.types';
import BackTitleBar from '../../components/layout/BackTitleBar';
import Footer from '../../components/layout/Footer';
import { getVCClaims, getVCSDJWTOffers } from './credentialType.util';

export default function CredentialTypes() {
  const push = useNavigate();

  const [resolvedCredentialOffer, setResolvedCredentialOffer] =
    useState<CredentialOfferResponsePayload>();

  useEffect(() => {
    eventBus.once(
      OID4VCIServiceEventChannel.ProcessCredentialOffer,
      (data: CredentialOfferResponse) => {
        setResolvedCredentialOffer(data.payload);
      }
    );
  }, []);

  const [selectedCredentialType, setSelectedCredentialType] =
    useState<ICredentialCard>();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
      }}
    >
      {resolvedCredentialOffer && (
        <CredentialTypeDetails
          closeDialog={() => setSelectedCredentialType(undefined)}
          isDialogOpen={!!selectedCredentialType}
          selectedCredentialType={selectedCredentialType}
          credntialTypeClaims={getVCClaims(
            selectedCredentialType?.type as ISupportedCredential,
            resolvedCredentialOffer.discoveryMetadata.credentialIssuerMetadata,
            'en'
          )}
          resolvedCredentialOfferPayload={resolvedCredentialOffer}
        />
      )}
      <BackTitleBar pageTitle="Credential Types" onBack={() => push('/scan')} />
      <Box
        sx={{
          backgroundColor: '#F6F7F9',
          height: '100%',
        }}
      >
        <Scrollbars universal autoHide>
          <Box
            sx={{
              display: 'grid',
              gridTemplateRows: 'auto auto 1fr',
              rowGap: 1,
              padding: '12px',
            }}
          >
            {resolvedCredentialOffer &&
              getVCSDJWTOffers(
                resolvedCredentialOffer.discoveryMetadata
                  .credentialIssuerMetadata
              ).map((card, index) => {
                const {
                  type,
                  issuer,
                  data: { display },
                } = card;
                return (
                  <CredentialTypeCard
                    key={index}
                    displayName={display ? display[0].name : ''}
                    issuer={issuer}
                    type={type}
                    selectCredentialType={() =>
                      setSelectedCredentialType((prevCard) =>
                        prevCard && prevCard.type === card.type
                          ? undefined
                          : card
                      )
                    }
                  />
                );
              })}
          </Box>
        </Scrollbars>
      </Box>
      <Footer showArrow={false} />
    </Box>
  );
}
