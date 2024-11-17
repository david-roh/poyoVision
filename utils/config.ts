import { PinataSDK } from "pinata";

const PINATA_JWT = process.env.PINATA_JWT || process.env.NEXT_PUBLIC_PINATA_JWT;

if (typeof window !== 'undefined' && !PINATA_JWT) {
  console.error('Warning: PINATA_JWT environment variable is not set');
}

export const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT || '',
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
});

// Only run authentication test on server side
if (typeof window === 'undefined') {
  pinata.testAuthentication()
    .then(() => console.log('Pinata authentication successful'))
    .catch(err => {
      console.error('Pinata authentication failed:', err);
    });
}
