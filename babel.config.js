// 发布阶段用到的babel插件(开发阶段不生效)
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  //production 处于开发模式
  prodPlugins.push('transform-remove-console') //产品发布时去掉console.log
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    //发布产品时的插件数组
    ...prodPlugins,
    //安装路由懒加载插件
    '@babel/plugin-syntax-dynamic-import'
  ]
}
