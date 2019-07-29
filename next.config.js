const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withPurgeCss = require('next-purgecss');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

module.exports = withPlugins([
  withCSS,
  [
    withPurgeCss,
    {
      purgeCssEnabled: ({ dev, isServer }) => !dev && !isServer, // Only enable PurgeCSS for client-side production builds
    },
  ],
  {
    webpack(config, options) {
      config.resolve.plugins = [
        new TsconfigPathsPlugin({
          configFile: path.join(__dirname, './tsconfig.json'),
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        }),
      ];

      return config;
    },
  },
]);
