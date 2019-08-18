/* eslint-disable */

const purgecss = require('@fullhuman/postcss-purgecss')({
  // Specify the paths to all of the template files in your project
  content: [
    `./@(pages|layouts|components)/**/*.@(js|ts|jsx
    |tsx|html)`,
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],

  whitelist: ['html', 'body'],
  whitelistPatterns: [/^ant-/],
});

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};

module.exports = {
  plugins: [
    require('postcss-easy-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
