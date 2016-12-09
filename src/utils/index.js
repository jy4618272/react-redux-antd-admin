import moment from 'moment'

const goBack = (page = 0) => {
    history.goBack(page)
}

const getUrlPara = (key, path) => {
    var paras = path ? path : window.location.href;
    if (paras) {
        var items = paras.split('?')[1].split('&'),
            len = items.length,
            i = 0,
            obj = {};
        for (; i < len; i++) {
            var item = items[i].split('='),
                name = item[0],
                value = item[1] ? item[1] : '';
            obj[name] = value;
        }
        if (!key) {
            return obj;
        } else {
            return obj[key];
        }
    }
}

const filterQueryObj = (oldObj, dateType = 'YYYY-MM-DD HH:mm:ss') => {
    // 将提交的值中undefined的去掉
    const newObj = {}

    for (const key in oldObj) {
        if (oldObj[key]) {
            // 对于js的日期类型, 要转换成字符串再传给后端
            if (key.indexOf('date') > -1) {
                newObj[key] = oldObj[key].format(dateType)
            } else {
                newObj[key] = oldObj[key]
            }
        }
    }
    return newObj
}

const filterQueryObjMoment = (oldObj) => {
    // 将提交的值中undefined的去掉
    const newObj = {}

    for (const key in oldObj) {
        if (key.indexOf('date') > -1) {
            newObj[key] = moment(oldObj[key], 'YYYY-MM-DD HH:mm:ss')
        } else if (key.indexOf('totalstages') > -1) {
            continue;
        } else {
            newObj[key] = oldObj[key]
        }
    }
    return newObj
}

export {
    goBack,
    getUrlPara,
    filterQueryObj,
    filterQueryObjMoment
}