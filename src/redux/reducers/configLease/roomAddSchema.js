import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/leaseAdd'

const initialState = {
    roomForm: [
        {
            key: 'area',
            title: '区域',
            dataType: 'varchar',
            options: [],
            placeholder: "请输入区域",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type:'string', message: '请输入区域' },
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'build',
            title: '楼号',
            dataType: 'varchar',
            options: [],
            placeholder: "请输入楼号",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请输入楼号' },
                    ],
                    trigger: ['onChange']
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
                        { required: true, type: 'string', message: '请输入房间号' },
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'roomarea',
            title: '面积/平方米',
            dataType: 'float',
            placeholder: '请输入面积',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type:'number', message: '请输入面积' },
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            key: 'money',
            title: '金额/元',
            dataType: 'float',
            placeholder: '请输入金额',
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type:'number', message: '请输入金额' },
                    ],
                    trigger: ['onChange']
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
                    {message: '非如果填写至少4个汉字' },
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

