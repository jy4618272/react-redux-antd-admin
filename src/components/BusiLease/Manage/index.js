import React, {Component, PropTypes} from 'react'

import {
    Tabs
} from 'antd'
const TabPane = Tabs.TabPane

class Manage extends Component {
    render () {
        return (
            <div>
                <Tabs defaultActiveKey="ht">
                    <TabPane tab="合同" key="ht">
                        合同
                    </TabPane>
                    <TabPane tab="保证金" key="bzj">
                        保证金
                    </TabPane>
                    <TabPane tab="非合同" key="fht">
                        非合同
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Manage