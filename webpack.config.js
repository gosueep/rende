const path = require('path');

module.exports = {
  entry : './src/index.tsx',
  output : {
    filename : 'bundle.js',
    path : path.resolve(__dirname, 'public'),
  },
  module : {
    rules : [{
      test : /\.tsx?$/,
      include : [path.resolve(__dirname, 'src')],
      use :
      [
        {
          loader : 'babel-loader',
          options : {
            presets : ['solid'],
          },
        },
        {
          loader : 'ts-loader',
        },
      ]
    }]
  },
  resolve : {
    extensions : ['.tsx', '.ts', '.js'],
  },
  mode : 'production',
  devServer : {
    static : path.resolve(__dirname, 'public'),
    port : 3000,
  },
}