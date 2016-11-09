import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contract'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title:'客户名称',            
            dataIndex:'organization',            
            key:''
        },
        {
            title:'合同号',            
            dataIndex:'pactcode',            
            key:'pactcode'
        },
        {
            title:'开始日期',            
            dataIndex:'startdate',            
            key:'startdate'
        },
        {
            title:'结束日期',            
            dataIndex:'enddate',            
            key:'enddate'
        },
        {
            title:'流程类型',            
            dataIndex:'flowtype',            
            key:'flowtype'
        },
        {
            title:'流程状态',            
            dataIndex:'flowstatus',            
            key:'flowstatus'
        },
        {
            title:'财务业务状态',            
            dataIndex:'fistatus',            
            key:'fistatus'
        },
        {
            title:'结束类型',            
            dataIndex:'endtype',            
            key:'endtype'
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)