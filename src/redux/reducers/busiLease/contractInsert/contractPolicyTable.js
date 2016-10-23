/**
 * 合同新增-合同房间表格
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractTabs'

const initialState = {
    topButtons: {
        left: [
            {
                key: 'addPolicy',
                title: '新增优惠'
            }
        ],
        center: [],
        right: []
    },
    tableColumns: [
        {
            title: '活动名称',
            dataIndex: 'promotionname',
            key: 'promotionname'
        },
        {
            title: '优惠类型',
            dataIndex: 'promotiontype',
            key: 'promotiontype'
        },
        {
            title: '优惠幅度',
            dataIndex: 'promotionnum',
            key: 'promotionnum'
        },
        {
            title: '范围',
            dataIndex: 'area',
            key: 'area'
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