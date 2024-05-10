module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@next/next/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@next/next'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'warn',
    '@next/next/no-img-element': 'off',
    'jsx-a11y/anchor-is-valid': ['warn', {
      'components': ['Link'],
      'specialLink': ['hrefLeft', 'hrefRight'],
      'aspects': ['invalidHref', 'preferButton']
    }],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "react-hooks/exhaustive-deps": "off",
    "import/no-anonymous-default-export": "off",
    "react/display-name": "off",
    'react/jsx-no-target-blank': 'off',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended'
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      }
    }
  ]
};
