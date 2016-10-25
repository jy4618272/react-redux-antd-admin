import React, { Component } from 'react'

import {
    InnerTable,
    InnerPagination
} from 'COMPONENT'

class ModalTable extends Component {
    handleSelectChange = (data) => {
        console.log('8888', data)
        this.props.parentHandleSelectChange(data)
    }

    render() {
        const {
            dataSource,
            handlePageChange,
            parentHandleSelectChange
        } = this.props

        return (
            <section className="m-modal-table">
                <InnerTable
                    loading={dataSource.tableLoading}
                    columns={dataSource.tableColumns}
                    dataSource={dataSource.tableData}
                    parentHandleSelectChange={this.handleSelectChange}
                    isRowSelection={true}
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