/**
 * 操作按钮组
 *  1.this.props.selectedRow    被选中资产的全部信息，用于控制操作按钮组
 *      1.1  status  被选中行的资产状态{}，用于控制按钮的disabled
 *      1.2  id  点击按钮跳转时需要
 *      1.3  assetname  资产名称
 *      1.4  assettypename2  资产类型
 *  2.this.props.idArray   控制批量导出 
 *  3.this.props.total     控制导出本页
 *  
 *
 *   审批中   审批通过  审批退回
 *
 * */
import React, { Component } from 'react'
import { hashHistory } from 'react-router'

import {
    Button,
    Popconfirm,
    message,
    Row,
    Col
} from 'antd'
import { Icons } from 'COMPONENT'

class ButtonGroup extends Component {
    constructor() {
        super()
    }

    /**
     * 控制按钮的启用和禁用
     * status{assetstatus:"处理中",flowstatus:"**-待财务审核}
     *
     * */
    setButton() {
        return this.isDisabled()
    }

    /**
     * 判断按钮是否该被禁用
     * 根据按钮代号和status返回一个设置按钮是否禁用的对象
     *
     * 思路： 先禁用所有按钮，然后根据条件启用相关按钮
     * */
    isDisabled() {
        const {idArray, total} = this.props
        const {assetstatus, flowstatus} = this.props.selectedRow
        let isDisabledButton = {
            db: { disabled: 'disabled' }, // 调拨
            xz: { disabled: 'disabled' }, //  闲置
            bf: { disabled: 'disabled' }, // 报废
            cz: { disabled: 'disabled' }, //  处置
            zz: { disabled: 'disabled' }, //  终止
            xg: { disabled: 'disabled' }, //  修改
            zrp: { disabled: 'disabled' }, // 打印责任牌
            czd: { disabled: 'disabled' }, // 打印处置单

            xzzc: {},  //  新增资产，一直启用
            dcby: (total > 0) ? {} : { disabled: 'disabled' },   // 如果查询结果为0，则不启用
            pldc: (idArray.length > 0) ? {} : { disabled: 'disabled' }  // 如果没有选中复选框，则不启用
        }
        let allow = null
        if (assetstatus === '已归档') {
            allow = { db: {}, xz: {}, bf: {}, zrp: {} }
        } else if (assetstatus === '已闲置') {
            allow = { db: {}, bf: {} }
        } else if (assetstatus === '已报废') {
            allow = { cz: {}, zrp: {} }
        } else if (assetstatus === '已处置') {
            allow = { czd: {} }
        } else if (assetstatus === '处理中' && flowstatus.search('待提交') !== -1) {
            allow = { xg: {} }
        } else if (assetstatus === '处理中' && flowstatus.search('审批退回') !== -1) {
            //审批通过  此时资产状态已经不是处理中了
            //审批退回  此时可以终止／修改
            //审批中  不可以进行任何操作
            allow = { zz: {}, xg: {} }
        }

        return {...isDisabledButton, ...allow }
    }

    /**
     * 处理按钮的点击事件
     *
     * */
    handleClick(e) {
        const btnText = e.target.innerHTML
        /**
         * 不同的按钮点击触发的行为是不一样的
         *  其中一部分按钮点击触发跳转：通过this.getTargetLink获取对应的url，如果按钮触发的不是跳转，则返回false
         *  对于非跳转行为的按钮，根据需要继续处理继续处理 else if
         *  */
        let url = this.getTargetLink(btnText)
        if (!!url) {
            hashHistory.push(url)
        }

        /**
         * 终止按钮，触发弹窗行为，询问用于是否确认终止
         * 只有处理中－审核退回的状态的资产可以终止
         * 终止按钮的处理函数在this.breakAsset
         * 此注释只是事例
         */
    }

