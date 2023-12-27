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
      // Regla para archivos TypeScript y TypeScript React
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
      // Regla para archivos JavaScript y JavaScript React
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
        // use: [MiniCssExtractPlugin.loader, 'css-loader'],
        use: ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, '/'), 
      },
      // Regla para archivos de imágenes
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      // Regla para archivos SVG
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
          // Puedes añadir más opciones aquí si es necesario
        },
      ],
    }),
  ],

};