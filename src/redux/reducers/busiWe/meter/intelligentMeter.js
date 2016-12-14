import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiWe/meter/intelligentMeter'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '客户',
            dataIndex: '1',
            key: '1'
        },
        {
            title: '房间号',
            dataIndex: '2',
            key: '2'
        },
        {
            title: '楼号',
            dataIndex: '3',
            key: '3'
        },
        {
            title: '设备编号',
            dataIndex: 'organization',
            key: 'organization'
        },
        {
            title: '充值量',
            dataIndex: '4',
            key: '4'
        },
        {
            title: '金额',
            dataIndex: '5',
            key: '5'
        },
        {
            title: '余量',
            dataIndex: '6',
            key: '6'
        },
        {
            title: '一级阀值',
            dataIndex: '7',
            key: '7'
        },
        {
            title: '二级阀值',
            dataIndex: '8',
            key: '8'
        }
    ],
    tableData:[],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)