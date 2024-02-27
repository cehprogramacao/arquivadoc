const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');

module.exports = {
    webpack: (config) => {
      config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
      config.module.rules.push({
        test: /\.(woff2?|ttf|eot|svg|png|jpe?g|gif|pdf|node)$/,
        use: [
          {
            loader: 'raw-loader',
          },
        ],
      });
  
      return config;
    },
  };
  