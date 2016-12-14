/**
 * 向服务端发送select请求, 会返回一个promise对象
 * 
 * @param  包含了form中所有的查询条件, 再加上page和pageSize, 后端就能拼成完整的sql
 * @param page
 * @param pageSize
 * @returns {Promise}
 */
const pageChange = (queryObj, pageSize, skipCount, func) => {
    skipCount = (skipCount <= 1) ? 0 : (skipCount - 1) * pageSize
    const tmpObj = Object.assign({}, queryObj, {
        pageSize,
        skipCount
    })
    console.log('pageSelect', tmpObj)
    func(tmpObj)
}

export {
    pageChange
}