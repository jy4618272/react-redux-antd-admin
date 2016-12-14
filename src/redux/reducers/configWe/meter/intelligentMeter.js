import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configWe/meter/intelligentMeter'

const initialState = {
    modalForm: [
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
            key: 'supplier',
            title: '品牌选择',
            modalType: true,
            dataType:'varchar',
            showType: 'select',
            options: [
                { key: '大华', value: '大华' },
                { key: '德力西', value: '德力西' },
                { key: '广发伟业', value: '广发伟业' }
            ],
            placeholder: '请选择品牌选择',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请选择品牌选择' }
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
            key: 'firstthreshold',
            title: '一级阀值/度',
            modalType: true,        
            dataType: 'int',
            placeholder: '请输入一级阀值/度',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'number', message: '请输入一级阀值/度' }
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'secondthreshold',
            title: '二级阀值/度',
            modalType: true,        
            dataType: 'int',
            placeholder: '请输入二级阀值/度',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'number', message: '请输入二级阀值/度' }
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'meterprice',
            title: '单价',
            modalType: true,        
            dataType: 'float',
            placeholder: '请输入单价',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'number', message: '请输入单价' }
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: '8',
            title: '',
            memo:'开启余量不足通知，每小时判断是否低于阀值。',
            modalType: true,      
            showType: 'checkboxChoose'
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
            title: '单价',
            dataIndex: 'meterprice',
            key: 'meterprice'
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
            title: '余量',
            dataIndex: 'surplusnumber',
            key: 'surplusnumber'
        },
        {
            title: '一级阀值',
            dataIndex: 'firstthreshold',
            key: 'firstthreshold'
        },
        {
            title: '二级阀值',
            dataIndex: 'secondthreshold',
            key: 'secondthreshold'
        }
    ],
    tableData:[],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)