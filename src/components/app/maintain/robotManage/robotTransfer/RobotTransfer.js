import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop, Popconfirm } from 'antd';
import { originalUrl, orderForm, machineManage, machineTransfer } from '../../../../../dataModule/UrlList';
import { Model } from '../../../../../dataModule/testBone.js';
import Transfer from '../../../../../statistics/transfer.png';
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
				data: [],
				columns:[
					{ title: '订单编号', dataIndex: 'id', width: '15%',align:'center',},
					{ title: '订单生命状态', dataIndex: 'state1', width: '8%', align:'center',},
					{ title: '订单配送状态', dataIndex: 'state2', width: '8%', align:'center',},
					{ title: '订单创建时间', dataIndex: 'create_time', width: '12%', align:'center',},
					{ title: '起点', dataIndex: 'origin', width: '8%', },
					{ title: '终点', dataIndex: 'destination', width: '8%', align:'center',},
					{ title: '用户', dataIndex: 'user_id',width:'10%', align:'center',},
					{ title: '价格', dataIndex: 'price', width: '10%', align:'center',},
					{ title: '操作', dataIndex: 'action' ,align:'center', render: (text,record)=>{
						return(
							<span style={{cursor: 'pointer'}} onClick={()=>{this.Transfer(record.id)}}>
								<img src={Transfer} alt="调拨"/>
							</span>
						)
					}
					},
				],
				//弹框 调拨
				order_id: '',
				ModalVisible: false,
				ModalData: [],
				ModalColumns:[
					{ title: '名称',key:'name', dataIndex: 'name', width: '15%', },
					{ title: '编号',key:'robot_num', dataIndex: 'robot_num', width: '15%', },
					{ title: '机器人状态',key:'state1', dataIndex: 'state1', width: '15%', },
					{ title: '运行状态', key:'state2', dataIndex: 'state2', width: '15%', },
					{ title: '上线日期', key:'create_time', dataIndex: 'create_time', width: '15%', },
					{ title: '备注', key:'description', dataIndex: 'description', width: '15%', },
					{ title: '操作', key: 'action', render: (text,record) => {
							return (
								<span style={{cursor: 'pointer'}} >
									<Popconfirm title="确认调拨?" onConfirm={() => this.ConfirmTransfer(record,record.id)}>
										<Button type="primary">调拨</Button>
									</Popconfirm>
								</span>
							)
						} 
					},
				],
			}
	}
	render(){
		const { ModalForm, columns, data, robot_num, ModalData, ModalColumns, ModalVisible} = this.state;
		return(
			<div id="robotTransfer">
				<div className="header">
						<h2>订单调拨</h2>
				</div>
				<div className="main">
					<Table className="antd-Table" columns={columns} dataSource={data} 
					pagination={{ pageSize: 8 }} scroll={{ y: '100%', x: 1500 }}/>
					{/* 回到顶部 */}
					<BackTop />
					<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
				</div>
				<div className="robot-transfer">
					<Modal
						title="订单调拨"
						visible={ModalVisible}
						onOk={this.handleModalOk}
						onCancel={this.handleModalCancel}
						width='800px'
					>
					<Table className="antd-Table" columns={ModalColumns} dataSource={ModalData}
					pagination={{ pageSize: 8 }} scroll={{ y: '100%', x: 1000 }}/>
					</Modal>
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
	
	//init  等待配送的订单 order state2 = 0
	init = ()=>{
		const me = this;
		let params = {start_time:'',endtime:'',state1:'',state2: ''};
		let url = originalUrl + orderForm;
		model.fetch(params,url,'get',(res)=>{
			console.log('订单记录数据:',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i]['create_time'] = moment(data[i]['create_time']).format('YYYY-MM-DD HH:mm:ss');
			}
			//筛选只有state2 = 0 的订单；
			let filterData = data.filter((item)=>{
				return item.state2 == 0 ;
			})
			changeOrder(filterData);
			me.setState({data:filterData});
		})
	}

	//table区域
	ModalVisible = ()=>{
		this.setState({ModalVisible:true})
	}
	Transfer = (order_id)=>{
		// this.setState({ModalVisible: true,})
		console.log(`${order_id}order_id:`,order_id);
		const me = this;
		let params = {robot_num:'',state1: '',state2: '',};
		let url = originalUrl+machineManage;
		model.fetch(params,url,'get',(res)=>{
			console.log('机器人数据：',res.data);
			let data = res.data;
			let arry = [];
			MachineFilter(data,arry); //筛选出正藏且空闲的机器人
			me.setState({
				ModalData: arry,
				ModalVisible: true,
				order_id: order_id,
				});
		})
	}
	//弹框函数 确认调拨 后订单state2 0->1 配送中 机器人state1 0->1 
	ConfirmTransfer = (record,id)=>{         //机器人id robod_id 是编号
		console.log('机器人编号：',id);
		console.log('record:',record)
		let robot_num = record.robot_num;
		const me = this;
		let ModalData = me.state.ModalData;
		let data = ModalData.filter((item)=>{
			return item.id == id;
		})
		console.log('data:',data);
		let transfer_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		let order_id = me.state.order_id;
		let orderData = me.state.data;
		let orderDataFilter = orderData.filter((item)=>{
			return item.id = order_id;
		})
		let arry = {
			order_id: order_id,
			origin: orderDataFilter[0].origin,
			destination: orderDataFilter[0].destination,
			user_id: orderDataFilter[0].user_id,
			create_time: orderDataFilter[0].create_time,
			state2: 1,
		};
		let url = originalUrl + machineTransfer;
		console.log("data[0]:",data[0])
		let params = {...data[0],transfer_time:transfer_time,...arry};
		console.log('params：',params);
		model.fetch(params,url,'post',(res)=>{
			console.log('发送成功！');
			//将机器人state1 0->1 使用中
			let url1 = originalUrl + machineManage +id + '/';
			let params1 = {state1: 1};
			model.fetch(params1,url1,'put',(res)=>{
				console.log('修改state1');
			})
			//将订单state2 0->1 配送中 订单的机器人编号 ‘’=》id（机器人编号 robot_num
			let url2 = originalUrl + orderForm + order_id + '/';
			let params2 = {state2: 1,robot_num: robot_num};
			model.fetch(params2,url2,'put',(res)=>{
				console.log('修改state2');
				me.setState({
					ModalVisible: false,
				})
				me.init();
			})
		})
	}
	handleModalOk = ()=>{
		this.setState({ModalVisible: false});
		this.init();
	}
	handleModalCancel = ()=>{
		this.setState({ModalVisible: false});
		this.init();
	}
}
export default RobotTransfer;