/**
 * 客户信息获取
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/organization'

const initialState = {
    querySchema: [
        {
            key: 'organizationnum',
            title: '关键字',
            dataType: 'varchar',
            showType:'two',
            placeholder: "请输入会员名|注册手机号|身份证号"
        },
    ],
    queryButtons: [
        {
            key: 'searchOrganization',
            type: 'primary',
            icon: 'search',
            title: '搜索'
        }
    ],
    tableColumns: [
        {
            title: '客户名称',
            dataIndex: 'organization',
            key: 'organization'
        },
        {
            title: '公司法人',
            dataIndex: 'legalperson',
            key: 'legalperson'
        },
        {
            title: '身份证',
            dataIndex: 'idcard',
            key: 'idcard'
        },
        {
            title: '身份证地址',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: '联系电话',
            dataIndex: 'tel',
            key: 'tel'
        },
        {
            title: '开户银行',
            dataIndex: 'bankname',
            key: 'bankname'
        },
        {
            title: '银行帐号',
            dataIndex: 'bankaccount',
            key: 'bankaccount'
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)  