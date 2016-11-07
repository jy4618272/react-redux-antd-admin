import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/leaseAdd'

const initialState = {
    roomForm: [
        {
            key: 'area',
            title: '区域',
            showType: 'select',
            options: [],
            placeholder: "请选择区域",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, message: '必填，请选择区域' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'build',
            title: '楼号',
            showType: 'select',
            options: [],
            placeholder: "请选择楼号",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '必填，请选择楼号' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'room',
            title: '房间号',
            dataType: 'varchar',
            placeholder: '请输入房间号',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '必填，请输入房间号' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'roomarea',
            title: '面积',
            dataType: 'varchar',
            placeholder: '请输入面积',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, message: '必填，请输入面积' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'money',
            title: '金额',
            dataType: 'varchar',
            placeholder: '请输入金额',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, message: '必填，请输入金额' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varchar',
            showType: 'full',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    { min: 4, max: 255, message: '非必填，如果填写至少4个汉字' },
                ],
                trigger: 'onChange',
            }]
        }
    ],
    tableColumns: [
        {
            title: "房间物品",
            dataIndex: "itemname",
            key: "itemname"
        },
        {
            title: "物品规格",
            dataIndex: "spec",
            key: "spec"
        },
        {
            title: "数量",
            dataIndex: "num",
            key: "num"
        },
        {
            title: "价格",
            dataIndex: "money",
            key: "money"
        },
        {
            title: "备注",
            dataIndex: "memo",
            key: "memo"
        }
    ],
    roomGoodsForm: [
        {
            title: "房间物品",
            key: "itemname",
            dataType: 'varchar',
            placeholder: "请输入房间物品",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请输入房间物品' },
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            title: "物品规格",
            key: "spec",
            dataType: 'varchar'
        },
        {
            title: "数量",
            key: "num",
            dataType: 'int',
            placeholder: "请输入数量",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'number', message: '请输入正确的数量' },
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            title: "价格",
            key: "money",
            dataType: 'float',
            placeholder: "请输入价格",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'number', message: '请输入正确的价格' },
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            title: "备注",
            key: "memo",
            dataType: 'varchar'
        }
    ]
}

export default createReducer(initialState, ACTION_HANDLERS)

