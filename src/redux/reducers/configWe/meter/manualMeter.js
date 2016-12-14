import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configWe/meter/manualMeter'

const initialState = {
    modalForm:[
        {
            key: 'metertype',
            title: '类型',
            modalType: true,
            showType: 'select',
            options: [
                { key: '水', value: '水' },
                { key: '电', value: '电' }
            ],
            placeholder: '请选择类型',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请选择类型' }
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'metername',
            title: '表名称',
            modalType: true, 
            dataType: 'varchar',
            placeholder: '请输入表名称',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请输入表名称' }
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'metercode',
            title: '设备编号',
            modalType: true,        
            dataType: 'varchar',
            placeholder: '请输入设备编号',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请输入设备编号' }
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'chargetype',
            title: '计费类型',
            modalType: true, 
            dataType: 'varchar',       
            showType: 'select',
            // disabled: true,
            options: [],        
            placeholder: '请选择计费类型',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请选择计费类型' }
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'meterrate',
            title: '表倍率',
            modalType: true,        
            dataType: 'varchar',
            placeholder: '请输入表倍率',
            disabled: true
        },
        {
            key: 'defaultreadout',
            title: '初始读数',
            modalType: true,        
            dataType: 'int',
            default: 0,            
            placeholder: '请输入初始读数',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'number', message: '请输入初始读数' }
                    ],
                    trigger: ['onChange']
                }
            ]
        }
    ],
    tableLoading: true,
    tableColumns: [
        {
            title: '类型',
            dataIndex: 'metertype',
            key: 'metertype'
        },
        {
            title: '表名称',
            dataIndex: 'metername',
            key: 'metername'
        },
        {
            title: '设备编号',
            dataIndex: 'metercode',
            key: 'metercode'
        },
        {
            title: '计费类型',
            dataIndex: 'chargetype',
            key: 'chargetype'
        },
        {
            title: '表倍率',
            dataIndex: 'meterrate',
            key: 'meterrate'
        },
        {
            title: '初始读数',
            dataIndex: 'defaultreadout',
            key: 'defaultreadout'
        }
    ],
    tableData:[],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)