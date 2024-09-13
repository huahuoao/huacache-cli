const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:4160', // 目标 API 地址
        changeOrigin: true, // 是否改变原始的请求源
        // 不需要 pathRewrite
      },
    },
  },
})
