/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-23 11:22:06
 * @LastEditTime: 2021-03-25 09:52:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/.eslintrc.js
 */
module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
  ],
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  rules: {
    'linebreak-style': ['off', 'window'],
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'react-hooks/exhaustive-deps': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'react/destructuring-assignment': [0],
    '@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allow',
      },
      {
        selector: ['variable', 'property'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'snake_case'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      {
        selector: 'enum',
        format: ['PascalCase', 'UPPER_CASE'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
    },
  ],
};
