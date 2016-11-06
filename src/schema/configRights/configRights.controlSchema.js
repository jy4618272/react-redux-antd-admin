// 定义某个表渲染时的配置
// 如果不需要个性化, 可以不要这个文件, 所有配置项都会使用默认值
// 注意! config/dataSchema/querySchema文件的命名应该遵循CamelCase原则, 不要包含下划线/中划线

module.exports = {
    department: {
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
                key: 'del',
                title: '删除'
            }
        ],
        right: []
    },
    post: {
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
                key: 'del',
                title: '删除'
            }
        ],
        right: []
    },
    role: {
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
                key: 'del',
                title: '删除'
            },
            {
                key: 'menuRights',
                title: '菜单权限配置'
            },
            {
                key: 'dataRights',
                title: '数据权限配置'
            }
        ],
        right: []
    },
    user: {
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
                key: 'del',
                title: '删除'
            }
        ],
        right: []
    },
}