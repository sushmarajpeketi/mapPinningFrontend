const path = require('path');

module.exports = {
  mode: 'development', // or 'production' based on your environment
  entry: './src/index.js', // Adjust the entry point based on your project
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: 'source-map', // Ensures source maps are generated
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
