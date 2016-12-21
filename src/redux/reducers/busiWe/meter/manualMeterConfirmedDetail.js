import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiWe/meter/manualMeterConfirmedDetail'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '核算年月',
            dataIndex: 'checkdate',
            key: 'checkdate',
            width: '15%'
        },
        {
            title: '类型',
            dataIndex: 'metertype',
            key: 'metertype',
            width: '10%'
        },
        {
            title: '设备编号',
            dataIndex: 'metercode',
            key: 'metercode',
            width: '10%'
        },
        {
            title: '客户名称',
            dataIndex: 'organization',
            key: 'organization',
            width: '15%'
        },
        {
            title: '房间号',
            dataIndex: 'room',
            key: 'room',
            width: '10%'
        },
        {
            title: '上期示数',
            dataIndex: 'prereadout',
            key: 'prereadout',
            width: '10%'
        },
        {
            title: '本期示数',
            dataIndex: 'currentreadout',
            key: 'currentreadout',
            width: '10%'
        },
        {
            title: '本期用量',
            dataIndex: 'currentamount',
            key: 'currentamount',
            width: '10%'
        },
        {
            title: '金额',
            dataIndex: 'currentmoney',
            key: 'currentmoney',
            width: '10%'
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)