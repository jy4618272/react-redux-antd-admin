import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configWe/list/printList'

const initialState = {
    modalForm:[
        {
            key: 'checkdate',
            title: '核算年月',
            modalType: true,
            dataType: 'monthtime',
            format: 'YYYY-MM',
            placeholder: '请选择核算年月',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'object', message: '请选择核算年月' }
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'waterreadingdate',
            title: '水抄表日期',
            modalType: true, 
            dataType: 'datetime',
            format: 'YYYY-MM-DD',
            placeholder: '请选择水抄表日期',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'object', message: '请选择水抄表日期' }
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'electricreadingdate',
            title: '电抄表日期',
            modalType: true,        
            dataType: 'datetime',
            format:'YYYY-MM-DD',
            placeholder: '请选择电抄表日期',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'object', message: '请选择电抄表日期' }
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'paymentmemo',
            title: '交款单备注',
            modalType: true,    
            showType: 'full',    
            dataType: 'varchar',
            placeholder: '请输入交款单备注',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请输入交款单备注' }
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        }
    ],
    tableLoading: true,
    tableColumns: [
        {
            title: '核算月份',
            dataIndex: 'checkdate',
            key: 'checkdate'
        },
        {
            title: '水表抄表日期',
            dataIndex: 'waterreadingdate',
            key: 'waterreadingdate'
        },
        {
            title: '电表抄表日期',
            dataIndex: 'electricreadingdate',
            key: 'electricreadingdate'
        },
        {
            title: '交款单备注',
            dataIndex: 'paymentmemo',
            key: 'paymentmemo'
        }
    ],
    tableData:[],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)