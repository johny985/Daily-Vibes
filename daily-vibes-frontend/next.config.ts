import { NextConfig } from "next";

interface NextConfigWithLogging extends NextConfig {
  logging?: {
    fetches?: {
      fullUrl?: boolean;
      hmrRefreshes?: boolean;
    };
  };
}

const nextConfig: NextConfigWithLogging = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  async redirects() {
    return [
      {
        source: "/signUp",
        destination: "/sign-up",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/sign-up",
        permanent: true,
      },
      {
        source: "/SignUp",
        destination: "/sign-up",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
