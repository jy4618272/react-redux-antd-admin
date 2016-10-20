import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/bond'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title:'客户名称',            
            dataIndex:'organization',            
            key:'organization'
        },
        {
            title:'房间',            
            dataIndex:'roomlist',            
            key:'roomlist'
        },
        {
            title:'流程状态',            
            dataIndex:'flowstatus',            
            key:'flowstatus'
        },
        {
            title:'金额',            
            dataIndex:'marginmoney',            
            key:'marginmoney'
        },
        {
            title:'交款单号',            
            dataIndex:'businessnumber',            
            key:'businessnumber'
        },
        {
            title:'备注',            
            dataIndex:'memo',            
            key:'memo'
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)