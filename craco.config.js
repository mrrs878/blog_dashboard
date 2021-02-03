/*
 * @Author: your name
 * @Date: 2021-02-03 15:10:56
 * @LastEditTime: 2021-02-03 16:32:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /my-app/craco.config.js
 */
const CracoAntDesignPlugin = require('craco-antd');
const CracoLessPlugin = require('craco-less');

module.exports = {
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
        },
      },
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
        modifyLessRule() {
          return {
            test: /\.module\.less$/,
            exclude: /node_modules/,
            use: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[local]_[hash:base64:6]',
                  },
                },
              },
              { loader: 'less-loader' },
            ],
          };
        },
      },
    },
  ],
};
