/**
 * 客户信息获取
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/contractTpl/dictionary'

const initialState = {
    loading: false,
    querySchema: [
        {
            key: 'printModelVariable',
            title: '查询内容',
            showType: 'varchar',
            placeholder: "请输入关键字"
        },
    ],
    queryButtons: [
        {
            key: 'searchDictionary',
            type: 'primary',
            title: '搜索'
        }
    ],
    data: [],
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)  