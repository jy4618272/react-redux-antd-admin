// 定义某个表渲染时的配置
// 如果不需要个性化, 可以不要这个文件, 所有配置项都会使用默认值
// 注意! config/dataSchema/querySchema文件的命名应该遵循CamelCase原则, 不要包含下划线/中划线

module.exports = {
    room: {
        left: [
            {
                key: 'add',
                title: '新增'
            },
            {
                key: 'edit',
                title: '修改',
                disabled: true
            },
            {
                key: 'lie',
                title: '闲置'
            },
            {
                key: 'void',
                title: '作废'
            },
            {
                key: 'history',
                title: '历史'
            }
        ],
        right: [
            {
                key: 'exportPage',
                title: '导出本页'
            }
        ]
    },
    classLine: {
        left: [
            {
                key: 'add',
                title: '新增'
            },
            {
                key: 'edit',
                title: '修改'
            },
            {
                key: 'open',
                title: '开启'
            },
            {
                key: 'close',
                title: '关闭'
            }
        ],
        right: []
    },
    policy: {
        left: [
            {
                key: 'add',
                title: '新增'
            },
            {
                key: 'edit',
                title: '修改'
            },
            {
                key: 'open',
                title: '开启'
            },
            {
                key: 'close',
                title: '关闭'
            }
        ],
        right: []
    },
    accountManager: {
        left: [
            {
                key: 'add',
                title: '新增'
            },
            {
                key: 'edit',
                title: '修改'
            },
            {
                key: 'open',
                title: '开启'
            },
            {
                key: 'close',
                title: '关闭'
            }
        ],
        right: []
    },
    contractTpl: {
        left: [
            {
                key: 'add',
                title: '新增'
            },
            {
                key: 'edit',
                title: '修改'
            },
            {
                key: 'open',
                title: '开启'
            },
            {
                key: 'close',
                title: '关闭'
            }
        ],
        right: []
    },
    auditPerson: {
        left: [
            {
                key: 'add',
                title: '新增'
            },
            {
                key: 'edit',
                title: '修改'
            },
            {
                key: 'open',
                title: '开启'
            },
            {
                key: 'close',
                title: '关闭'
            }
        ],
        right: []
    }
}