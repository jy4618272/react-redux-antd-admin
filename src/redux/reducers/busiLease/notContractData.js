import React from 'react'
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/notContract'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '交款单号',
            dataIndex: 'businessnumber',
            key: 'businessnumber'
        },
        {
            title: '客户名称',
            dataIndex: 'organization',
            key: 'organization'
        },
        {
            title: '金额/元',
            dataIndex: 'money',
            key: 'money  '
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: '所属基地',
            dataIndex: 'site',
            key: 'site'
        },
        {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo'
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)