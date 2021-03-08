/*
 * @Author: your name
 * @Date: 2021-02-23 14:42:04
 * @LastEditTime: 2021-02-25 11:19:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/craco.config.js
 */
const CracoLessPlugin = require('craco-less');
const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
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
