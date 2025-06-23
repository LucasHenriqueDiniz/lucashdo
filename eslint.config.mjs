/**
 * ESLint configuration for Next.js project
 * Using ESLint Flat Config format for ESLint 9
 * https://eslint.org/docs/latest/use/configure/
 */

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { dirname } from 'path';
import * as tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

// Setup proper paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup compatibility layer for traditional configs
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // JavaScript recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Next.js core web vitals
  ...compat.extends('next/core-web-vitals'),

  // Prettier (always last to override other formatting rules)
  prettierConfig,

  // Custom project configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/dist/**',
      '**/coverage/**',
      '**/build/**',
      '.eslint.config',
    ],

    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    // Register plugins in the new flat config format
    plugins: {
      prettier: prettierPlugin,
    },

    // Custom rules for the project
    rules: {
      // React rules
      'react/jsx-props-no-spreading': 'warn',
      'react/destructuring-assignment': ['warn', 'always'],
      'react/prop-types': 'off', // TypeScript handles prop types
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
      'react/jsx-no-duplicate-props': 'warn',

      // Accessibility rules
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/alt-text': 'error',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript rules
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Import rules
      'import/no-default-export': 'off',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
        },
      ],

      // Prettier rules
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto', // Automatically detect and preserve line endings (CRLF or LF)
        },
      ],
    },

    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@', './src'],
            ['@components', './src/components'],
            ['@app', './src/app'],
            ['@constants', './src/constants'],
            ['@lib', './src/lib'],
            ['@messages', './src/messages'],
            ['@scripts', './src/scripts'],
            ['@services', './src/services'],
            ['@types', './src/types'],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      },
    },
  },
];

export default eslintConfig;
