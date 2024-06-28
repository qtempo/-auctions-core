import stylistic from '@stylistic/eslint-plugin'
import parserTs from '@typescript-eslint/parser'

export default [
  {
    files: ['src/**/*.{js,ts,tsx}'],
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      parser: parserTs,
    },
    rules: {
      'max-len': ['error', { code: 120, tabWidth: 2 }],
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ["error", 'as-needed'],
      'no-trailing-spaces': ['error'],
      'nonblock-statement-body-position': ['error', 'below'],
    }
  }
]