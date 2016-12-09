import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Form,
    Row,
    Col,
    notification
} from 'antd'
import {
    Loading,
    FormLayout
} from 'COMPONENT'

import action from 'ACTION/configLease'
import './dictionary.less'

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch)
})

@connect(
    ({ configLease }) => ({ configLease }),
    mapDispatchToProps
)
class Dictionary extends Component {
    constructor(props) {
        super(props)
        console.log('查询字典', props)
    }

    handleSearchDictionary = () => {
        const {
            form,
            action
        } = this.props
        const val = Object.assign({}, form.getFieldsValue())

        action.fetchDictionary(val)
    }

    componentDidMount() {
        this.props.action.resetDictionary()
    }

    render() {
        const {
            contractTplDictionary
        } = this.props.configLease

        let count = 0
        let dictionaryContent = contractTplDictionary.data.map(item => {
            count++
            return (
                <Col span={8}>
                    {item}
                </Col>
            )
        })

        return (
            <section className="padding g-mt20">
                <Form>
                    <FormLayout
                        schema={contractTplDictionary.querySchema}
                        form={this.props.form}
                        buttonSchema={contractTplDictionary.queryButtons}
                        parentHandleClick={this.handleSearchDictionary} />
                    {count > 0 ? <div className="list-dictionary-count">一共查询到&nbsp;&nbsp;<span className="s-primary">{count}</span>&nbsp;&nbsp;条</div> : ''}
                    <Row gutter={16} className="list-dictionary">
                        {dictionaryContent}
                    </Row>
                </Form>
            </section>
        )
    }
}

Dictionary = Form.create()(Dictionary)

export default Dictionary