const path = require('path');

module.exports = {
  entry: './dev/public/js/hcSHandles/hcSHandles.js',
  mode: "production",
  experiments: {
    outputModule: true
  },
  output: {
    libraryTarget: 'module',
    path: path.resolve(__dirname, 'dist'),
    filename: 'hcSHandles.module.min.js',
  },  
};
