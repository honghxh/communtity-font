
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})


module.exports = {
  lintOnSave: false, // 关闭语法检测
  // 开启代理服务器
 
  devServer: {
      // 代理服务器可以将路由中的指定前缀转发到指定的后端服务器中
      proxy: {
          '/api': {
              target: 'http://localhost:8081',
              ws: true, // 是否启用websockets
              changeOrigin: true,  // 代理时是否更改host
              pathRewrite: {
                  '^/api': 'api' //这里理解成用'/api'代替target里面的地址
              },
              
          }
      }
  }
}