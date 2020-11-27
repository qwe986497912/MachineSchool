import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop, Popconfirm } from 'antd';
import { originalUrl, orderForm, machineManage, machineTransfer } from '../../../../../dataModule/UrlList';
import { Model } from '../../../../../dataModule/testBone.js';
import Delete from '../../../../../statistics/delete.png';
import { changeOrder, changeMachine, MachineFilter } from '../../../commonFunction.js';
import '../../../style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const {Option} = Select;
const model = new Model();

class RobotTransfer extends Component{
	constructor() {
	    super();
			this.state = {
				//筛选区域
				robot_num: '',     //机器人编号
				state2: '',       //机器人运行状态
				order_id: '',     //订单编号
				data: [],
				columns:[
					{ title: '订单编号', dataIndex: 'order_id', width: '15%',align:'center',},
					{ title: '订单配送状态', dataIndex: 'state2', width: '8%', align:'center',},
					{ title: '起点', dataIndex: 'origin', width: '8%', },
					{ title: '终点', dataIndex: 'destination', width: '8%', align:'center',},
					{ title: '用户', dataIndex: 'user_id',width:'10%', align:'center',},
					{ title: '订单创建时间', dataIndex: 'create_time', width: '12%', align:'center',},
					
					{ title: '订单配送时间', dataIndex: 'transfer_time', width: '12%', align:'center',},
					
					{ title: '配送机器人',key:'name', dataIndex: 'name', width: '15%', },
					{ title: '编号',key:'robot_num', dataIndex: 'robot_num', width: '15%', },
					
					{ title: '操作', dataIndex: 'action' ,align:'center', render: (text,record)=>{
						return(
							<span style={{cursor: 'pointer'}} onClick={()=>{this.handleDelete(record.id)}}>
								<img src={Delete} alt="删除"/>
							</span>
						)
					}
					},
				],
			}
	}
	render(){
		const { ModalForm, columns, data, robot_num, order_id,state2 } = this.state;
		return(
			<div id="robotTransferOrders">
				<div className="header">
					<div className="title">
						<h2>订单调拨记录</h2>
					</div>
					<div className="filter">
							<span className="span">
								机器人编号:
								<Input className='input' value={robot_num} onChange={(ev)=>{this.robot_num(ev)}}/>
							</span>
							<span className="span">
								订单配送状态:
								<select className="select" value={state2} onChange={(ev)=>{this.handleState2(ev)}}>
									<option key='0' value="0"></option>
									<option key='1' value="1">正常</option>
									<option key='2' value="2">维护中</option>
									<option key='3' value="3">损坏</option>
								</select>
							</span>
							<span className="span">
								订单编号:
								<Input className='input' value={order_id } onChange={(ev)=>{this.order_id (ev)}}/>
							</span>
						<div className="buttonArea">
							<Button className="button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
							<Button className="button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
						</div>
					</div>
				</div>
				<div className="main">
					<Table className="antd-Table" columns={columns} dataSource={data} 
					pagination={{ pageSize: 8 }} scroll={{ y: '100%', x: 1500 }}/>
					{/* 回到顶部 */}
					<BackTop />
					<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
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
	
	/* 
		*init 从machineTransfer 拿调拨的数据 可以拿到机器人的数据、订单id和配送时间
		*在根据订单id 去拿订单信息
	 */
	change = (robot_num,state2,order_id,data)=>{
		let data1 = data.map((item)=>{
			if(robot_num){
				return item.robot_num == robot_num;
			}else{
				return item;
			}
		})
		let data2 = data1.map((item)=>{
			if(state2){
				return item.state2 == state2;
			}else{
				return item;
			}
		})
		let data3 = data2.map((item)=>{
			if(order_id){
				return item.order_id == order_id;
			}else{
				return item;
			}
		})
		data = data3;
		return data;
	}
	init = ()=>{
		const me = this;
		let params = {start_time: '',end_time: '',state1: '',};
		let url = originalUrl + machineTransfer;
		model.fetch(params,url,'get',(res)=>{
			console.log('调拨记录数据:',res.data);
			let data = res.data;
			changeOrder(data);
			me.setState({data:data});
		})
	}
	//筛选区域
	robot_num = (ev)=>{
		this.setState({robot_num: ev.target.value});
	}
	handleState2 = (ev)=>{
		console.log('ev.target.value:',ev.target.value);
		this.setState({
			state2: ev.target.value,
		})
	}
	order_id = (ev)=>{
		console.log('ev.target.value:',ev.target.value);
		this.setState({
			order_id: ev.target.value,
		})
	}
	search = ()=>{
		const me = this;
		let robot_num = me.state.robot_num;
		let order_id = me.state.order_id;
		let state2 = me.state.state2;
		if(state2 == 0){
			state2 = '等待配送';
		}else if(state2 == 1){
			state2 = '配送中';
		}else{
			state2 = '配送完成';
		}
		let data = this.state.data;
		this.change(robot_num,robot_num,state2,data);
		console.log('data:',data);
		{/* 
			let params = {robot_num,robot_num,state2};
			let url = originalUrl + machineTransfer;
			model.fetch(params,url,'get',(res)=>{
				console.log('shaixuan记录数据:',res.data);
				let data = res.data;
				changeOrder(data);
				me.setState({data:data});
			})
		}
		 */}
	}
	handleDelete  = (id)=>{
		console.log('删除调拨记录id：',id);
		const me = this;
		let params = {};
		let url = originalUrl + machineTransfer + '?id=' + id;
		model.fetch(params,url,'delete',(res)=>{
			console.log('${id}删除成功！')
		})
	}
	
}
export default RobotTransfer;