/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PINATA_JWT: process.env.PINATA_JWT,
    NEXT_PUBLIC_GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL
  },
  serverRuntimeConfig: {
    pinataJwt: process.env.PINATA_JWT,
  },
  publicRuntimeConfig: {
    gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL,
  }
};

module.exports = nextConfig;
