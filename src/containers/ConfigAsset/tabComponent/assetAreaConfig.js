/**
 * 资产区域配置
 *  最初只有一条rank == 2的二级资产区域，需要通过这条数据获取rank == 1的信息，rank == 2只有一条
 * 
 */

import React, { Component } from 'react'

import {
    Tree,
    Input,
    Button,
    Modal,
    notification
} from 'antd'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

const TreeNode = Tree.TreeNode
const confirm = Modal.confirm

class AssetAreaConfig extends Component {
    constructor() {
        super()
        this.state = {
            treeList: [],   // 树的所有数据数组，元素是object
            siteName: '',   // 一级节点名，rank = 1
            selectedNode: null,    // 被选中节点相关数据 {rank, assetareaname, assetareaid, memo}
            visible: false,     // 控制新增／修改modal的显示和隐藏
            title: '',         // 新增／修改modal的title
            memo: '',           // 新增／修改最新的备注
            operateType: '',      // 用于标记当前操作是"新增"还是"修改"
            assetareaname: '',    // 新增／修改最新的资源区域名字 
            isOperate: {          // 根据所选节点的类型／位置等判断三个按钮是否可点击
                isAdd: { disabled: 'disabled' },
                isRemove: { disabled: 'disabled' },
                isModify: { disabled: 'disabled' }
            }
        }
    }

    /**
     * 查询所有数据 
     * http://myportaltest.tf56.com:8080/tfPassParkAdmin/assetareacs/selectAssetAreaBySite
     * */
    fetchData() {
        xhr('post', paths.leasePath + '/assetareacs/selectAssetAreaBySite', {}, (res) => {
            /**
             * res.result  success/error
             * res.data.data  真实数据，需要防止""
             *  */
            if (res.result == 'success') {
                // 请求成功后，需要判断是否有数据。一定会有rank == 2的几条初始化数据，如果没有则说明没有初始化配置
                if (res.data.count > 0) {
                    // 数据数组
                    const treeData = res.data.data
                    // 获取顶级节点的名字
                    const siteName = treeData.filter(v => v.rank == 2)[0].parentareaname
                    this.setState({
                        treeList: treeData,
                        siteName: siteName
                    })
                } else {  // 没有数据时
                    notification.warn({
                        message: '暂无初始化配置 请联系管理员!'
                    })
                }
            } else if (res.result == 'error') {
                /**
                 * 如果报错，弹出错误提示 res.msg
                 *  */
                errHandler(res.msg)
            }


        })
    }

    /**
     * 增加一项
     * ps: 需要父级的rank
     * http://myportaltest.tf56.com:8080/tfPassParkAdmin/assetareacs/insertAssetArea 
     * assetareaname
     * */
    addAssetArea() {
        // 最新的需要提交的数据
        const { assetareaname, memo } = this.state
        // 被选中节点的数据
        const {rank, assetareaname: parentareaname} = this.state.selectedNode
        xhr('post', paths.leasePath + '/assetareacs/insertAssetArea ', {
            rank: rank,
            parentareaname: parentareaname,
            assetareaname: assetareaname,
            memo: memo
        }, (res) => {
            if (res.result == 'success') {
                this.fetchData()
                notification.success({
                    message: '新增成功!'
                })
            } else {
                notification.error({
                    message: res.msg
                })
            }
        })
    }

    /**
     * 删除一项
     *
     * */
    removeAssetArea() {
        const {assetareaid} = this.state.selectedNode
        xhr('post', paths.leasePath + '/assetareacs/updateAssetAreaStatus', { assetareaid: assetareaid }, (res) => {
            if (res.result == 'success') {
                notification.success({
                    message: '删除成功',
                    description: this.state.selectedNode.assetareaname + ' 已删除！'
                })
                // 删除了一个节点时，this.state.selectedNode需要设置为null
                this.handleSelect([])
                // 删除成功后更新列表
                this.fetchData()
            } else if (res.result == 'error') {
                // 删除失败，弹窗提示原因
                notification.error({
                    message: '删除失败',
                    description: res.msg
                })
            }
        })


    }
    /**
     * 点击删除按钮出触发
     *  */
    handleRemoveBtn() {
        const self = this
        const {rank, assetareaname, assetareaid, memo} = this.state.selectedNode
        confirm({
            title: '删除',
            content: '确认删除' + assetareaname + '?',
            onOk() {
                self.removeAssetArea()
            },
            onCancel() {

            }
        })
    }

