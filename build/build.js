'use strict'
require('./check-versions')()
process.env.NODE_ENV = 'production'
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
// const server = require('pushstate-server')
// ----------
const spinner = ora('building for production...')
// const spinner = ora('building for ' + process.env.NODE_ENV + ' environment...')
// ----------
spinner.start()
// const open = url => {
//   require('child_process').exec('start ' + url)
// }

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
    // ---------------------
    // if (process.env.dist_preview) {
    //   server.start({
    //     port: 9526,
    //     directory: './' + process.env.NODE_ENV + 'Dist',
    //     file: '/index.html'
    //   })
    //   const url = 'http://localhost:9526'
    //   console.log(chalk.green(
    //     '  Built for ' + process.env.NODE_ENV + ' environment successful\n' +
    //     '  Built files are in ' + process.env.NODE_ENV + 'Dist\n' +
    //     '  You can preview Built pages on ' + url + '\n'
    //   ))
    //   open(url)
    // }
    // --------------------------
  })
})
