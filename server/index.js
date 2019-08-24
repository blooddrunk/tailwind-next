/* eslint-disable no-console,@typescript-eslint/no-var-requires */
const express = require('express');
const next = require('next');
const consola = require('consola');

const devProxy = [
  [
    '/hn/**',
    {
      target: 'http://hn.algolia.com/api/v1',
      pathRewrite: {
        '^/hn': '',
      },
      changeOrigin: true,
      logLevel: 'debug',
    },
  ],

  [
    (pathname, req) => pathname.match('^/js/') && req.method === 'GET',
    {
      target: 'https://my-json-server.typicode.com/blooddrunk/my-json-server',
      pathRewrite: {
        '^/js': '',
      },
      changeOrigin: true,
      logLevel: 'debug',
    },
  ],
];

const port = parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || 'localhost';
const env = process.env.NODE_ENV;
const dev = env !== 'production';
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev,
});

const handle = app.getRequestHandler();

let server;
app
  .prepare()
  .then(() => {
    server = express();

    // Set up the proxy.
    if (dev && devProxy) {
      const proxyMiddleware = require('http-proxy-middleware');
      devProxy.forEach(context => {
        server.use(proxyMiddleware(context[0], context[1]));
      });
    }

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => handle(req, res));

    server.listen(port, host, err => {
      if (err) {
        throw err;
      }
      consola.success(`Ready on port ${port} [${env}]`);
    });
  })
  .catch(err => {
    consola.error('An error occurred, unable to start the server');
    consola.error(err);
  });
