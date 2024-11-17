import { PinataSDK } from "pinata";

// Add error handling for SDK initialization
if (!process.env.PINATA_JWT) {
  throw new Error('PINATA_JWT environment variable is not set');
}

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT
});

// Test the connection
pinata.testAuthentication().catch(err => {
  console.error('Pinata authentication failed:', err);
});

