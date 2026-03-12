// import tseslint from 'typescript-eslint'

// export default [
//   js.configs.recommended,

//   ...tseslint.configs.recommendedTypeChecked,

//   {
//     languageOptions: {
//       parserOptions: {
//         project: './tsconfig.json',
//         sourceType: 'module',
//       },
//     },

//     rules: {
//       // General
//       'no-console': ['error', {
//         allow: ['warn', 'error']
//       }],

//       // TypeScript rules
//       '@typescript-eslint/no-unused-vars': ['error'],
//       '@typescript-eslint/no-explicit-any': 'error',
//       '@typescript-eslint/explicit-function-return-type': 'off',
//       '@typescript-eslint/no-inferrable-types': 'off',

//       // Allow for domain entities
//       '@typescript-eslint/no-non-null-assertion': 'off',
//     },
//   },
// ]

// import js from '@eslint/js';
// import tseslint from '@typescript-eslint/eslint-plugin';
// // import prettier from 'eslint-plugin-prettier';

// export default [
//   // Ignore folders
//   {
//     ignores: ['node_modules/**', 'dist/**'],
//   },

//   // Base JS rules
//   js.configs.recommended,

//   // TypeScript files
//   {
//     files: ['**/*.ts'],
//     languageOptions: {
//       parser: (await import('@typescript-eslint/parser')).default,
//       ecmaVersion: 'latest',
//       sourceType: 'module',
//     },
//     plugins: {
//       '@typescript-eslint': tseslint,
//       // prettier,
//     },
//     rules: {
//       ...tseslint.configs.recommended.rules,
//       // 'prettier/prettier': 'error',

//       // Optional relaxations
//       '@typescript-eslint/no-unused-vars': ['warn'],
//       '@typescript-eslint/explicit-function-return-type': 'off',
//     },
//   },
// ];


// eslint.config.ts
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'

export default [
  // Ignore generated folders
  {
    ignores: ['node_modules/**', 'dist/**'],
  },

  //Base JavaScript recommended rules
  js.configs.recommended,

  //TypeScript (Node.js backend)
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      ecmaVersion: 'latest',
      sourceType: 'module',

      //Declare Node.js runtime globals
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
    },

    rules: {
      // TypeScript recommended rules
      ...tseslint.configs.recommended.rules,

      // Backend-friendly overrides
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Optional but useful for backend
      'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
      'no-process-env': 'off',
    },
  },
]
