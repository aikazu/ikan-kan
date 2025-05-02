module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'eslint:recommended', // Uses the recommended rules from ESLint
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:react/recommended', // Uses the recommended rules from eslint-plugin-react
    'plugin:react-hooks/recommended', // Uses the recommended rules from eslint-plugin-react-hooks
    'plugin:import/recommended', // Uses the recommended rules from eslint-plugin-import
    'plugin:import/typescript', // Integration for import plugin with TypeScript
    // 'prettier', // Uncomment this line if you use Prettier for code formatting
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    project: './tsconfig.json', // Add this to point to your TypeScript config
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // Always try to resolve types
        project: './tsconfig.json',
      },
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  env: {
    browser: true, // Enable browser global variables
    node: true, // Enable Node.js global variables and Node.js scoping
    es2021: true, // Add globals for ES2021
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'import',
  ],
  rules: {
    // === Your Custom Rules ===
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }], // Warn if function exceeds 50 lines
    'max-depth': ['warn', 3], // Warn if nesting exceeds 3 levels

    // === Import Order Rules ===
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'error', // Ensure imports can be resolved

    // === Potential Overrides & Adjustments ===
    // You might want to disable prop-types if using TypeScript
    'react/prop-types': 'off',
    // Allow JSX in .tsx files
    'react/jsx-filename-extension': [1, { 'extensions': ['.tsx'] }],
    // You might adjust or add other rules based on your preferences
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn about unused vars, allow starting with _
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable forcing explicit return types for all functions (can be noisy)
    '@typescript-eslint/no-inferrable-types': 'error', // Flag unnecessary type annotations
    'no-console': 'warn', // Warn about console.log statements
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'], // Apply specific rules or disable TypeScript rules for JS files if needed
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      }
    }
  ]
}; 