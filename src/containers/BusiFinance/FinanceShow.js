import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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

        if (type === '租赁合同') {
            action.fetchFinanceShow({
                type: type,
                businessnumber: id
            })
        } else if (type === '临时摊位') {

        } else if (type === '履约保证金') {

        }
    }

    render() {
        return (
            <div>
                333ddd
            </div>
        )
    }
}

FinanceShow.propTypes = {

}

export default FinanceShow