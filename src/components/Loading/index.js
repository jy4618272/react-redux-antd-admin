import React, { Component } from 'react'
import { Spin, Alert } from 'antd';

class Loading extends Component {
    render() {
        return (
            <Spin tip="努力加载中...">
                <div className="padding">
                    <Alert message="页面努力加载中"
                        description="欢迎使用传化园区通服务"
                        type="info"
                        />
                </div>
            </Spin>
        );
    }
}

export default Loading;