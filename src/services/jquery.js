import { rootPath, errHandler } from './config'
import $ from 'jquery'

const xhr = (method, url, body, cb) => {
	$.ajax({
		type: method,
		url: url,
		data: body,
		dataType: 'json'
	})
	.done((res) => {
		cb(res)
	})
	.fail(errHandler)
}

export default xhr
