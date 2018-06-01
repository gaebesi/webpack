'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  devtool: config.dev.devtool,

  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
      }]
    },
    hot: true,
    contentBase: false,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? {
        warnings: false,
        errors: true
      }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true,
    watchOptions: {
      poll: config.dev.poll
    }
  },
  /**
   *plugins:处理除了loader进行处理的模块代码转换的更多其他的一些构建任
   *DefinePlugin 定义环境变量(确定 插入)
   *HotModuleReplacementPlugin 热重载(热模块更换 HMR)
   *NamedModulesPlugin 启用HMR时直接返回更新的文件名
   *NoEmitOnErrorsPlugin 编译错误时跳过输出阶段 确保输出资源不包含错误 如果使用了cli 启用此插件webpack进程遇到错误代码将不会退出
   *HtmlWebpackPlugin 编译时生成html文件，将构建的html页面和构建的js关联 查看https://github.com/jantimon/html-webpack-plugin 可以添加mate标签 favicon https://juejin.im/book/5a6abad5518825733c144469/section/5a6abbe4518825734f52eb8f
   *CopyWebpackPlugin 将单个文件或者整个目录复制到构建文件目录下面  这里是将static目录下面的静态资源文件复制到构建目录 并忽视.*的文件
   *inject:true || 'head' || 'body' || false 将所有资产注入给定template或templateContent。当传递true或'body'所有JavaScript资源将被放置在正文元素的底部。'head'将脚本放置在head元素中
  */
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'index.html', // // 配置文件模板
      inject: true
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      process.env.PORT = port
      devWebpackConfig.devServer.port = port

      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
