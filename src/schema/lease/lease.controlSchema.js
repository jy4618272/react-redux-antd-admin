// 定义某个表渲染时的配置
// 如果不需要个性化, 可以不要这个文件, 所有配置项都会使用默认值
// 注意! config/dataSchema/querySchema文件的命名应该遵循CamelCase原则, 不要包含下划线/中划线

module.exports = {
    room: {
        showAdd: true,
        showMod: true,
        showLie: true,
        showVoid: true,
        showHistory: true,
        showSearchAll: true,
        showSearchRented: true,
        showSearchNotRent: true,
        showSearchVoid: true,
        showExportPage: true
    },
    classLine: {
        showAdd: true,
        showMod: true,
        showOpen: true,
        showClose: true
    },
    policy: {
        showAdd: true,
        showMod: true,
        showOpen: true,
        showClose: true
    },
    accountManager: {
        showAdd: true,
        showMod: true,
        showOpen: true,
        showClose: true
    },
    contractTpl: {
        showAdd: true,
        showMod: true,
        showOpen: true,
        showClose: true,
        showSearchDictionary: true        
    },
    auditPerson: {
        showAdd: true,
        showMod: true,
        showDel: true,
        showOpen: true,
        showClose: true
    }
}