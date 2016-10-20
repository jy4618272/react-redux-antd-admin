// 定义某个表渲染时的配置
// 如果不需要个性化, 可以不要这个文件, 所有配置项都会使用默认值
// 注意! config/dataSchema/querySchema文件的命名应该遵循CamelCase原则, 不要包含下划线/中划线

module.exports = {
    not: {
        left: [
            {
                key: 'receive',
                title: '确认收款'
            },
            {
                key: 'refund',
                title: '确认退款'
            }
        ],
        center: [],
        right: [
            {
                key: 'exportPage',
                title: '导出本页'
            }
        ]
    },
    done: {
        left: [
            {
                key: 'document',
                title: '资源文件'
            }
        ],
        center: [],
        right: [
            {
                key: 'exportPage',
                title: '导出本页'
            }
        ]
    }
}