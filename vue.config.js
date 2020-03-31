module.exports = {

  // 基本路径
 publicPath: '/',

  // 反向代理
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      // 配置跨域   
      '/user': {
        target: 'http://localhost:8888/user/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/user': ''
        }
      },
      '/student': {
        target: 'http://localhost:8888/student/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/student': ''
        }
      },
      '/teacher': {
        target: 'http://localhost:8888/teacher/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/teacher': ''
        }
      },
      '/course': {
        target: 'http://localhost:8888/course/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/course': ''
        }
      },
      '/room': {
        target: 'http://localhost:8888/room/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/room': ''
        }
      },
      '/class': {
        target: 'http://localhost:8888/class/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/class': ''
        }
      }
    },
    before: app => {}
  }
};
