/* eslint-disable import/no-extraneous-dependencies */
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.prod');

const compiler = Webpack(webpackConfig);
// const devServerOptions = { ...webpackConfig.devServer, open: true };
const devServerOptions = {
  compress: true,
  port: 8888,
  open: false,
};
const server = new WebpackDevServer(devServerOptions, compiler);

// const runServer = async () => {
//   console.log('Starting server...');
//   await server.start();
// };

// runServer();

export default server;
