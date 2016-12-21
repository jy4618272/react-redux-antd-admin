// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
	notConfirmed: [
		{
			key: 'type',  // 传递给后端的字段名
			title: '业务类型',  // 前端显示的名称

			// 数据类型, 前端会根据数据类型展示不同的输入框
			// 目前可用的dataType: int/float/varchar/datetime
			dataType: 'varchar',

			// 显示类型, 一些可枚举的字段, 比如type, 可以被显示为单选框或下拉框
			// 默认显示类型是normal, 就是一个普通的输入框, 这时可以省略showType字段
			// 目前可用的showType: normal/select/radio/between
			// select和radio只能用于int和varchar
			// between只能用于int/float/datetime, 会显示2个输入框, 用于范围查询
			showType: 'select',
			options: [
				{ key: '', value: '不选' },
				{ key: '租赁合同', value: '租赁合同' },
				{ key: '履约保证金', value: '履约保证金' },
				{ key: '临时摊位', value: '临时摊位' },
				{ key: '水电', value: '水电' },
				{ key: '停车', value: '停车' },
				{ key: '资产', value: '资产' },
				{ key: '一卡通办卡', value: '一卡通办卡' },
				{ key: '一卡通充值', value: '一卡通充值' }
			]
		},
		{
			key: 'name',
			title: '关键字',
			dataType: 'varchar',
			placeholder: '请输入客户名称'
		}
	],
	confirmed: [
		{
			key: 'type',  // 传递给后端的字段名
			title: '业务类型',  // 前端显示的名称
			dataType: 'varchar',
			showType: 'select',
			options: [
				{ key: '', value: '不选' },
				{ key: '租赁合同', value: '租赁合同' },
				{ key: '履约保证金', value: '履约保证金' },
				{ key: '临时摊位', value: '临时摊位' },
				{ key: '水电', value: '水电' },
				{ key: '停车', value: '停车' },
				{ key: '资产', value: '资产' },
				{ key: '一卡通办卡', value: '一卡通办卡' },
				{ key: '一卡通充值', value: '一卡通充值' }
			]
		},
		{
			key: 'name',
			title: '关键字',
			dataType: 'varchar',
			placeholder: '请输入客户名称'
		}
	], 
	payment: [
		{
			key: 'organization',
			title: '客户名称',
			dataType: 'varchar',
			placeholder: '请输入客户名称'
		},
		{
			key: 'room',
			title: '房间号',
			dataType: 'varchar',
			placeholder: '请输入房间号'
		},
		{
			key: 'metertype',  // 传递给后端的字段名
			title: '类型',  // 前端显示的名称
			dataType: 'varchar',
			showType: 'select',
			options: [
				{ key: '', value: '全部' },
				{ key: '水', value: '水' },
				{ key: '电', value: '电' }
			]
		},
	]
}
