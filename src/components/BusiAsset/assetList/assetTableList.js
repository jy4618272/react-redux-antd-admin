/**
 * 展示搜索结果的表格
 *  需要传入的porps
 *      1. isLoading
 *      2. pagination
 *      3. tableData
 *
 * */

import React, { Component } from 'react'
import $ from 'jquery'
import {
    Table,
    Input
} from 'antd'

import './demo.less'

class AssetTableList extends Component {
    constructor() {
        super()
        this.state = {}
    }

    /**
     * 表格的列信息
     *
     * */
    getTableCol() {
        const columns = [
            { title: '资产名称', dataIndex: 'assetname', key: 'assetname' },
            { title: '台账编号', dataIndex: 'parameternumber', key: 'parameternumber' },
            { title: '资产分类', dataIndex: 'assettypelist', key: 'assettypelist' },
            { title: '存放位置', dataIndex: 'assetarealist', key: 'assetarealist' },
            { title: '责任部门', dataIndex: 'assetdeplist', key: 'assetdeplist' },
            { title: '责任人', dataIndex: 'owner', key: 'owner' },
            { title: '流程状态', dataIndex: 'flowstatus', key: 'flowstatus' },
            { title: '资产状态', dataIndex: 'assetstatus', key: 'assetstatus' },
            {
                title: '操作',
                key: 'operate',
                render: (text, record, index) => {
                    function handleEnter(index, e) {

                        // 回车13   向上38  向下40
                        (e.keyCode == 13 || e.keyCode == 40)
                            ? (++index)
                            : ((e.keyCode == 38) ? (--index) : (''))

                        $('.table-input-container').eq(index).find('input').focus();

                    }

                    return (
                        <div className="table-input-container">
                            <Input defaultValue={record.parameternumber} onKeyDown={handleEnter.bind(null, index)} />
                        </div>
                    )
                }
            }
        ]
        return columns
    }

    /**
     * 渲染
     *
     * */
    render() {
        const self = this
        // 表格头
        const columns = this.getTableCol()
        // 样式
        const containerStyle = {
            margin: '0 20px'
        }
        // 选择表格配置
        const rowSelection = {
            type: 'checkbox',
            onChange(selectedRowKeys, selectedRows) {
                const idArray = selectedRows.map((item) => (item.id))
                self.props.setIdArray(idArray)
            }
        }
        return (
            <div style={containerStyle}>
                <Table
                    rowClassName={(record, index) => 'assetTableListRowClassName'}
                    onRowClick={this.props.selectTableRow}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={this.props.dataSource}
                    pagination={false}
                    loading={this.props.isLoading}
                    />
            </div>
        )
    }
}


export default AssetTableList