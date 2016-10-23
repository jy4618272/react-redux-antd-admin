/**
 * 合同新增-客户信息获取
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractFrom'

const initialState = [
    {
        key: 'modelname',
        title: '合同模板',
        showType: 'select',
        options: [],
        placeholder: "请选择合同模板",
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, message: '必填，请选择合同模板' },
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    },
    {
        key: 'pactkind',
        title: '合同类型',
        dataType: 'varchar',
        placeholder: '请选择模板类型',
        disabled: true
    }
]

export default createReducer(initialState, ACTION_HANDLERS)