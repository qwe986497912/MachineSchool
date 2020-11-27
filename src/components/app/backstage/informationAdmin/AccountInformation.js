import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop, Popconfirm } from 'antd';
import { originalUrl, account, } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import Edit from '../../../../statistics/edit.png';
import Delete from '../../../../statistics/delete.png';
import { changeOrder,changeType, typeChange } from '../../commonFunction.js';
import history from '../../../common/history.js';
import '../../style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const {Option} = Select;
const model = new Model();

class AccountInformation extends Component{
	constructor() {
	    super();
			this.state = {
				//头部筛选框 用户id  权限
				user_id: '',
				username: '',
				type: "",  //用户权限（1 普通用户 2 运维人员 3 admin)
				//table data：数据 columns 表头
				data: [],
				columns:[
					{title: '用户id',dataIndex: 'id',width: '20%',align:'center',},
					{title: '账户',dataIndex: 'username',width: '5%',align:'center',},
					{title: '密码',dataIndex: 'password',width: '8%',align:'center',},
					{title: '权限',dataIndex: 'type',width: '8%',align:'center',},
					{title: '联系方式',dataIndex: 'phone_number',width: '10%',align:'center',},
					{title: '邮箱',dataIndex: 'email',width: '12%',align:'center',},
					{title: '性别',dataIndex: 'sex',width: '6%',align:'center',},
					{title: '地址',dataIndex: 'address',width: '12%',align:'center',},
					{title: '备注',dataIndex: 'remark',width: '5%',align:'center',},
					{title: '操作',dataIndex: 'action', render: (text, record) => {
						return(
							<div>
								<span style={{cursor: 'pointer',marginRight: '10px'}} onClick={()=>{this.handlleEdit(record.id)}}>
									<img src={Edit}/>
								</span>&nbsp;&nbsp;&nbsp;&nbsp;
								<Popconfirm  title="确认删除？" onConfirm={()=>{this.handleDelete(record.id)}}>
									<img src={Delete} style={{cursor: 'pointer'}}/>
								</Popconfirm>
							</div>
						)
					}},
				],
				//弹框函数
				userId: '',   //不是筛选框的用户编号
				ModalForm: {
					username: '',
					password: '',
					type: '',
					phone_number: '',
					email: '',
					sex: '',
					address: '',
					remark: '',
				},
				Modal2Visible: false,
				Modal1Visible: false,
			}
	}
	render(){
		const { user_id, username, type, columns, data, ModalForm, Modal2Visible, Modal1Visible } = this.state;
		return(
			<div id="accountInformation">
				<div className="header">
					<div className="title">
						<h2>用户信息管理</h2>
					</div>
					<div className="filter">
						<span className="span">
							用户编号:
							<Input className="input" value={user_id} onChange={(ev)=>{this.user_id(ev)}}></Input>
						</span>
						<span className="span">
							账户:
							<Input className="input" value={username} onChange={(ev)=>{this.username(ev)}}></Input>
						</span>
						<span className="span">
							权限:
							<select className="select" value={type} onChange={(ev)=>{this.type(ev)}}>
								<option value=""></option>
								<option value="1">普通用户</option>
								<option value="2">运维人员</option>
								<option value="3">管理员</option>
							</select>
						</span>
						<div>
							<Button className="button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
							<Button className="button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
							<Button className="button" type="primary" onClick={()=>{this.addAccount()}}>添加用户</Button>
						</div>
					</div>
				</div>
				<div className="main">
					<Table className="antd-Table" columns={columns} dataSource={data} 
					pagination={{ pageSize: 8 }} scroll={{ y: '100%', x: 1500 }}/>
					{/* 回到顶部 */}
					<BackTop />
					<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
					<div className="account-modify">
						<Modal
							title="用户信息编辑"
							visible={Modal1Visible}
							onOk={this.handleModal1Ok}
							onCancel={this.handleModal1Cancel}
						>
							<table className="table">
								<thead></thead>
								<tbody>
									<tr>
										<td className="title" style={{marginRight:20}}>用户名:</td>
										<td><Input style={{width: '100%',height:'100%'}} value={ModalForm.username} onChange={(ev)=>{this.Modal1Change(ev,'username')}}/></td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>密码:</td>
										<td><Input style={{width: '100%',height: '100%'}} value={ModalForm.password} onChange={(ev)=>{this.Modal1Change(ev,'password')}}/></td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>权限:</td>
										<td>
											<select className="select" value={ModalForm.type} onChange={(ev)=>{this.Modal1Change(ev,'type')}}>
												<option value=""></option>
												<option value="1">普通用户</option>
												<option value="2">运维人员</option>
												<option value="3">管理员</option>
											</select>
										</td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>联系人电话:</td>
										<td><Input style={{width: '100%',height: '100%'}} value={ModalForm.phone_number} onChange={(ev)=>{this.Modal1Change(ev,'phone_number')}}/></td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>邮箱:</td>
										<td><Input style={{width: '100%',height: '100%'}} value={ModalForm.email} onChange={(ev)=>{this.Modal1Change(ev,'email')}}/></td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>性别:</td>
										<td>
											<select className="select" value={ModalForm.sex} onChange={(ev)=>{this.Modal1Change(ev,'sex')}}>
												<option value=""></option>
												<option value="0">女</option>
												<option value="1">男</option>
											</select>
										</td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>地址:</td>
										<td>
											<input id='tipinput1' type="text" className="input" value={ModalForm.address} onChange={(ev)=>{this.Modal1Change(ev,'address')}}/>
										</td>
									</tr>
								</tbody>
								<tfoot></tfoot>
							</table>
							<div id="container"></div> {/* 地图实例隐藏就好，用来做搜索提示的地图实例 */}
						</Modal>
					</div>
					<div className="account-add">
						<Modal
							title="添加账户"
							visible={Modal2Visible}
							onOk={this.handleModal2Ok}
							onCancel={this.handleModal2Cancel}
						>
							<table className="table">
								<thead></thead>
								<tbody>
									<tr>
										<td className="title" style={{marginRight:20}}>用户名:</td>
										<td><Input style={{width: '100%',height:'100%'}} value={ModalForm.username} onChange={(ev)=>{this.Modal2Change(ev,'username')}}/></td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>密码:</td>
										<td><Input style={{width: '100%',height: '100%'}} value={ModalForm.password} onChange={(ev)=>{this.Modal2Change(ev,'password')}}/></td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>权限:</td>
										<td>
											<select className="select" value={ModalForm.type} onChange={(ev)=>{this.Modal2Change(ev,'type')}}>
												<option value=""></option>
												<option value="1">普通用户</option>
												<option value="2">运维人员</option>
												<option value="3">管理员</option>
											</select>
										</td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>联系人电话:</td>
										<td><Input style={{width: '100%',height: '100%'}} value={ModalForm.phone_number} onChange={(ev)=>{this.Modal2Change(ev,'phone_number')}}/></td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>邮箱:</td>
										<td><Input style={{width: '100%',height: '100%'}} value={ModalForm.email} onChange={(ev)=>{this.Modal2Change(ev,'email')}}/></td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>性别:</td>
										<td>
											<select className="select" value={ModalForm.sex} onChange={(ev)=>{this.Modal2Change(ev,'sex')}}>
												<option value=""></option>
												<option value="0">女</option>
												<option value="1">男</option>
											</select>
										</td>
									</tr>
									<tr>
										<td className="title" style={{marginRight:20}}>地址:</td>
										<td>
											<input id='tipinput2' className="input" value={ModalForm.address} onChange={(ev)=>{this.Modal2Change(ev,'address')}}/>
										</td>
									</tr>
								</tbody>
								<tfoot></tfoot>
							</table>
							<div id="container"></div> {/* 地图实例隐藏就好，用来做搜索提示的地图实例 */}
						</Modal>
					</div>
				</div>
			</div>
		)
	}
	//挂载区
	componentDidMount(){
		this.init();
	}
	componentWillUnmount(){
		console.log('卸载');
	}
	
