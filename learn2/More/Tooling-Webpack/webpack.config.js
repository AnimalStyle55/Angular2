module.exports = {
  context: __dirname + "/www",
  entry: "./app/app",
  output: {
    path: __dirname + "/www", filename: "bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loaders: ['ts-loader'], exclude: /node_modules/ },
      { test: /\.html$/, loaders: ['raw-loader'], exclude: /node_modules/ }
    ]
  }
};
