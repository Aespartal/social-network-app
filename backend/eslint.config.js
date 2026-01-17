import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.d.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript básico
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_', 
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-unused-vars': 'off', // Desactivado en favor de la versión de TS
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-redeclare': 'off', // Permitir interfaces y namespaces con el mismo nombre en TS
      
      // General
      'no-console': 'off', // Permitir console.log en backend
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      
      // Import/Export
      'no-duplicate-imports': 'error',
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      '*.js',
      'prisma/migrations/',
      'src/generated/',
      'src/types/**/*.d.ts',
    ],
  },
  prettier,
]