	//init 获取所有账户信息  
	init = ()=>{
		const me = this;
		let params = {user_id:'',type:'',username: ''};
		let url = originalUrl + account;
		model.fetch(params,url,'get',(res)=>{
			console.log('所有账户数据:',res.data);
			let data = res.data;
			changeType(data);
			me.setState({data: data});
		})
	}
	// 头部筛选区域
		//用户id筛选
	user_id = (ev)=>{
				console.log('用户id:',ev.target.value)
				this.setState({
				user_id: ev.target.value,
			})
		}
	 //账户
	username = (ev)=>{
		console.log('账户：',ev.target.value);
		this.setState({
			username: ev.target.value,
		})
	}
	 //权限 type
	 type = (ev)=>{
		 console.log('权限type：',ev.target.value);
		 this.setState({
			 type: ev.target.value,
		 })
	 }
	 
	search = ()=>{
		const me = this;
		let user_id = me.state.user_id;
		let username = me.state.username;
		let type = me.state.type;
		let url = originalUrl + account;
		let params = {
			type: type,
			user_id: user_id,
			username: username,
		}
		model.fetch(params,url,'get',(res)=>{
			console.log('筛选数据：',res.data);
			let data = res.data;
			changeType(data);
			me.setState({data: data})
		})
	}
	reset = ()=>{
		this.setState({
			type: '',
			user_id: '',
			username: '',
		})
		this.init();
	}

