import React, { Component } from 'react'

import {
    InnerTable,
    InnerPagination
} from 'COMPONENT'

class ModalTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
            selectedRows: []  // 当前有哪些行被选中, 保存完整数据
        }
    }

    /**
     * InnerTable组件的重render有两种可能:
     * 1. 上层组件调用的render方法, 这个时候会触发componentWillReceiveProps方法
     * 2. 自身状态变化引起的重新render
     * 注意区分
     *
     * 对于第一种情况, 要将组件的状态还原到初始状态
     *
     * @param nextProps
     */
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.loading === true) {
            this.setState({
                selectedRowKeys: [],
                selectedRows: []
            })
        }
    }

    render() {
        const {
            dataSource,
            handlePageChange,
            isRowSelection,
            parentHandleSelectChange
        } = this.props

        return (
            <section className="m-modal-table">
                <InnerTable
                    loading={dataSource.tableLoading}
                    columns={dataSource.tableColumns}
                    dataSource={dataSource.tableData}
                    parentHandleSelectChange={parentHandleSelectChange}
                    isRowSelection={isRowSelection}
                    bordered={true}
                    pagination={false} />
                <InnerPagination
                    total={dataSource.total}
                    pageSize={dataSource.pageSize}
                    skipCount={dataSource.skipCount}
                    parentHandlePageChange={handlePageChange} />
            </section>
        )
    }
}

export default ModalTable