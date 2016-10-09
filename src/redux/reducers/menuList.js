import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/menuList'

const initialState = [
    {
        key: 'busi',
        name: '业务中心',
        icon: 'home',
        child: [
            {
                key: 'busi_lease',
                name: '租赁业务'
            },
            {
                key: 'busi_finance',
                name: '财务业务'
            }
        ]
    },
    {
        key: 'config',
        name: '配置中心',
        icon: 'home',
        child: [
            {
                key: 'config_base',
                name: '基地配置'
            },
            {
                key: 'config_rights',
                name: '权限配置'
            },
            {
                key: 'config_lease',
                name: '租赁配置'
            }
        ]
    }
]

export default createReducer(initialState, ACTION_HANDLERS)