    /**
     * 根据被点击按钮的文本，返回需要跳转的链接
     * busi/busi_asset/operate  /:assetType/:id/:isModify/:operateType
     * busi/busi_asset/new  /:assetType/:id/:isModify
     * */
    getTargetLink(btnText) {
        let { assetid: id, assettypename2: assetType, flowstatus } = this.props.selectedRow

        // 把资产类型处理成数字，动产＝1  不动产＝2  易耗品＝3
        if (assetType == '动产') {
            assetType = 1
        } else if (assetType == '不动产') {
            assetType = 2
        } else if (assetType == '低值易耗品') {
            assetType = 3
        }
        // 调拨／闲置／报废／处置／调拨-待提交／闲置-待提交／报废-待提交／处置-待提交
        const operateUrl = `busi/busi_asset/operate/${assetType}/${id}`
        const operateUrlNew = `${operateUrl}/false`    // 第一次操作，非修改
        const operateUrlModify = `${operateUrl}/true`   // 修改待提交的

        // 新增资产／新增-待提交
        const addUrl = `busi/busi_asset/add`
        const addUrlNew = `${addUrl}/newAsset/-1/false`   //  第一次新增, 此时自定义一个临时id=-1，资产类型newAsset
        const addUrlModify = `${addUrl}/${assetType}/${id}/true`   // 修改待提交的

        if (this.isInclude(btnText, '调拨')) {
            return `${operateUrlNew}/db`
        } else if (this.isInclude(btnText, '闲置')) {
            return `${operateUrlNew}/xz`
        } else if (this.isInclude(btnText, '报废')) {
            return `${operateUrlNew}/bf`
        } else if (this.isInclude(btnText, '处置')) {
            return `${operateUrlNew}/cz`
        } else if (this.isInclude(btnText, '修改')) {
            /**
             * 修改跳转，需要根据资产的流程状态判断需要跳转到哪个页面
             * 新增-待提交  调拨-待提交  闲置-待提交   报废-待提交  处置-待提交
             * 
             * 根据 flowstatus 判断
             */
            console.log(flowstatus)
            if (this.isInclude(flowstatus, '新增-待提交')) {
                return `${addUrlModify}`
            } else if (this.isInclude(flowstatus, '调拨-待提交')) {
                return `${operateUrlModify}/db`
            } else if (this.isInclude(flowstatus, '闲置-待提交')) {
                return `${operateUrlModify}/xz`
            } else if (this.isInclude(flowstatus, '报废-待提交')) {
                return `${operateUrlModify}/bf`
            } else if (this.isInclude(flowstatus, '处置-待提交')) {
                return `${operateUrlModify}/cz`
            }

        } else if (this.isInclude(btnText, '终止')) {
            return false
        } else if (this.isInclude(btnText, '新增资产')) {
            return `${addUrlNew}`   // 新增资产的是没有id的，用－1标记一下
        } else if (this.isInclude(btnText, '测试审核')) {
            // 临时提供一个审核入口
            return `busi/busi_asset/check_asset/5`
        }
    }

    /**
     * 判断string中是否包含str，忽略空格
     * return boolean
     * */
    isInclude(string, str) {
        return (string.replace(' ', '').search(str) != -1)
    }
    /**
     * 终止资产
     * 
     */
    breakAsset() {
        message.success('此操作还没有联调...')
    }
    /**
     * 渲染
     *
     * */
    render() {
        let self = this
        const {db, xz, bf, cz, zz, xg, zrp, czd, xzzc, dcby, pldc} = this.setButton()
        // 按钮公共配置
        const buttonType = {
            type: 'default',
            htmlType: 'button',
            style: { margin: '0 5px 0 0' },
            onClick: self.handleClick.bind(self)
        }
        return (
            <Row className="button-group g-mb10 clearfix">
                <Col span={19}>
                    <Button {...buttonType} {...xzzc} ref="xzzc"><Icons type="add" />新增资产</Button>
                    <Button {...buttonType} {...db} ref="db">调拨</Button>
                    <Button {...buttonType} {...xz} ref="xz"><Icons type="lie" />闲置</Button>
                    <Button {...buttonType} {...bf} ref="bf"><Icons type="void" />报废</Button>
                    <Button {...buttonType} {...cz} ref="cz">处置</Button>
                    <Popconfirm
                        title={'是否确认终止资产：' + this.props.selectedRow.assetname + ' ?'}
                        okText="确认" cancelText="取消"
                        onConfirm={this.breakAsset.bind(this)}>
                        <Button {...buttonType} {...zz} ref="zz">终止</Button>
                    </Popconfirm>
                    <Button {...buttonType} {...xg} ref="xg"><Icons type="edit" />修改</Button>  &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button {...buttonType} {...zrp} ref="zrp"><Icons type="print-a" />打印责任牌</Button>
                    <Button {...buttonType} {...czd} ref="czd"><Icons type="print-a" />打印处置单</Button>
                </Col>
                <Col span={5} style={{ textAlign: 'right' }}>
                    <Button {...buttonType} {...dcby} ref="dcby">导出本页</Button>
                    <Button {...buttonType} {...pldc} ref="pldc">批量导出</Button>
                    {/* <Button {...buttonType} ref="dcby">测试审核</Button> */}
                </Col>
            </Row>
        )
    }
}

export default ButtonGroup