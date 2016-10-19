import React, { Component, PropTypes } from 'react'

import {
    Tabs
} from 'antd'
const TabPane = Tabs.TabPane

import InnerForm from 'COMPONENT/DBTable/InnerForm'
import InnerTable from 'COMPONENT/DBTable/InnerTable'
import InnerPagination from 'COMPONENT/DBTable/InnerPagination'


class Manage extends Component {

    render() {
        const {querySchema} = this.props
        return (
            <div>
                <Tabs defaultActiveKey="contract">
                    <TabPane tab="合同" key="contract">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={querySchema['contract']}
                            showSearch={true} />
                       
                    </TabPane>
                    <TabPane tab="履约保证金" key="bond">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={querySchema['bond']}
                            showSearch={true} />
                    </TabPane>
                    <TabPane tab="临时摊位交款" key="fht">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={querySchema['notContract']}
                            showSearch={true} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Manage