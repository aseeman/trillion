module.exports = {
  'entry': ['./src/trillion-react'],
  'output': {
    'library': 'TrillionReact',
    'libraryTarget': 'umd',
    'filename': './dist/trillion-react.js'
  },
  'module': {
    'loaders': [
      {
        'test': /\.js|\.jsx$/,
        'loader': 'babel-loader'
      }
    ]
  },
  'externals': {
    'react': {
      'root': 'React',
      'amd': 'react',
      'commonjs': 'react',
      'commonjs2': 'react'
    }
  }
};