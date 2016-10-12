import React, {Component, PropTypes} from 'react'

import {
    Table,
    Button,
    Icon
} from 'antd'

import InnerForm from 'COMPONENT/DBTable/InnerForm'

const tableColumns = [
    {
        title: "序号",
        dataIndex: "serial",
        key: "serial"
    },
    {
        title: "房间物品",
        dataIndex: "goods",
        key: "goods"
    },
    {
        title: "物品规格",
        dataIndex: "size",
        key: "size"
    },
    {
        title: "数量",
        dataIndex: "num",
        key: "num"
    },
    {
        title: "价格",
        dataIndex: "price",
        key: "price"
    },
    {
        title: "备注",
        dataIndex: "memo",
        key: "memo"
    },
    {
        title: '',
        key: "add",
        render: () => <a href="javascript:void(0)" onClick={() => {alert(3)}}><Icon type="delete" /> 删除</a>,
    }
]


const tableSource = [];
for (let i = 0; i < 100; i++) {
    tableSource.push({
        key: i,
        serial: i,
        goods: `房间物品${i}`,
        size: `物品规格${i}`,
        num: `数量${i}`,
        money: `money${i}`,
        price: `price${i}`,
        memo: `memo${i}`
    });
}

class LeaseRoomAdd extends Component {
    constructor(props) {
        super(props)
        this.initFetchSchema(props)
    }

    /**
     * 尝试获取某个表的querySchema和dataSchema
     * 无论是从远端获取还是从本地配置读取, 这个方法必须是同步的
     *
     * @param dbName
     * @param tableName
     */
    initFetchSchema(props) {
        const routes = props.routes
        const tableName = routes.pop().tableName // lease
        if (tableName) {
            console.info('init component Finance with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName

        try {
            this.roomAddSchema = require(`SCHEMA/${tableName}/${tableName}.roomAddSchema.js`)
            console.log(this.roomAddSchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的roomAddSchema出错, 请检查配置`
            return false
        }

        this.inited = true
    }

    render() {
        return (
            <section className="m-config m-config-room">
                <InnerForm
                    formStyle="padding m-advance-fill"
                    schema={this.roomAddSchema.form}
                    />
                <section className="padding m-table-position">
                    <Button className="button-add">添加</Button>
                    <Table
                        className="m-table"
                        bordered={true}
                        pagination={false}
                        columns={tableColumns}
                        dataSource={tableSource} />
                </section>
                <div className="g-tac button-group g-mt50">
                    <Button type="primary" size="large">保存</Button>
                    <Button type="ghost" size="large">关闭</Button>
                </div>
            </section>
        );
    }
}
export default LeaseRoomAdd;