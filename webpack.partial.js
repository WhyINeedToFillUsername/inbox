const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "VERSION": JSON.stringify("4711"),
      "BROWSER": "NONE"
    })
  ],
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      buffer: require.resolve("buffer/"),
    }
  },
}