	//编辑账户信息
	handlleEdit = (id)=>{
		setTimeout(()=>{  //必须要用setTimeout把这个任务放到异步队列里，不然第一次获取不到！！
			//eslint-disable-next-line
			var map = new AMap.Map("container", {
					resizeEnable: true
			});
			map.plugin('AMap.Autocomplete', function() {
				//eslint-disable-next-line no-undef
				var auto = new AMap.Autocomplete({
				    input: "tipinput1"
				});
			})
		},)
		console.log('用户id:',id);
		let data = [...this.state.data];
		let filter = data.filter((item)=>{
			return item.id == id;
		})
		typeChange(filter);
		console.log('filter:',filter)
		this.setState({
			ModalForm: filter[0],
			Modal1Visible: true,
			userId: id,
		})
	}
	Modal1Change = (ev,key)=>{
		let form = {...this.state.ModalForm};
		for(let item in form){
			if(item === key){
				form[item] = ev.target.value;
				this.setState({ModalForm: form});
			}
		}
	}
	handleModal1Ok = ()=>{
		let user_id = this.state.userId;
		let form = {...this.state.ModalForm};
		let address = document.getElementById('tipinput1').value;
		form.address = address;
		const me = this;
		let params = form;
		let url = originalUrl + account + user_id + '/';
		model.fetch(params,url,'put',(res)=>{
			console.log('创建用户成功！');
			for(let item in form){
				form[item] = '';
			}
			me.setState({
				ModalForm: form,
				Modal1Visible: false,
			})
			me.init();
		})
	}
	handleModal1Cancel = ()=>{
		let form = {...this.state.ModalForm};
			for(let item in form){
				form.item = '';
			}
			this.setState({
				Modal1Visible: false,
				ModalForm: form,
			})
			this.init();
	}
	//删除账户信息
	handleDelete = (id)=>{
		let url = originalUrl + account + id + '/';
		let params = {};
		model.fetch(params,url,'delete',(res)=>{
			console.log(`${id}删除成功！`);
			this.init();
		})
	}
	//添加账户
	addAccount = ()=>{
		setTimeout(()=>{  //必须要用setTimeout把这个任务放到异步队列里，不然第一次获取不到！！
			//eslint-disable-next-line
			var map = new AMap.Map("container", {
					resizeEnable: true
			});
			map.plugin('AMap.Autocomplete', function() {
				//eslint-disable-next-line no-undef
				var auto = new AMap.Autocomplete({
				    input: "tipinput2"
				});
			})
		},)
		console.log('添加账户');
		this.setState({Modal2Visible: true})
	}
	Modal2Change = (ev,key)=>{
		let form = {...this.state.ModalForm};
		for(let item in form){
			if(item === key){
				form[item] = ev.target.value;
				this.setState({ModalForm: form});
			}
		}
	}
	handleModal2Ok = ()=>{
		let form = {...this.state.ModalForm};
		let address = document.getElementById('tipinput2').value;
		console.log('address:',address)
		form.address = address;
		const me = this;
		let params = form;
		let url = originalUrl + account;
		model.fetch(params,url,'post',(res)=>{
			console.log('创建用户成功！');
			for(let item in form){
				form[item] = '';
			}
			me.setState({
				ModalForm: form,
				Modal2Visible: false,
			})
			me.init();
		})
	}
	handleModal2Cancel = ()=>{
			let form = {...this.state.ModalForm};
			for(let item in form){
				form.item = '';
			}
			this.setState({
				Modal2Visible: false,
				ModalForm: form,
			})
			this.init();
		}
}
export default AccountInformation;