const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "production",
  entry: './src/components/PlutonicationQr.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'src/componets/bundle.js',
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // Regla para archivos CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, '/'), 
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.svg$/i,
        type: 'asset/resource', 
        generator: {
          filename: 'assets/svg/[name][ext]', 
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './assets'),
          to: path.resolve(__dirname, 'lib/assets'),
        },
      ],
    }),
  ],

};