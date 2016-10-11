import {notification} from 'antd'

// 此处配置 根访问路径 以及 全局错误处理
// 更多配置请根据业务逻辑自行实现

// 后端 API 地址，最好以 http(s):// 打头
export const rootPath = 'http://dev.myportaltest.tf56.com:9090'

export const errHandler = (e) => {
  notification.error({
    message: '出错啦!',
    description: `请联系管理员, 错误信息: ${e}`,
    duration: 0,
  });
  // alert('[ XHR:Failed ] 详情请看控制台')
  console.error('[ XHR:Failed ]', e)
}
