import { notification } from 'antd'

// 此处配置 根访问路径 以及 全局错误处理
// 更多配置请根据业务逻辑自行实现

// 后端 API 地址，最好以 http(s):// 打头
let rootPaths
if (__DEV__) {
	rootPaths = {
		rootPath: 'http://dev.myportaltest.tf56.com:9090',
		imgPath: 'http://10.7.15.56'
	}
}
if (__PROD__) {
	rootPaths = {
		rootPath: 'http://myportal.tf56.com',
		imgPath: 'http://image.tf56.com'
	}
}

const paths = {
	// 财务
	financePath: '/financeParkAdmin',
	// 租赁
	leasePath: '/tfPassParkAdmin',
	imgPath: '/dfs'
}

const errHandler = (e) => {
	notification.error({
		message: '出错啦!',
		description: `请联系管理员, 错误信息: ${e}`
	});
	console.error('[ XHR:Failed ]', e)
}

export { 
	rootPaths, 
	errHandler, 
	paths 
}
