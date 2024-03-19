import { eventBus } from '@datev/event-bus';
import {
  CredentialIssuerMetadata,
  CredentialSupportedSdJwtVc,
  OID4VCIServiceEventChannel,
  ResolvedCredentialOffer,
  ServiceResponse,
  ServiceResponseStatus,
} from '@datev/oid4vc';
import { Box, Button, Typography } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CredentialTypeCard from '../../components/credential-types/CredentialTypeCard';
import CredentialTypeDetails from '../../components/credential-types/CredentialTypeDetails';
import BackTitleBar from '../../components/layout/BackTitleBar';
import Footer from '../../components/layout/Footer';
import {
  ICredentialCard,
  ISupportedCredential,
} from '../../types/credentials.types';
import { getVCClaims, getVCSDJWTOffers } from '../../utils/credentialType.util';

export default function CredentialTypes() {
  const push = useNavigate();

  const [resolvedCredentialOffer, setResolvedCredentialOffer] =
    useState<ResolvedCredentialOffer>();

  useEffect(() => {
    eventBus.once(
      OID4VCIServiceEventChannel.ProcessCredentialOffer,
      (data: ServiceResponse) => {
        if (data.status === ServiceResponseStatus.Success) {
          setResolvedCredentialOffer(data.payload as ResolvedCredentialOffer);
        } else {
          //TODO: REPLACE WITH PROPER ERROR NOTIFICATION METHOD
          alert(data.payload);
        }
      }
    );
  }, []);

  const [selectedCredentialType, setSelectedCredentialType] =
    useState<ICredentialCard>();

  const [vcSdJwtOffers, setVcSdJwtOffers] = useState<ICredentialCard[]>([]);

  useEffect(() => {
    if (
      resolvedCredentialOffer &&
      resolvedCredentialOffer.discoveryMetadata &&
      resolvedCredentialOffer.discoveryMetadata.credentialIssuerMetadata
    )
      setVcSdJwtOffers(
        getVCSDJWTOffers(
          resolvedCredentialOffer.discoveryMetadata
            .credentialIssuerMetadata as CredentialIssuerMetadata<CredentialSupportedSdJwtVc>
        )
      );
  }, [resolvedCredentialOffer]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
      }}
    >
      {resolvedCredentialOffer &&
        resolvedCredentialOffer.discoveryMetadata &&
        resolvedCredentialOffer.discoveryMetadata.credentialIssuerMetadata && (
          <CredentialTypeDetails
            closeDialog={() => setSelectedCredentialType(undefined)}
            isDialogOpen={!!selectedCredentialType}
            selectedCredentialType={selectedCredentialType}
            credntialTypeClaims={getVCClaims(
              selectedCredentialType?.type as ISupportedCredential,
              resolvedCredentialOffer.discoveryMetadata
                .credentialIssuerMetadata as CredentialIssuerMetadata<CredentialSupportedSdJwtVc>,
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
        {vcSdJwtOffers.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'grid',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'grid', justifyItems: 'center', rowGap: 2 }}>
              <Typography>
                No supported offers found, please scan again!!!
              </Typography>
              <Button
                onClick={() => push('/scan')}
                variant="contained"
                color="primary"
              >
                Scan again
              </Button>
            </Box>
          </Box>
        ) : (
          <Scrollbars universal autoHide>
            <Box
              sx={{
                display: 'grid',
                gridTemplateRows: 'auto auto 1fr',
                rowGap: 1,
                padding: '12px',
              }}
            >
              {vcSdJwtOffers.map((card, index) => {
                const {
                  type,
                  issuer,
                  data: { display },
                } = card;
                return (
                  <CredentialTypeCard
                    key={index}
                    displayName={display ? display[0].name ?? '' : ''}
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
        )}
      </Box>
      <Footer showArrow={false} />
    </Box>
  );
}
