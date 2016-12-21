import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiFinance/payment'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '客户名称',
            dataIndex: 'organization',
            key: 'organization',
            width:'10%',
        },
        {
            title: '类型',
            dataIndex: 'metertype',
            key: 'metertype',
            width:'5%'            
        },
        {
            title: '房间号',
            dataIndex: 'room',
            key: 'room',
            width:'5%'
        },
        {
            title: '设备号',
            dataIndex: 'metercode',
            key: 'name',
            width:'10%'
        },
        {
            title: '交款单号',
            dataIndex: 'businessnumber',
            key: 'businessnumber',
            width:'15%'
        },
        {
            title: '金额（元）',
            dataIndex: 'transactionamount',
            key: 'transactionamount',
            width:'10%'
        },
        {
            title: '充值量',
            dataIndex: 'transactiondegrees',
            key: 'transactiondegrees',
            width:'10%'
        },
        {
            title: '充值日期',
            dataIndex: 'transactiondate',
            key: 'transactiondate',
            width:'15%'
        },
        {
            title: '充值状态',
            dataIndex: 'dealstatus',
            key: 'dealstatus',
            width:'10%'
        }
    ],
    tableData: [],
    skipCount: 1,      // 默认是第 0 页
    pageSize: 10,      // 默认每页显示 10 条记录
    count: 0            // 总共有多少条数据
}

export default createReducer(initialState, ACTION_HANDLERS)

