/**
 * 这是一个工具函数，用于将数组解析成特定的树结构
 * 
 */

const parseArrayToTree = (data) => {
    console.log('资产分类数据：', data)
    // 统一key
    data = mapFields(data)
    console.log('处理后的资产分类数据：', data)

    const tree = startParse(data)
    console.log('树：', tree)

    return tree
}

const startParse = (data) => {
    // root是一个数组，只有一个对象元素，是tree的根节点 [{}]
    let root = data.filter((v, i, a) => {
        return v.level == 1
    })
    console.log('根节点：', root)

    root = parseToTree(root[0], data)
    return [root]
}

/**
 * 找到item在data中的children
 *  
 */
const parseToTree = (item, data) => {
    // 给item添加children属性
    item.children ? ('') : (item.children = [])
    // 找到item的所有children
    item.children = data.filter((v, i, a) => {
        return v.parentName == item.name
    })
    // 查看children中的v是否还有children，如果有继续循环
    if (item.children.length > 0) {
        item.children.map((v, i, a) => {
            parseToTree(v, data)
        })
    } else {
        return null
    }

    return item
} 

/**
 * map
 *  不同来源的数据，key可能会不一样，但是相同的key代表的意思是一样的
 */
const mapFields = (data) => {
    const map = getMap()

    return data.map((v, i, a) => {
        // obj是临时容器，return obj
        let obj = {}
        /**
         * 遍历对象，取出我们需要的字段，并且通过map[key]修改key
         * 
         */
        for (let key in v) {
            // 获取新key
            let newKey = map[key]
            // 判断newKey是否存在
            if (newKey) {
                obj[newKey] = v[key]
                if (newKey == 'name') {
                    obj.label = v[key]
                    obj.value = v[key]
                }
            }
        }
        return obj
    })
}

/**
 * 字段映射关系
 * 
 */
const getMap = () => {
    const map = {
        rank: 'level',
        assettypeid: 'id',
        assetareaid: 'id',
        assettypename: 'name',
        assetareaname: 'name',
        parenttypename: 'parentName',
        parentareaname: 'parentName'

    }
    return map
}



export default parseArrayToTree

export {
    parseArrayToTree
}