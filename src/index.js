/**
 * 程序的入口, 类似java中的main
 */

import React from 'react'
import { render} from 'react-dom'
import { Provider } from 'react-redux'
import store from 'STORE'

import routes from 'ROUTE'

/**
 * 下面这货用于检测不必要的重新渲染，详情请看其项目地址：
 * https://github.com/garbles/why-did-you-update
 *
 * 有关性能提升方面的问题
 * 诸如 PureComponent / shouldComponentUpdate / Immutable.js 等
 * 请自行查阅相关资料
 */
if (__DEV__ && __WHY_DID_YOU_UPDATE__) {
    const { whyDidYouUpdate } = require('why-did-you-update')
    whyDidYouUpdate(React)
}
if (__DEV__) {
    console.info('[当前环境] 开发环境')
}
if (__PROD__) {
    console.info('[当前环境] 生产环境')
}


const MOUNT_NODE = document.getElementById('root')

render(
    <Provider store={store}>
        {routes}
    </Provider>,
    MOUNT_NODE
)
