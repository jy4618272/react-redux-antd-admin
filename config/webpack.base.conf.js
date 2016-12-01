const path = require('path');
const webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var src = path.resolve(__dirname, '../src'); // 源码目录
var commonPath = {
	dist: path.resolve(__dirname, '../dist'), // build 后输出目录
	indexHTML: path.join(src, 'index.html'), // 入口基页
	staticDir: path.resolve(__dirname, '../static'), // 无需处理的静态资源目录
	module: path.resolve(__dirname, '../node_modules') // 无需处理的静态资源目录
};

// 将babel-loader的配置独立出来, 因为webpack的限制: http://stackoverflow.com/questions/33117136/how-to-add-a-query-to-a-webpack-loader-with-multiple-loaders
const babelLoaderConfig = {
	presets: ['es2015', 'stage-0', 'react'],  // 开启ES6、部分ES7、react特性, preset相当于预置的插件集合
	plugins: [
		"transform-runtime",
		"transform-decorators-legacy",
		['antd', { 'style': true }]
	]  // antd模块化加载, https://github.com/ant-design/babel-plugin-antd
}

module.exports = {
	commonPath: commonPath,
	entry: {
		app: path.join(src, 'index.js'),  // 编译的入口
	},

	output: {  
		// 输出的目录和文件名
		path: path.join(commonPath.dist, 'assets'),
		// publicPath: '/static/'
	},

	resolve: {
		// modulesDirectories: [src, commonPath.module],  // import时到哪些地方去寻找模块
		extensions: ['', '.js', '.jsx', '.less', '.json'],  // require的时候可以直接使用require('file')，不用require('file.js')
		alias: {
			CONTAINER: path.join(src, 'containers'),
			COMPONENT: path.join(src, 'components'),
			ACTION: path.join(src, 'redux/actions'),
			REDUCER: path.join(src, 'redux/reducers'),
			STORE: path.join(src, 'redux/store'),
			ROUTE: path.join(src, 'routes'),
			SERVICE: path.join(src, 'services'),
			UTIL: path.join(src, 'utils'),
			HOC: path.join(src, 'utils/HoC'),
			MIXIN: path.join(src, 'utils/mixins'),
			SCHEMA: path.join(src, 'schema'),
			STYLE: path.join(src, 'style')
		}
	},
	module: {
		loaders: [  // 定义各种loader
			{
				test: /\.jsx?$/,
				loaders: ['react-hot', 'babel-loader?' + JSON.stringify(babelLoaderConfig)],  // react-hot-loader可以不用刷新页面, 如果用普通的dev-server的话会自动刷新页面
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				include: path.join(__dirname, 'app'),
				loader: ExtractTextPlugin.extract('style-loader', '!css-loader!postcss-loader'),
			},
			{
				test: /\.css$/,
				exclude: path.join(__dirname, 'app'),
				loader: 'style!css',
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader'),
			},
			{
                test: /\.(ttf|eot|svg|woff?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader?limit=10000&name=fonts/[name].[ext]?v=[hash:8]'
            },
			{
				test: /\.(png|jpg|svg)$/,
				loader: 'url?limit=25000',  // 图片小于一定值的话转成base64
			},
		],
	},

	plugins: [
		new webpack.BannerPlugin('This file is created by rzy'),   // 生成文件时加上注释
		new webpack.DefinePlugin({
			'process.env': {
				// 这是给 React / Redux 打包用的
				NODE_ENV: JSON.stringify('production')
			},
			// ================================
			// 配置开发全局常量
			// ================================
			__DEV__: process.env.NODE_ENV.trim() === 'development',
			__PROD__: process.env.NODE_ENV.trim() === 'production',
			__COMPONENT_DEVTOOLS__: false, // 是否使用组件形式的 Redux DevTools
			__WHY_DID_YOU_UPDATE__: false // 是否检测不必要的组件重渲染
		})
	],
};
