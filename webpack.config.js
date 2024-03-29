const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  devServer: {
    port: 9000,
    static: {
      serveIndex: true,
      directory: __dirname
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|jp2|webp|mp3|gltf|ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.gltf/,
        type: 'asset/resource',
      },
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  }
}

