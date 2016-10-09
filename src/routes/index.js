export default {
  path: '/',

  component: require('CONTAINER/Layout').default,

  indexRoute: {
    component: require('CONTAINER/Home').default
  },

  childRoutes: [

    // 路由按模块组织分离，避免单文件代码量过大
    require('./busi').default,
    require('./config').default,

    // 强制“刷新”页面的 hack
    { path: 'redirect', component: require('CONTAINER/Redirect').default },
    // { path: 'antd', component: require('CONTAINER/Antd').default }

    // 无路由匹配的情况一定要放到最后，否则会拦截所有路由
    { path: '*', component: require('CONTAINER/Error').default }
  ]
}

/*
  当前路由树如下
  ├ /
  |
  ├ /msg
  ├ /business
  ├
  ├ /lease
  |
  ├ /redirect
*/
