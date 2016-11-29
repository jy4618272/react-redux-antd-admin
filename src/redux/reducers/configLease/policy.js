import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/policy'

const initialState = {
    tableLoading: false,
    tableColumns: [
        {
            title: '所属基地',
            dataIndex: 'site',
            key: 'site'
        },
        {
            title: '活动名称',
            dataIndex: 'promotionname',
            key: 'promotionname'
        },
        {
            title: '优惠主体',
            dataIndex: 'promotionbody',
            key: 'promotionbody'
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
            title: '区域',
            dataIndex: 'area',
            key: 'area'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo'
        }
    ],
    tableData: [],
    skipCount: 1,      // 默认是第 0 页
    pageSize: 10,      // 默认每页显示 10 条记录
    count: 0            // 总共有多少条数据
}

export default createReducer(initialState, ACTION_HANDLERS)

