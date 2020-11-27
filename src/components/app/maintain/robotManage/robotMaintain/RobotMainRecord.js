import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select,BackTop, message } from 'antd';
import { originalUrl,machineMaintain, machineManage } from '../../../../../dataModule/UrlList';
import { Model } from '../../../../../dataModule/testBone.js';
import Maintain from '../../../../../statistics/maintain.png';
import { changeMachine } from '../../../commonFunction.js';
import '../../../style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();


class RobotMaintainRecord extends Component{
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
				  { title: '名称',key:'name', dataIndex: 'name', width: '5%',align:'center', },
				  { title: '编号',key:'robot_num', dataIndex: 'robot_num', width: '10%', align:'center',},
				  { title: '机器人状态',key:'state1', dataIndex: 'state1', width: '5%',align:'center' },
					{ title: '运行状态', key:'state2', dataIndex: 'state2', width: '5%',align:'center' },
					{ title: '维护原因', key: 'reason', dastaIndex: 'reason', width: '8%',align:'center'},
					{ title: '报修时间', key:'maintain_time', dataIndex: 'maintain_time', width: '20%', align:'center'},
					{ title: '备注', key:'description', dataIndex: 'description', width: '10%',align:'center' },
					{ title: '维护状态', key:'maintain_state', dataIndex: 'maintain_state', width: '10%', align:'center',render: (maintain_state)=>{
						console.log('maintain_state:',maintain_state);
						let color;
						if(maintain_state == '维护中'){
							color = 'black';
						}else if(maintain_state == '维护完成'){
							color = '#1890ff';
						}else{
							color = 'red';
						}
						return (
							<span style={{color:color}}>{maintain_state}</span>
						)
					}},
					{ title: '操作', key: 'action', render: (text,record) => {
							return (
								<div>
									<span style={{cursor: 'pointer',}} onClick={()=>{this.fixed(record.id,record)}}>
										<Button type="primary">完成维护</Button>
									</span>&nbsp;&nbsp;&nbsp;&nbsp;
									<span style={{cursor: 'pointer',}} onClick={()=>{this.scrap(record.id,record)}}>
										<Button type="primary">报废</Button>&nbsp;&nbsp;&nbsp;&nbsp;
									</span>
								</div>
							)
						} 
					},
				],
			}
	}
	render(){
		const { robot_num ,state1,state2,} = this.state
		return(
		<div id="robotMantainRecord">
			<div className="header">
				<div className="title">
					{/* <h2>机器人维护记录</h2> */}
				</div>
				<div className="filter">
					<span className="span">
						机器人编号:
						<Input className='input' value={robot_num} onChange={(ev)=>{this.robot_num(ev)}}/>
					</span>
					<span className="span">
						机器人状态:
						<select className="select" value={state1} onChange={(ev)=>{this.handleState1(ev)}}>
							<option key='0' value="0"></option>
							<option key='1' value="1">空闲</option>
							<option key='2' value="2">使用中</option>
						</select>
					</span>
					<span className="span">
						机器人运行状态:
						<select className="select" value={state2} onChange={(ev)=>{this.handleState2(ev)}}>
							<option key='0' value="0"></option>
							<option key='1' value="1">正常</option>
							<option key='2' value="2">维护中</option>
							<option key='3' value="3">损坏</option>
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
				pagination={{ pageSize: 8 }} scroll={{ y: '100%',x: 1500 }}/>
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
			</div>
		</div>
		)
	}
	componentDidMount(){
		this.init();
	}
	componentDidUpdate(){
		console.log('update');
	}
	componentWillUnmount(){
		console.log('维护记录卸载');
	}
	// 函数区
	init = ()=>{
		const me = this;
		let params = {robot_num:'',state1:'',state2:''};
		let url = originalUrl+machineMaintain;
		model.fetch(params,url,'get',(res)=>{
			console.log('机器人维护记录res.data:',res.data);
			let data = res.data;
			//将状态码=>值，给每行数据加必备的key 属性
			changeMachine(data);
			//
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
		let url = originalUrl + machineMaintain;
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
			state1: 0,
			state2: 0,
		})
		this.init();
	}
	//把维护状态有等待维护=》维护完成  机器人运行状态=》正常
	fixed = (id,record)=>{ //维护记录的id
		let filterData = [...this.state.data].filter((item)=>{
			return item.id == id;
		})
		let maintainState = filterData[0].maintain_state;
		console.log('mainState:',maintainState);
		if(maintainState == '维护中'){
			let robot_id = record.robot_id;
			const me = this;
			let params = {maintain_state: 2};
			let url = originalUrl + machineMaintain + id + '/';
			model.fetch(params,url,'put',(res)=>{
				console.log('机器人维护记录res.data修改成功:',res.data);
				let url = originalUrl + machineManage + robot_id + '/';
				let params = {state2:0}
				model.fetch(params,url,'put',(res)=>{
					console.log('修改机器人运行状态为正常:');
					message.success('维护完成，设备恢复正常！')
				})
				me.init();
			})
		}else{
			console.log(`${maintainState} 不符合`)
			setTimeout(()=>{
				message.error('维护已结束，请勿重复操作！')
			},500)
		}
	}
	//把维护状态有等待维护=》维护失败，设备报废  机器人运行状态=》报废
	scrap = (id,record)=>{ //维护记录的id
		let filterData = [...this.state.data].filter((item)=>{
			return item.id == id;
		})
		let maintainState = filterData[0].maintain_state;
		console.log('mainState:',maintainState);
		if(maintainState == '维护中'){
			let robot_id = record.robot_id;
			const me = this;
			let params = {maintain_state: 3};
			let url = originalUrl + machineMaintain + id + '/';
			model.fetch(params,url,'put',(res)=>{
				console.log('机器人维护记录res.data修改成功:',res.data);
				let url = originalUrl + machineManage + robot_id + '/';
				let params = {state2:3}
				model.fetch(params,url,'put',(res)=>{
					console.log('修改机器人运行状态为报废:');
					message.error('维护失败，设备报废！')
				})
				me.init();
			})
		}else{
			console.log(`${maintainState} 不符合`)
			setTimeout(()=>{
				message.error('维护已结束，请勿重复操作！')
			},500)
		}
	}
}
export default RobotMaintainRecord;