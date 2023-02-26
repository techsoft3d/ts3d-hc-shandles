const path = require('path');

module.exports = {
  entry: './dev/public/js/hcStandardHandle/hcStandardHandle.js',
  mode: "production",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'hcStandardHandle.min.js',
    library: 'shandle', //add this line to enable re-use
  },
};
