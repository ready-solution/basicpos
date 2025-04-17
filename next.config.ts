import type { NextConfig } from "next";
import { Configuration } from "webpack";
import TerserPlugin from "terser-webpack-plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config: Configuration, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...(config.resolve || {}),
        fallback: {
          ...(config.resolve?.fallback || {}),
          crypto: require.resolve("crypto-browserify"),
          stream: false,
          buffer: false,
        },
      };
    }

    config.optimization = {
      ...config.optimization,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
            keep_fnames: true,
            keep_classnames: true,
          },
        }),
      ],
    };

    return config;
  },
};

export default nextConfig;
