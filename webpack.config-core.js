module.exports = {
  'entry': ['./src/trillion'],
  'output': {
    'library': 'Trillion',
    'libraryTarget': 'umd',
    'filename': './dist/trillion.js'
  },
  'module': {
    'loaders': [
      {
        'test': /\.js$/,
        'loader': 'babel-loader'
      }
    ]
  }
};