/**
 * 合同新增-合同房间表格
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractTabs'

const initialState = {
    topButtons: {
        left: [
            {
                key: 'addRoom',
                title: '新增房间'
            }
        ],
        center: [],
        right: []
    },
    tableColumns: [
        {
            title: '区域',
            dataIndex: 'area',
            key: 'area'
        },
        {
            title: '楼号',
            dataIndex: 'build',
            key: 'build'
        },
        {
            title: '房间号',
            dataIndex: 'room',
            key: 'room'
        },
        {
            title: '面积',
            dataIndex: 'romearea',
            key: 'romearea'
        },
        {
            title: '金额',
            dataIndex: 'money',
            key: 'money'
        },
        {
            title: '流程状态',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: '操作',
            key: 'operation',
            render: (record) => {
                <a href="javascript:;" className="s-blue" onClick={this.handleDelTr.bind(this, record)}>删除</a>
            }
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)