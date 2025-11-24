module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
  ],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'react/jsx-filename-extension': 'off',
      },
    },
  ],
};
