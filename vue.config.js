module.exports = {
  publicPath: '/',
  lintOnSave: process.env.NODE_ENV !== 'production', // 非生产环境开启lintOnSave

  devServer: {
    // dev-server中，lint不通过报错
    overlay: {
      warnings: true,
      errors: true
    }
  },

  pwa: {
    name: 'Hackathon',
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  }
}
