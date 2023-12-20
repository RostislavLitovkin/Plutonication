const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "production",
  entry: "/src/components/PlutonicationQrPopUp/index.js",
  output: {
    // path: path.resolve(__dirname, "dist"),
    // filename: "bundle.js",
    // publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: "@plutonication/plutonication",
    libraryTarget: "umd", // or another format suitable for libraries
    globalObject: "this"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      // Regla para archivos TypeScript y TypeScript React
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
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
            presets: ['@babel/preset-env', '@babel/preset-react'],
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
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    // new MiniCssExtractPlugin({
    //   filename: 'styles/[name].css', // This will output your CSS files in 'dist/styles' folder
    // }),
    new CopyPlugin({
      patterns: [
        { from: 'styles/welcome.css', to: 'styles/welcome.css' },
        { from: 'globalStyles.css', to: 'globalStyles.css' }
      ],
    }),
  ],
};