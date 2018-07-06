const path = require('path')

module.exports = {
  webpack: (config, options, webpack) => ({
    ...config,
    entry: {
      index: './src/index.js'
    }
  })
}