import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select,BackTop } from 'antd';
import { originalUrl,machineManage, } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import Edit from '../../../../statistics/edit.png';
import { changeMachine, machineChange } from '../../commonFunction.js';
import '../../style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();


class RobotManage extends Component{
	constructor(props) {
	    super(props);
			console.log('this.props:',this.props)
			this.state = {
				//搜索 机器人编号 id state1 state2
				id: '',          //机器人id
				robot_num: '',    //机器人编号
				state1: '',             //机器人状态
				state2: '',             //运行状态
				//table 
				data: [],
				columns : [
				  { title: '名称',key:'name', dataIndex: 'name', width: '15%',align:'center' },
				  { title: '编号',key:'robot_num', dataIndex: 'robot_num', width: '15%',align:'center' },
				  { title: '机器人状态',key:'state1', dataIndex: 'state1', width: '10%',align:'center' },
					{ title: '运行状态', key:'state2', dataIndex: 'state2', width: '10%', align:'center'},
					{ title: '上线日期', key:'create_time', dataIndex: 'create_time', width: '20%',align:'center' },
					{ title: '备注', key:'description', dataIndex: 'description', width: '15%',align:'center' },
					{ title: '操作', key: 'action', render: (text,record) => {
							return (
								<span style={{cursor: 'pointer'}} onClick={()=>{this.Modal1Visible(record.id)}}>
									<img src={Edit}/>
								</span>
							)
						} 
					},
				],
				//弹框函数
				ModalForm: {
					name: '',
					robot_num: '',
					create_time: [],
					state1: '',             //机器人状态
					state2: '',             //运行状态
					description: '',
				},
				Modal2Visible: false,
				Modal1Visible: false,
			}
	}
	render(){
		const { robot_num ,state1,state2, ModalForm,Modal1Visible,Modal2Visible} = this.state
		return(
		<div id="robotManage">
			<div className="header">
				<div className="title">
					<h2>机器人管理</h2>
				</div>
				<div className="filter">
					<span className="span">
						机器人编号:
						<Input className='input' value={robot_num} onChange={(ev)=>{this.robot_num(ev)}}/>
					</span>
					<span className="span">
						机器人状态:
						<select className="select" value={state1} onChange={(ev)=>{this.handleState1(ev)}}>
							<option key='' value=""></option>
							<option key='0' value="0">空闲</option>
							<option key='1' value="1">使用中</option>
						</select>
					</span>
					<span className="span">
						机器人运行状态:
						<select className="select" value={state2} onChange={(ev)=>{this.handleState2(ev)}}>
							<option key='' value=""></option>
							<option key='0' value="0">正常</option>
							<option key='1' value="1">维护中</option>
							<option key='2' value="2">损坏</option>
							<option key='3' value="3">报废</option>
						</select>
					</span>
					<div className="buttonArea">
						<Button className="button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
						<Button className="button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
						<Button className="button" type="primary" onClick={()=>{this.Modal2Visible()}}>新增设备</Button>
					</div>
				</div>
			</div>
			<div className="main">
				<Table className="antd-Table" columns={this.state.columns} dataSource={this.state.data} 
				pagination={{ pageSize: 8 }} scroll={{ y: '100%',x: 1200 }}/>
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
			</div>
			<div className="robot-modify">
				<Modal
					title="机器人信息编辑"
					visible={Modal1Visible}
					onOk={this.handleModal1Ok}
					onCancel={this.handleModal1Cancel}
				>
					<table className="table">
						<thead></thead>
						<tbody>
							<tr>
								<td className="title" style={{marginRight:20}}>机器人名称:</td>
								<td><Input style={{width: '100%',height:'100%'}} value={ModalForm.name} onChange={(ev)=>{this.Modal1Change(ev,'name')}}/></td>
							</tr>
							<tr>
								<td>机器人编号:</td>
								<td><Input style={{width: '100%',height: '100%'}} value={ModalForm.robot_num} onChange={(ev)=>{this.Modal1Change(ev,'robot_num')}}/></td>
							</tr>
							<tr>
								<td>机器人运行状态:</td>
								<td>
									<select className="select" style={{width: '100%',height: '100%'}} value={ModalForm.state2} onChange={(ev)=>{this.Modal1Change(ev,'state2')}}>
										<option key='' value=""></option>
										<option key='0' value="0">正常</option>
										<option key='1' value="1">维护中</option>
										<option key='2' value="2">损坏</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>机器人状态:</td>
								<td>
									<select className="select" style={{width: '100%',height: '100%'}} value={ModalForm.state1} onChange={(ev)=>{this.Modal1Change(ev,'state1')}}>
										<option key='' value=""></option>
										<option key='0' value="0">空闲</option>
										<option key='1' value="1">使用中</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>上线日期:</td>
								<td>
									<DatePicker value={ModalForm.create_time} onChange={this.datePicker} onOk={this.onOk}  showTime format="YYYY-MM-DD HH:mm:ss"/><br/>
								</td>
							</tr>
							<tr>
								<td rowSpan="2">备注:</td>
								<td rowSpan="2">
									<Input style={{width: '100%',height:'100%'}} value={ModalForm.description} onChange={(ev)=>{this.Modal1Change(ev,'description')}}/>
								</td>
							</tr>
						</tbody>
						<tfoot></tfoot>
					</table>
				</Modal>
			</div>
			<div className="robot-add">
				<Modal
					title="机器人信息增加"
					visible={Modal2Visible}
					onOk={this.handleModal2Ok}
					onCancel={this.handleModal2Cancel}
				>
					<table className="table">
						<thead></thead>
						<tbody>
							<tr>
								<td>机器人名称:</td>
								<td><Input style={{width: '100%',height:'100%'}} value={ModalForm.name} onChange={(ev)=>{this.Modal2Change(ev,'name')}}/></td>
							</tr>
							<tr>
								<td>机器人编号:</td>
								<td><Input style={{width: '100%',height:'100%'}} value={ModalForm.robot_num} onChange={(ev)=>{this.Modal2Change(ev,'robot_num')}}/></td>
							</tr>
							<tr>
								<td rowSpan="2">备注:</td>
								<td rowSpan="2" className="description">
									<Input style={{width: '100%',height:'100%'}} value={ModalForm.description} onChange={(ev)=>{this.Modal2Change(ev,'description')}}/>
								</td>
							</tr>
						</tbody>
						<tfoot></tfoot>
					</table>
				</Modal>
			</div>
		</div>
		)
	}
	componentDidMount(){
		this.init()
	}
	// 函数区
	init = ()=>{
		const me = this;
		let params = {robot_num:'',state1:'',state2:''};
		let url = originalUrl+machineManage;
		model.fetch(params,url,'get',(res)=>{
			console.log('init——res.data:',res.data);
			let data = res.data;
			//将状态码=>值，给每行数据加必备的key 属性
			changeMachine(data);
			for(let i=0;i<data.length;i++){
				data[i].create_time = moment(data[i].create_time).format('YYYY-MM-DD HH:mm:ss');
			}
			// console.log('data:',data)
			me.setState({data: data});
		})
	}
		//筛选区域
	//robot_num 机器人编号
	robot_num = (ev)=>{
		console.log('机器人编号：',ev.target.value);
		this.setState({robot_num: ev.target.value});
	}
	// 机器人状态 handleSelct
	handleState1 = (ev)=>{
		console.log('value:',ev.target.value);
		this.setState({state1: ev.target.value});
	}
	handleState2 = (ev)=>{
		console.log('value:',ev.target.value);
		this.setState({state2: ev.target.value});
	}
	search = ()=>{
		let robot_num = this.state.robot_num;
		let state1 = this.state.state1;
		let state2 = this.state.state2;
		const me = this;
		let params = {robot_num:robot_num,state1:state1,state2:state2};
		let url = originalUrl + machineManage;
		model.fetch(params,url,'get',(res)=>{
			console.log('筛选的数据：',res.data);
			let data = res.data;
			changeMachine(data);
			me.setState({data:data});
		})
	}
	reset = ()=>{
		this.setState({
			robot_num: '',
			state1: '',
			state2: '',
		})
		this.init();
	}
	
