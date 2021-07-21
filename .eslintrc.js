/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-23 11:22:06
 * @LastEditTime: 2021-07-21 15:41:13
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\.eslintrc.js
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
    '@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'react/destructuring-assignment': [0],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'property',
        format: ['strictCamelCase'],
        filter: {
          regex: '^(icon_name|return_code|return_message|return_code|create_time|author_id|_id|sub_menu)$',
          match: false,
        },
      },
    ],
    '@typescript-eslint/space-infix-ops': 0,
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
    },
  ],
};
