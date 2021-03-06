import React from 'react';
import { Pagination, Select } from 'antd';

/**
 * 内部分页器组件
 */
class InnerPagination extends React.Component {
    render() {
        const {total, pageSize, skipCount, parentHandlePageChange} = this.props

        if (total > pageSize) {
            return (
                <div className="clearfix g-mt15 m-pagination">
                    <Pagination
                        className="g-fr"
                        showQuickJumper
                        selectComponentClass={Select}
                        total={total}
                        showTotal={(total) => `每页${pageSize}条, 共 ${total || 0} 条`}
                        pageSize={pageSize}
                        defaultCurrent={1}
                        current={skipCount}
                        onChange={parentHandlePageChange} />
                </div>
            )
        } else {
            return (
                <div />
            )
        }
    }
}

export default InnerPagination;
