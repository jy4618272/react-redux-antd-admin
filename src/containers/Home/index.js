import React, { Component, PropTypes } from 'react';
import { Table, Button, Input } from 'antd';

const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		width: '40%',
	},
	{
		title: 'Age',
		dataIndex: 'age',
		key: 'age',
		width: '30%',
		render: () => {
			return <Input value='3' />
		}
	},
	{
		title: 'Address',
		dataIndex: 'address',
		key: 'address',
		width: '30%',
	},
	{
		key: 'action',
		title: '操作',
		render: (record) => <Button onClick={() => { alert(JSON.stringify(record)) } }>按钮</Button>
	}
];

const data = [
	{
		key: 1,
		name: 'John Brown sr.',
		age: 60,
		address: 'New York No. 1 Lake Park',
		children: [
			{
				key: 11,
				name: 'John Brown',
				age: 42,
				address: 'New York No. 2 Lake Park',
			},
			{
				key: 12,
				name: 'John Brown jr.',
				age: 30,
				address: 'New York No. 3 Lake Park'
			},
			{
				key: 13,
				name: 'Jim Green sr.',
				age: 72,
				address: 'London No. 1 Lake Park'
			}
		],
	},
	{
		key: 2,
		name: 'Joe Black',
		age: 32,
		address: 'Sidney No. 1 Lake Park',
	}
]

// rowSelection objects indicates the need for row selection
const rowSelection = {
	onChange(selectedRowKeys, selectedRows) {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	},
	onSelect(record, selected, selectedRows) {
		console.log(record, selected, selectedRows);
	},
	onSelectAll(selected, selectedRows, changeRows) {
		console.log(selected, selectedRows, changeRows);
	},
};
export default class App extends Component {
	render() {
		return (
			<Table columns={columns} rowSelection={rowSelection} dataSource={data} />

		)
	}
}