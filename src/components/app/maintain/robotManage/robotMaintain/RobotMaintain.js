import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select,BackTop } from 'antd';
import { originalUrl,machineManage, machineMaintain } from '../../../../../dataModule/UrlList';
import { Model } from '../../../../../dataModule/testBone.js';
import Maintain from '../../../../../statistics/maintain.png';
import { changeMachine, machineChange } from '../../../commonFunction.js';
import '../../../style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();


class RobotMaintain extends Component{
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
				  { title: '编号',key:'robot_num', dataIndex: 'robot_num', width: '15%', align:'center'},
				  { title: '机器人状态',key:'state1', dataIndex: 'state1', width: '10%',align:'center' },
					{ title: '运行状态', key:'state2', dataIndex: 'state2', width: '10%', align:'center'},
					{ title: '上线日期', key:'create_time', dataIndex: 'create_time', width: '20%', align:'center'},
					{ title: '备注', key:'description', dataIndex: 'description', width: '15%', align:'center'},
					{ title: '操作', key: 'action', render: (text,record) => {
						console.log('record:',record)
							return (
								<span onClick={()=>{this.ModalVisible(record.id)}}>
									<img src={Maintain}/>
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
					reason: '',             //机器人保修原因
					description: '',
				},
				ModalVisible: false,
			}
			// this.datePicker = this.datePicker.bind(this);
	}
	render(){
		const { robot_num ,state1,state2, ModalForm,ModalVisible} = this.state
		return(
		<div id="robotMantain">
			<div className="header">
				<div className="title">
					{/* <h2>机器人维护</h2> */}
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
						</select>
					</span>
					<div className="buttonArea">
						<Button className="button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
						<Button className="button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
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
			<div className="robot-maintain">
				<Modal
					title="机器人保修单"
					visible={ModalVisible}
					onOk={this.handleModalOk}
					onCancel={this.handleModalCancel}
				>
					<table className="table">
						<thead></thead>
						<tbody>
							<tr>
								<td className="title" style={{marginRight:20}}>机器人名称:</td>
								<td>{ModalForm.name}</td>
							</tr>
							<tr>
								<td>机器人编号:</td>
								<td>{ModalForm.robot_num}</td>
							</tr>
							<tr>
								<td>机器人运行状态:</td>
								<td>{ModalForm.state1}</td>
							</tr>
							<tr>
								<td>机器人状态:</td>
								<td>{ModalForm.state2}</td>
							</tr>
							<tr>
								<td>上线日期:</td>
								<td>{ModalForm.create_time}</td>
							</tr>
							<tr>
								<td>备注:</td>
								<td>{ModalForm.description}</td>
							</tr>
							<tr>
								<td>报修原因:</td>
								<td>
									<Input style={{width: '100%',height:'100%'}} value={ModalForm.reason} onChange={(ev)=>{this.ModalChange(ev,'reason')}}/>
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
		let url = originalUrl + machineManage;
		model.fetch(params,url,'get',(res)=>{
			console.log('机器人数据res.data:',res.data);
			let data = res.data.filter((item)=>{
				return item.state2 == '2';
			})
			// let data = [];
			// for(let i=0;i<res.data.length;i++){
			// 	if(res.data[i]['state2'] == 2){
			// 		data.push(res.data[i])
			// 	}
			// }
			console.log('filter-data:',data)
			//将状态码=>值，给每行数据加必备的key 属性
			changeMachine(data);
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
			let data = [];
			for(let i=0;i<res.data.length;i++){
				if(res.data[i]['state2'] == 2){
					data.push(res.data[i])
				}
			}
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
	
		//弹框函数区域 申请报修单
	ModalVisible = (id)=>{
		console.log("申请报修单id:",id)
		//发送get请求，获取数据
		let data = [...this.state.data];
		let filterData = data.filter((item)=>{
			return item.id == id;
		})
		console.log('编辑该条数据:',filterData);
		changeMachine(filterData);
		//切记不能做直接覆盖，会把我定义的ModalForm的参数丢失
		let ModalForm = {...this.state.ModalForm};
			for(let item in filterData[0]){
				for(let key in ModalForm){
					if(item == key){
						ModalForm[key] = filterData[0][item];
					}
				}
			}
			console.log('ModalForm；',ModalForm);
			this.setState({
				id:id,
				ModalForm: ModalForm,
				ModalVisible: true,
			})
	}
		ModalChange = (ev,key)=>{
			let form = {...this.state.ModalForm};
			for(let item in form){
				if(item === key){
					form[item] = ev.target.value;
					this.setState({ModalForm: form});
				}
			}
		}
		//把维修申报表发送到maintain && 把state2 ->1
		handleModalOk = e => {
			let id = this.state.id;
			let form = {...this.state.ModalForm};
			let maintain_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			const me = this;
			let params = {...form,maintain_time:maintain_time,maintain_state: 1,robot_id: id};
			let url = originalUrl + machineMaintain;
			model.fetch(params,url,'post',(res)=>{
				console.log('申请报修单机器人信息发送：',res.data);
				let Form = {...this.state.ModalForm};
				//数据清空,方便下次填写 新增主机表
				for(let item in Form){
					if(item != 'create_time'){
						Form[item] = '';
					}else{
						Form[item] = [];
					}
				}
				me.setState({
					ModalForm: Form,
					id: '',
					ModalVisible: false,
				});
				me.init();
			})
			//state1 ->1
			let url2 = originalUrl + machineManage + id +'/';
			let params2 = {state2: 1}
			model.fetch(params2,url2,'put',(res)=>{
				console.log('修改成功')
			})
		};
		handleModalCancel = e => {
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
				ModalVisible: false,
				ModalForm: Form,
			});
		};
	}
export default RobotMaintain;