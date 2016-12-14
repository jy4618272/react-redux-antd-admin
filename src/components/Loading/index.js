import React, { Component } from 'react'
import { Spin, Alert } from 'antd';

class Loading extends Component {
    render() {
        return (
            <Spin tip="努力加载中...">
                <Alert message="努力加载中"
                    description="欢迎进入智慧物流园区通"
                    type="info" />
            </Spin>
        );
    }
}

export default Loading;