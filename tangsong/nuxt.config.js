
const PostCompilePlugin = require('webpack-post-compile-plugin');
const TransformModulesPlugin = require('webpack-transform-modules-plugin');
// const TransformEs2015MdulesPlugin = require('babel-plugin-transform-es2015-modules-commonjs');
// 设置反向代理
const proxy = require('./proxy');
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
      { name: 'apple-mobile-web-app-capable', content: 'no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: './node_modules/lib-flexible/flexible.js',
      ssr: false
    },
    {
      src: '~plugins/vant.js',
      ssr: true
    },
    '~/plugins/axios'
  ],
  axios: {
      proxy: true
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */

  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  styleResources: {
    less: [__dirname + '/assets/css/main.less'],
    // sass: ... 需要什么配置什么，这里是全局的
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
    vendor:['axios'],
    postcss: {
      plugins: {
        // 通过传递 false 来禁用插件
        'postcss-pxtorem': {
          rootValue: 37.5,
          unitPrecision: 5,
          propList: ['*'],
          selectorBlackList: [],
          replace: true,
          mediaQuery: false,
          minPixelValue: 12
        },
        'autoprefixer': {
            overrideBrowserslist: ['> 0.15% in CN']
        }
      }
    },
    // standalone: true,
    transpile: ['cube-ui'],
    loaders: {
      stylus: {
        'resolve url': true
        // import: [path.resolve(__dirname, './assets/theme')]
      }
    },
    plugins: [
      new PostCompilePlugin(),
      new TransformModulesPlugin()
      // new TransformEs2015MdulesPlugin()
    ]
  },
  proxy: proxy
}
