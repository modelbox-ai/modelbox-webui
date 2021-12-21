const webpack = require('webpack');
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg/,
        loader: 'file-loader',
        options: {
          esModule: false,
        },
      }
    ],
  },
};
