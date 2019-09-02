/* eslint-disable */
const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withSass = require('@zeit/next-sass');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const lessToJS = require('less-vars-to-js');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// antd theme
const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './assets/styles/antd.less'), 'utf8'));

// dotenv
let mode = process.env.MODE;
if (!mode) {
  mode = process.env.NODE_ENV;
}
const commonEnv = dotenv.parse(fs.readFileSync(path.resolve(__dirname, `.env`)));
const specificEnv = dotenv.parse(fs.readFileSync(path.resolve(__dirname, `.env.${mode}`)));
const env = {
  ...commonEnv,
  ...specificEnv,
};

module.exports = withPlugins(
  [
    withCSS,

    [
      withLess,
      {
        lessLoaderOptions: {
          javascriptEnabled: true,
          modifyVars: themeVariables, // make your antd custom effective
        },
      },
    ],

    withSass,

    [
      withBundleAnalyzer,
      {
        analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
        analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
        bundleAnalyzerConfig: {
          server: {
            analyzerMode: 'static',
            reportFilename: '../bundles/server.html',
          },
          browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html',
          },
        },
      },
    ],
  ],
  {
    env,

    webpack(config, { isServer }) {
      config.resolve.plugins = config.resolve.plugins || [];

      config.resolve.plugins.push(
        new TsconfigPathsPlugin({
          configFile: path.join(__dirname, './tsconfig.json'),
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        })
      );

      // antd, not really sure why this is needed...
      // see https://github.com/zeit/next.js/blob/canary/examples/with-ant-design-less/README.md
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals),
        ];

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader',
        });
      }

      return config;
    },
  }
);
