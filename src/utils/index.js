const filterQueryObj = (oldObj) => {
    // 将提交的值中undefined的去掉
    const newObj = {}

    for (const key in oldObj) {
        if (oldObj[key]) {
            // 对于js的日期类型, 要转换成字符串再传给后端
            if (key.indexOf('date') > -1) {
                newObj[key] = oldObj[key].format('YYYY-MM-DD HH:mm:ss')
            } else {
                newObj[key] = oldObj[key]
            }
        }
    }
    return newObj
}

export {
    filterQueryObj
}