    /**
     * 修改数据
     * http://myportaltest.tf56.com:8080/tfPassParkAdmin/assetareacs/updateAssetArea
     * assetareaid  被修改资源的id
     * assetareaname 新的资源名
     * memo  新的备注
     * 
     * 修改成功需要返回修改成功后的数据????还是本地直接修改 this.state.selectedNode
     */
    modifyAssetArea() {
        // 最新的需要提交的数据
        const { assetareaname, memo } = this.state
        // 被选中节点的数据
        const {rank, assetareaid, assetareaname: parentareaname} = this.state.selectedNode

        xhr('post', paths.leasePath + '/assetareacs/updateAssetArea', { assetareaid, assetareaname, memo }, (res) => {
            if (res.result == 'success') {
                notification.success({
                    message: '修改成功!'
                })
                // 是否需要更新this.state.selectedNode

                this.fetchData()
                // 修改一个节点时，this.state.selectedNode需要设置为null
                this.handleSelect([])
            } else if (res.result == 'error') {
                notification.error({
                    message: res.msg
                })
            }
        })
    }
    /** 
     * 点击修改触发
     * 
    */
    handleModifyBtn(operateType) {
        const self = this
        let {rank, assetareaname, assetareaid, memo} = this.state.selectedNode
        console.log(memo)
        this.setState({ visible: true })
        if (operateType == 'modify') {
            this.setState({
                title: '修改资产区域: ' + assetareaname,
                memo: (memo != 'undefined' ? memo : ''),
                assetareaname: assetareaname,
                operateType: 'modify'
            })
        } else if (operateType == 'add') {
            this.setState({
                title: '资产区域"' + assetareaname + '"下新增',
                memo: '',
                assetareaname: '',
                operateType: 'add'
            })
        }
    }
    /**
     * componentDidMount
     * */
    componentDidMount() {
        this.fetchData()
    }

    /**
     * 展开树的一级结构
     *
     * */
    getTreeNode(treeData) {
        let nodeArr = treeData.map((v, i, arr) => {
            if (v.rank == 2) {
                return (
                    <TreeNode title={v.assetareaname} key={v.rank + '|' + v.assetareaname + '|' + v.assetareaid + '|' + v.memo}>
                        {this.getTreeNodeByParent(treeData, v)}
                    </TreeNode>
                )
            }
        })
        return nodeArr.filter(v => v)
    }

    /**
     * 递归，将数组转成树结构
     *
     * */
    getTreeNodeByParent(treeData, parent) {
        let children = treeData.filter((v, i, arr) => {
            return parent.assetareaname == v.parentareaname
        })
        // 如果children>0说明有子节点,需要继续处理
        if (children.length > 0) {
            let nodeArr = children.map((v, i, arr) => {
                return (
                    <TreeNode title={v.assetareaname} key={v.rank + '|' + v.assetareaname + '|' + v.assetareaid + '|' + v.memo}>
                        {this.getTreeNodeByParent(treeData, v)}
                    </TreeNode>
                )
            })
            return nodeArr
        }
    }