		//弹框函数区域 编辑
	Modal1Visible = (id)=>{
		console.log("编辑id:",id)
		//在data中获取该条id数据
		let data = [...this.state.data];
		let filterData = data.filter((item)=>{
			return item.id == id;
		})
		console.log('编辑该条数据:',filterData);
		machineChange(filterData);//汉字状态=》数字
		//切记不能做直接覆盖，会把我定义的ModalForm的参数丢失
		let ModalForm = {...this.state.ModalForm};
			for(let item in filterData[0]){
				for(let key in ModalForm){
					if(item == key){
						ModalForm[key] = filterData[0][item];
					}
				}
			}
		let time = moment(filterData[0].create_time).format('YYYY-MM-DD HH:mm:ss');
		let create_time = moment(time, 'YYYY-MM-DD HH:mm:ss');
		ModalForm['create_time'] = create_time;
		console.log('ModalForm:',ModalForm);
		this.setState({
			id:id,
			ModalForm: ModalForm,
			Modal1Visible: true,
		})
	}
		Modal1Change = (ev,key)=>{
			let form = {...this.state.ModalForm};
			for(let item in form){
				if(item == key){
					form[item] = ev.target.value;
					this.setState({ModalForm: form});
				}
			}
		}
		datePicker = (value)=>{
			console.log('value:',value);
			let form = {...this.state.ModalForm};
			form['create_time'] = value;
			this.setState({ModalForm: form});
		}
		onOk = (value)=>{
			console.log('value:',value)
		}
		handleModal1Ok = e => {
			let id = this.state.id;
			let form = {...this.state.ModalForm};
			let create_time = moment(form.create_time).format('YYYY-MM-DD HH:mm:ss');
			form.create_time = create_time;
			const me = this;
			let params = form;
			console.log('form:',form)
			let url = originalUrl + machineManage + id +'/';
			model.fetch(params,url,'put',function(res){
				console.log('编辑机器人信息发送：',res.data);
				console.log('11：');
				let Form = {...me.state.ModalForm};
				console.log('form:',Form)
				//数据清空,方便下次填写 新增主机表
				for(let item in Form){
					if(item != 'create_time'){
						Form[item] = '';
					}else{
						Form[item] = null;
					}
				}
				me.setState({
					ModalForm: Form,
					id: '',
					Modal1Visible: false,
				});
				me.init();
			})
		};
		handleModal1Cancel = e => {
			//数据清空,方便下次填写 新增主机表
			let Form = {...this.state.ModalForm};
			for(let item in Form){
				if(item != 'create_time'){
					Form[item] = '';
				}else{
					Form[item] = null;
				}
			}
			this.setState({
				Modal1Visible: false,
				ModalForm: Form,
			});
			this.init();
		};
			//新增主机信息弹窗
		Modal2Visible = ()=>{
			console.log('新增主机弹框')
			this.setState({
				Modal2Visible:true,
			})
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
		handleModal2Ok = e => {
			let form = {...this.state.ModalForm};
			let create_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			
			form.create_time = create_time;
			const me = this;
			let params = form;
			let url = originalUrl + machineManage;
			model.fetch(params,url,'post',(res)=>{
				console.log('增加机器人-res.data:',res.data);
				//数据清空,方便下次填写 新增主机表
				let Form = {...me.state.ModalForm};
				//数据清空,方便下次填写 新增主机表
				for(let item in Form){
					if(item != 'create_time'){
						Form[item] = '';
					}else{
						Form[item] = [];
					}
				}
				me.setState({
					Modal2Visible: false,
					ModalForm: Form,
				});
				//再次请求，渲染列表 table 
				me.init();
			})
		};
		handleModal2Cancel = e => {
			console.log(e);
			//数据清空,方便下次填写 新增主机表
			let Form = {...this.state.ModalForm};
			for(let item in Form){
				if(item != 'create_time'){
					Form[item] = '';
				}else{
					Form[item] = [];
				}
			}
			this.setState({
				Modal2Visible: false,
				ModalForm: Form,
			});
		};
	}
export default RobotManage;