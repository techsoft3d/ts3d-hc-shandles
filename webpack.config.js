const path = require('path');

module.exports = {
  entry: './dev/public/js/hcSHandles/hcSHandles.js',
  mode: "production",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'hcSHandles.min.js',
    library: 'shandles', //add this line to enable re-use
  },
};
