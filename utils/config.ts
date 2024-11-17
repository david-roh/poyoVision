import { PinataSDK } from "pinata";

if (!process.env.PINATA_JWT) {
  throw new Error('PINATA_JWT environment variable is not set');
}

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
});

// Test the connection on initialization
pinata.testAuthentication()
  .then(() => console.log('Pinata authentication successful'))
  .catch(err => {
    console.error('Pinata authentication failed:', err);
    throw new Error('Failed to authenticate with Pinata');
  });
