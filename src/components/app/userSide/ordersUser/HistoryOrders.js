import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop } from 'antd';
import { originalUrl, orderForm, userOrder } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import Delete from '../../../../statistics/delete.png';
import { changeOrder } from '../../commonFunction.js';
import history from '../../../common/history.js';
import '../../style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const {Option} = Select;
const model = new Model();

class HistoryOrders extends Component{
	constructor() {
	    super();
			this.state = {
				//头部筛选框 日期  订单状态
				dateArea: [],
				orderNum: "",  //订单编号
				robotNum: '',  //机器人编号
				//table data：数据 columns 表头
				data: [],
				columns:[
					{ title: '订单编号', dataIndex: 'id', width: '20%',align:'center',},
					{ title: '配送机器人编号', dataIndex: 'robot_num', width: '7%',align:'center', },
					{ title: '订单状态', dataIndex: 'state1', width: '7%', align:'center',},
					{ title: '订单创建时间', dataIndex: 'create_time', width: '12%', align:'center',},
					{ title: '起点', dataIndex: 'origin', width: '12%', },
					{ title: '终点', dataIndex: 'destination', width: '12%', align:'center',},
					{ title: '用户', dataIndex: 'user_id',width:'15%', align:'center',},
					{ title: '价格', dataIndex: 'price', width: '5%', align:'center',},
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
		const { dateArea, columns, data, state1, orderNum, robotNum } = this.state;
		return(
			<div id="currentOrders">
				<div className="header">
					<div className="title">
						<h2>当前订单</h2>
					</div>
					<div className="filter">
						<span className="span">
							日期筛选:
							<RangePicker className='rangePicker' value={dateArea} onChange={(ev)=>{this.dateArea(ev)}}  onOk={this.onOk}  showTime format="YYYY-MM-DD"/>
						</span>
						<span className="span">
							订单编号:
							<Input className='input' value={orderNum} onChange={(ev)=>{this.orderNum(ev)}}></Input>
						</span>
						<span className="span">
							配送机器人编号:
							<Input className='input' value={robotNum} onChange={(ev)=>{this.robotNum(ev)}}></Input>
						</span>
						<div>
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
	
	//init 历史订单 state3=0 && state1 != 1 
	init = ()=>{
		const me = this;
		let params = {start_time:'',end_time: '',state1: '',order_id:'',robot_num:'',};
		let url = originalUrl + userOrder;
		model.fetch(params,url,'get',(res)=>{
			console.log('me:',me);
			console.log('订单记录数据:',res.data);
			let data = res.data;
			let filterData = [];
			for(let i=0;i<data.length;i++){
				data[i]['create_time'] = moment(data[i]['creat_time']).format('YYYY-MM-DD HH:mm:ss');
				if(data[i].state1 != 1 && data[i].state3 == 1){
					filterData.push(data[i]);
				}
			}
			console.log('filterData:',filterData)
			changeOrder(filterData);
			me.setState({data: filterData});
		})
	}
	// 头部筛选区域
		//日期选择
	dateArea = (value)=>{
		if(value.length){
			console.log('日期区域:',value);
			console.log('momemt:',moment(value[0]._d).format('YYYY-MM-DD'));
			this.setState({
				dateArea: value,
			})
		}else{
			console.log('日期为空')
		}
	}
	onOk = (value)=>{
		console.log('onOk:',value);
	}
	 //配送机器人编号：
	 robotNum = (ev)=>{
		 console.log('配送机器人编号：',ev.target.value);
		 this.setState({
			 robotNum: ev.target.value,
		 })
	 }
	 //订单编号： orderNum
	 orderNum = (ev)=>{
		 console.log('订单编号：',ev.target.value);
		 this.setState({
		 	orderNum: ev.target.value,
		 })
	 }
	search = ()=>{
		const me = this;
		let dateArea = [...me.state.dateArea];
		let robotNum = me.state.robotNum;
		let orderForm = me.state.orderForm;
		let url = originalUrl + userOrder;
		if(dateArea.length){
			let start_time = moment(dateArea[0]._d).format('YYYY-MM-DD HH:mm:ss');
			let end_time = moment(dateArea[1]._d).format('YYYY-MM-DD HH:mm:ss');
			let params = {
				start_time: start_time,
				end_time: end_time,
				robotNum: robotNum,
				orderNum: orderForm,
			}
			model.fetch(params,url,'get',(res)=>{
				console.log('筛选数据：',res.data);
				let data = res.data;
				for(let i=0;i<data.length;i++){
					data[i]['create_time'] = moment(data[i]['creat_time']).format('YYYY-MM-DD HH:mm:ss');
				}
				me.changeOrder(data);
				me.setState({data: data})
			})
		}else{
			console.log('日期不存在')
			let params = {
				robotNum: robotNum,
				orderNum: orderForm,
			};
			model.fetch(params,url,'get',(res)=>{
				console.log('筛选数据：',res.data);
				let data = res.data;
				for(let i=0;i<data.length;i++){
					data[i]['create_time'] = moment(data[i]['creat_time']).format('YYYY-MM-DD HH:mm:ss');
				}
				me.changeOrder(data);
				me.setState({data: data})
			})
		}
	}
	reset = ()=>{
		this.setState({
			dateArea: [],
			robotNum: '',
			orderNum: '',
		})
		this.init();
	}

	//table区域 handleDelete put state3 1=>0
	handleDelete = (id)=>{
		console.log('id:',id);
		const me = this;
		let params = {state3: 0};
		let url = originalUrl + userOrder + '?id:' + id;
		model.fetch(params,url,'put',(res)=>{
			console.log('修改state3 1=>0 成功！')
			me.init();
		})
	}
}
export default HistoryOrders;