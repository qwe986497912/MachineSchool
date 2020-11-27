import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, BackTop } from 'antd';
import { Model } from '../../../../dataModule/testBone.js';
import { originalUrl, userForm, } from '../../../../dataModule/UrlList';
import history from '../../../common/history.js';
import './style.less';

const EditableContext = React.createContext();
const model = new Model();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
			id:'',
			data: [],
			editingKey: '' ,
		};
    this.columns = [
      {
        title: '账户',
        dataIndex: 'username',
        width: '10%',
        editable: true,
				align:'center',
      },
      {
        title: '密码',
        dataIndex: 'password',
        width: '10%',
        editable: true,
				align:'center',
      },
      {
        title: '权限',
        dataIndex: 'type',
        width: '10%',
        editable: true,
				align:'center',
      },
			{
			  title: '联系方式',
			  dataIndex: 'phone_number',
			  width: '10%',
			  editable: true,
				align:'center',
			},
			{
				title: '邮箱',
				dataIndex: 'email',
				width: '10%',
				editable: true,
				align:'center',
			},
			{
				title: '性别',
				dataIndex: 'sex',
				width: '10%',
				editable: true,
				align:'center',
			},
			{
				title: '地址',
				dataIndex: 'address',
				width: '10%',
				editable: true,
				align:'center',
			},
			{
				title: '备注',
				dataIndex: 'remark',
				width: '10%',
				editable: true,
				align:'center',
			},
      {
        title: '操作',
        dataIndex: 'operation',
				align:'center',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    style={{ marginRight: 8 }} onClick={() => this.save(form, record.id)}
                  >
                    <Button type="primary" className="antd-Button-flexSize">保存</Button>
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="确认取消?" onConfirm={() => this.cancel(record.client_id)}>
                <Button type="primary" className="antd-Button-flexSize">取消</Button>
              </Popconfirm>
            </span>
          ) : (
						<span>
							<a disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
							  <Button type="primary" className="antd-Button-flexSize">编辑</Button>
							</a>&nbsp;&nbsp;&nbsp;&nbsp;
							<Popconfirm title="确认删除?" onConfirm={() => this.delete(record.id)}>
							  <Button type="primary" className="antd-Button-flexSize">删除</Button>
							</Popconfirm>
						</span>
            
          );
        },
      },
    ];
  }
	componentDidMount(){
		this.init();
	}
	// init 将用户信息渲染在界面上
	init = ()=>{
		const me = this;
		let params = {};
		let url = originalUrl+userForm;
		model.fetch(params,url,'get',function(res){
			console.log('接收用户信息表：',res.data);
		let data = res.data;
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i].id;
		}
			me.setState({data: data,});
		})
	}
	//增加客户
	handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: Math.random(),
      username: null,
      password: null,
      type: null,
			phone_number: null,
			email: null,
			sex: null,
			address:null,
			remark:null,
    };
    this.setState({
      data: [...this.state.data, newData],
    });
		//新增账户信息
		const me = this;
		let params = {...newData,};
		let url = originalUrl+userForm;
		model.fetch(params,url,'post',function(res){
			console.log('发送编辑账户数据：',res.data);
			me.init();
		})
  };
  isEditing = record => record.id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };
  save(form, id) {
		console.log('id:',id)
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
				console.log('newdata:',newData);
				//将编辑的账号信息发送到账号信息表
				const me = this;
				let params = newData[index];
				let url = originalUrl + userForm + id + '/';
				model.fetch(params,url,'put',function(res){
					console.log('发送编辑账号数据：',res.data);
				})
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
		
  }

  edit(id) {
		console.log('id:',id);
    this.setState({ editingKey: id });
  }
	delete = (id)=>{
		console.log('delete--id:',id);
		//将删除的数据的id发送到联系人表
		const me = this;
		let params = {};
		let url = originalUrl + userForm + id + '/';
		model.fetch(params,url,'delete',function(res){
			console.log('删除成功');
			me.init();
		})
	
	}
  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
			<Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 ,}}>
			          添加新账户
			</Button>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
					scroll={{ y: '100%', x: 1500 }}
        />
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
      </EditableContext.Provider>
    );
  }
}

const AccountModal = Form.create()(EditableTable);
export default AccountModal;