    /**
     * 点击节点时更新this.state.selected, 用于增删改查当参数使用
     * info  []
     * */
    handleSelect(info) {
        console.log(info)
        // info是一个数组，数组的元素是被选中节点的key，当取消选中时，info===[] 此时需要让info[0] = ''
        info = info[0] ? info[0] : ''
        if (info.length > 0) {
            const [rank, assetareaname, assetareaid, memo] = info.split('|')
            this.state.selectedNode = { rank, assetareaname, assetareaid, memo } // 这个state不影响UI
        } else {
            this.state.selectedNode = null
        }
        // 更新按钮状态
        this.isDisabledButton()
    }
    /**
     * 判断被选中节点有哪些可用的按钮 this.setState.selectedNode = { rank, assetareaname, assetareaid, memo }
     * 不能新增的节点  rank == 1 || rank == 5 
     * 不能修改  rank == 1
     * 不能删除  有子节点
     *  */
    isDisabledButton() {
        let isOperate = {}

        if (this.state.selectedNode == null) {
            this.setState({
                isOperate: {
                    isAdd: { disabled: 'disabled' },
                    isRemove: { disabled: 'disabled' },
                    isModify: { disabled: 'disabled' }
                }
            })
            return false
        }

        const { rank, assetareaname, assetareaid, memo } = this.state.selectedNode
        // 是否可以新增
        isOperate.isAdd = (rank == 1 || rank == 5) ? { disabled: 'disabled' } : {}
        // 是否可以修改
        isOperate.isModify = (rank == 1) ? { disabled: 'disabled' } : {}
        // 是否可以删除
        isOperate.isRemove = (this.getChildrenNode(assetareaname).length > 0 || rank == 1) ? { disabled: 'disabled' } : {}
        this.setState({
            isOperate
        })
    }
    /**
     * 处理输入框的change事件
     * 
     */
    inputChange(inputName, e) {
        const value = e.target.value
        this.setState({
            [inputName]: value
        })
    }
    /**
     * 根据assetareaname获取子节点数组
     * 子节点中的parentareaname === 父节点的assetareaname
     * 
     */
    getChildrenNode(name) {
        return this.state.treeList.filter((v) => v.parentareaname == name)
    }
    onCancel() {
        this.setState({
            visible: false
        })
    }
    onOk() {
        // 最新的需要提交的数据
        const { operateType, assetareaname, memo } = this.state
        // 当前选中的节点
        const { rank, assetareaid } = this.state.selectedNode

        if (operateType == 'add') {
            this.addAssetArea()
        } else if (operateType == 'modify') {
            this.modifyAssetArea()
        }
        this.onCancel()
    }
    /**
     * 渲染
     * */
    render() {
        const {
            modalConfig,
            isOperate,
            treeList,
            siteName
        } = this.state
        // 当选中一个节点时，需要控制按钮的显示
        const {isAdd, isRemove, isModify} = isOperate
        return (
            <div>
                <div>
                    <Button {...isAdd} onClick={this.handleModifyBtn.bind(this, 'add')}>增加</Button>  &nbsp;
                    <Button {...isRemove} onClick={this.handleRemoveBtn.bind(this)}>删除</Button>  &nbsp;
                    <Button {...isModify} onClick={this.handleModifyBtn.bind(this, 'modify')}>修改</Button>
                </div>
                <Tree
                    onSelect={this.handleSelect.bind(this)}
                    >
                    <TreeNode title={siteName} key={1}>
                        {this.getTreeNode(treeList)}
                    </TreeNode>
                </Tree>

                <Modal
                    visible={this.state.visible}
                    title={this.state.title}
                    okText="确认"
                    cancelText="取消"
                    onCancel={this.onCancel.bind(this)}
                    onOk={this.onOk.bind(this)}>
                    <label>
                        资产区域名:
                        <Input
                            onChange={this.inputChange.bind(this, 'assetareaname')}
                            type="text" value={this.state.assetareaname}
                            style={{ marginTop: '3px' }} />
                    </label>
                    <br /><br />
                    <label>
                        备注:
                        <Input
                            onChange={this.inputChange.bind(this, 'memo')}
                            type="textarea" value={this.state.memo}
                            style={{ marginTop: '3px' }} />
                    </label>
                </Modal>
            </div>
        )
    }
}

export default AssetAreaConfig