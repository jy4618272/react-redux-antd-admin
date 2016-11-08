import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
    InnerTable
} from 'COMPONENT'
import action from 'ACTION/busiFinance/show'

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch)
})

@connect(
    ({ busiFinance }) => ({ busiFinance }),
    mapDispatchToProps
)
class FinanceShow extends Component {
    constructor(props) {
        super(props)
        console.log('财务详情props', props)
    }
    componentDidMount() {
        const {
            action,
            params,
            location
        } = this.props

        const id = params.id
        const type = location.query.type
        console.log('参数：', id, type)

        action.fetchFinanceShow({
            type: type,
            businessnumber: id
        })
    }

    render() {
        const {
            location,
            busiFinance
        } = this.props
        const type = location.query.type
        if (type === '履约保证金') {
            const arr = []
            arr.push(busiFinance.show.data)
            
            return (
                <section className="padding">
                    <InnerTable
                        loading={busiFinance.show.loading}
                        columns={busiFinance.show.init.bond}
                        dataSource={arr}
                        isRowSelection={false}
                        bordered={true}
                        pagination={false} />
                </section>
            )
        } else {
            return (
                <div className="g-tac">接口返回数据有问题</div>
            )
        }
    }
}

FinanceShow.propTypes = {

}

export default FinanceShow