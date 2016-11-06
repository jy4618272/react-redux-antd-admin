import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/roomEdit'

const initialState = {
    room: [
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
                        { required: true, type: 'string', message: '必填，请选择区域' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'build',
            title: '楼号',
            dataType: 'varchar',
            showType: 'select',
            options: [],
            placeholder: '请选择楼号',
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
                        { required: true, type: 'number', message: '必填，请输入面积' },
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
                        { required: true, type: 'number', message: '必填，请输入金额' },
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
            title: "序号",
            dataIndex: "primaryKey",
            key: "primaryKey"
        },
        {
            title: "房间物品",
            dataIndex: "goods",
            key: "goods"
        },
        {
            title: "物品规格",
            dataIndex: "size",
            key: "size"
        },
        {
            title: "数量",
            dataIndex: "num",
            key: "num"
        },
        {
            title: "价格",
            dataIndex: "price",
            key: "price"
        },
        {
            title: "备注",
            dataIndex: "memo",
            key: "memo"
        },
        {
            title: '',
            key: "add",
            render: () => <a href="javascript:void(0)" onClick={() => { alert(3) } }><Icon type="delete" /> 删除</a>,
        }
    ],
    tableSource: [],
    loading: true,
    data: {}
}
export default createReducer(initialState, ACTION_HANDLERS)