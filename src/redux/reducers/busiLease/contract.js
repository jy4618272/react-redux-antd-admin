import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contract'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title:'',            
            dataIndex:'',            
            key:''
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)