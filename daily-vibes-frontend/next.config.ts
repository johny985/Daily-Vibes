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
};

export default nextConfig;
