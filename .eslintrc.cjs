/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],

      parserOptions: {
        project: './tsconfig.json', 
      },
    },
  ],
  root: true,
  parserOptions: {
    ecmaVersion: 12,
  },
  env: {
    node: true,
    es6: true,
    browser: true
  },
  rules: {
    // TypeScript Rules
    '@typescript-eslint/explicit-function-return-type': 'error',
    "@typescript-eslint/no-floating-promises": "error",
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    "@typescript-eslint/strict-boolean-expressions": "warn",
    
    // General JavaScript/ESLint Rules
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'no-undef': 'error',
    'no-undef-init': 'error',

    // Code Style and Formatting Rules
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/quotes': ['error', 'double'],
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    "max-len": [
      "warn",
      {
        "code": 80,
        "tabWidth": 2,
        "comments": 80,
        "ignoreComments": false,
        "ignoreTrailingComments": true,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true
      }
    ]
  },
};