import React, { Component } from 'react'

import {
    InnerTable,
    InnerPagination
} from 'COMPONENT'

class ModalTable extends Component {
    render() {
        const {
            dataSource,
            handlePageChange
        } = this.props
        
        return (
            <section className="m-modal-table">
                <InnerTable
                    loading={dataSource.tableLoading}
                    columns={dataSource.tableColumns}
                    dataSource={dataSource.tableData}
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