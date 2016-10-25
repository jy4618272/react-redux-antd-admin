/**
 * 客户信息获取
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractInsert/contractOrganization'

const initialState = {
    tableColumns: [
        {
            title: '客户名称',
            dataIndex: 'keyname',
            key: 'keyname'
        },
        {
            title: '公司法人',
            dataIndex: 'promotiontype',
            key: 'promotiontype'
        },
        {
            title: '身份证',
            dataIndex: 'promotionnum',
            key: 'promotionnum'
        },
        {
            title: '公司地址',
            dataIndex: 'area',
            key: 'area'
        },
        {
            title: '联系电话',
            dataIndex: 'promotionnum',
            key: 'promotionnum'
        },
        {
            title: '开户银行',
            dataIndex: 'area',
            key: 'area'
        },
        {
            title: '银行帐号',
            dataIndex: 'businessnumber',
            key: 'businessnumber'
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)  