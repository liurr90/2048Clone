const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './web/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@react-native/babel-preset'],
            plugins: [
              '@babel/plugin-transform-numeric-separator',
              '@babel/plugin-transform-nullish-coalescing-operator',
              ['@babel/plugin-transform-class-properties', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              ['@babel/plugin-transform-private-property-in-object', { loose: true }],
              '@babel/plugin-transform-async-generator-functions',
              '@babel/plugin-transform-object-rest-spread',
              '@babel/plugin-transform-optional-chaining',
              '@babel/plugin-transform-optional-catch-binding',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.web.js', '.js', '.tsx', '.ts'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './web/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    hot: true,
  },
}; 