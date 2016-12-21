import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiWe/meter/intelligentMeter'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '客户',
            dataIndex: 'organization',
            key: 'organization'
        },
        {
            title: '房间号',
            dataIndex: 'room',
            key: 'room'
        },
        {
            title: '楼号',
            dataIndex: 'build',
            key: 'build'
        },
        {
            title: '设备编号',
            dataIndex: 'metercode',
            key: 'metercode'
        },
        {
            title: '充值量',
            dataIndex: 'latestamount',
            key: 'latestamount'
        },
        {
            title: '金额',
            dataIndex: 'meterprice',
            key: 'meterprice'
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