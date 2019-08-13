module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser

  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:react/recommended', // uses react-specific linting rules
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'prettier/react', // disables react-specific linting rules that conflict with prettier
    ],
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],

  parserOptions: {
    // ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
    // sourceType: 'module', // Allows for the use of imports
    // ecmaFeatures: {
    //   jsx: true, // Allows for the parsing of JSX
    // },
  },

  plugins: ['react', '@typescript-eslint', 'prettier'],

  rules: {},
};
