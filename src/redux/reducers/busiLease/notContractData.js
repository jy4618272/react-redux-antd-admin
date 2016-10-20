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
            title: '金额',
            dataIndex: 'money    ',
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
        }, 
        {
            title: '操作',
            key: 'operator',
            render: (text, record, index) => {
                return(
                    <div>
                        <a href="javascript:;" onClick={() => {this.handleDd.bind(this, record)}} className="s-blue">打印缴款单</a>
                        <a href="javascript:;" onClick={() => {console.log(record)}} className="s-blue g-ml10">作废</a>
                    </div>
                )
            }
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)