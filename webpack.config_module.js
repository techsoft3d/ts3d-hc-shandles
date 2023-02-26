const path = require('path');

module.exports = {
  entry: './dev/public/js/hcStandardHandle/hcStandardHandle.js',
  mode: "production",
  experiments: {
    outputModule: true
  },
  output: {
    libraryTarget: 'module',
    path: path.resolve(__dirname, 'dist'),
    filename: 'hcStandardHandle.module.min.js',
  },  
};
