// webpack.config.js
const path = import('path');

module.exports = {
  mode: 'production',
  entry: './index.ts', // entry point to library
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cy-generic-objects.js', //  library name
    library: 'CyGenericObjects', // library name
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};