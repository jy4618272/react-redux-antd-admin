import React, { Component, PropTypes } from 'react';

/**
 * 表格操作按钮
 * {
 *     left:[],
 *     right:[]
 * }
 */
class InnerTableControl extends Component {
    isEmpty = (obj) => {
        for (let name in obj) {
            return false;
        }
        return true;
    }

    render() {

        // checkbox是否有=>勾选/只有一项/多项
        const hasSelected = this.state.selectedRowKeys.length > 0
        const oneSelected = this.state.selectedRowKeys.length == 1
        const multiSelected = this.state.selectedRowKeys.length > 1

        let tableControl = ''
        
        if (!this.isEmpty(schema)) {
            const buttonGroupLeft = schema.left.map((item) => {
                if (item.key === 'refund') {
                    let dis
                    if (!oneSelected) {
                        // dis = (oneSelected) ? false : true
                        // alert(dis)

                    }
                    return (
                        <Button type="ghost" disabled={dis} onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                    )
                }
                if (item.key === 'receive') {
                    return (
                        <Button type="ghost" disabled={!oneSelected} onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                    )
                }
                if (item.key.indexOf('add') > -1 || item.key.indexOf('default') > -1) {
                    return (
                        <Button type="ghost" onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                    )
                }
                return (
                    <Button type="ghost" disabled={!oneSelected} onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                )
            })
            const buttonGroupRight = schema.right.map((item) => {
                return (
                    <Button type="primary" onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                )
            })

            tableControl = <div className="m-table-effect">
                <div className="clearfix g-mb10">
                    <Row className="button-group">
                        <Col span={18}>
                            {buttonGroupLeft}
                        </Col>
                        <Col span={6} className="button-group g-tar">
                            {buttonGroupRight}
                        </Col>
                    </Row>
                </div>
            </div>
        }
        return (
            tableControl

        );
    }
}

InnerTableControl.propTypes = {

};

export default InnerTableControl;