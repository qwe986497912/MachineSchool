import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop } from 'antd';
import { originalUrl, orderForm, } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import dustbin from '../../../../statistics/delete.png';
import { changeOrder } from '../../commonFunction.js';
import '../../style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const {Option} = Select;
const model = new Model();

class OrdersRecord extends Component{
	constructor() {
	    super();
			this.state = {
				//头部筛选框 日期  订单状态
				dateArea: [],
				state1: "",  //订单状态存值
				//table data：数据 columns 表头
				data: [],
				columns:[
					{ title: '订单编号', dataIndex: 'id', width: '20%',align:'center',},
					{ title: '配送机器人编号', dataIndex: 'robot_num', width: '5%',align:'center', },
					{ title: '订单生命状态', dataIndex: 'state1', width: '5%', align:'center',},
					{ title: '订单配送状态', dataIndex: 'state2', width: '5%', align:'center',},
					{ title: '订单创建时间', dataIndex: 'create_time', width: '15%', align:'center',},
					{ title: '起点', dataIndex: 'origin', width: '10%', },
					{ title: '终点', dataIndex: 'destination', width: '10%', align:'center',},
					{ title: '用户', dataIndex: 'user_id',width:'20%', align:'center',},
					{ title: '价格', dataIndex: 'price', width: '5%', align:'center',},
					{ title: '操作', dataIndex: 'action' ,align:'center', render: (text,record)=>{
						return(
							<span style={{cursor: 'pointer'}} onClick={()=>{this.handleDelete(record.id)}}>
								<img src={dustbin} alt="删除"/>
							</span>
						)
					}
					},
				],
			}
	}
	render(){
		const { dateArea, columns, data, state1,  } = this.state;
		return(
			<div id="orderTransfer">
				<div className="header">
					<div className="title">
						<h2>订单记录</h2>
					</div>
					<div className="filter">
						<span className="span">
							日期筛选:
							<RangePicker className='rangePicker' value={dateArea} onChange={(ev)=>{this.dateArea(ev)}}  onOk={this.onOk}  showTime format="YYYY-MM-DD"/>
						</span>
						<span className="span">
							订单生命状态:
							<select className="select" value={state1} onChange={(ev)=>{this.handleSelct(ev)}}>
								<option key='-1' value="-1"></option>
								<option key='0' value="0">取消</option>
								<option key='1' value="1">使用中</option>
								<option key='2' value="2">完成</option>
							</select>
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
	
	//init
	init = ()=>{
		console.log('zhixing')
		const me = this;
		let params = {start_time:'',end_time: '',state1: '',state2: ''};
		let url = originalUrl + orderForm;
		model.fetch(params,url,'get',(res)=>{
			console.log('订单记录数据:',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i].create_time = moment(data[i].create_time).format('YYYY-MM-DD HH:mm:ss')
			}
			changeOrder(data);
			me.setState({data:data});
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
	 //order select
	 handleSelct = (ev)=>{
		 console.log('订单状态：',ev.target.value);
		 this.setState({
			 state1: ev.target.value,
		 })
	 }
	 //订单状态
	search = ()=>{
		const me = this;
		let state1 = me.state.state1;
		let dateArea = [...me.state.dateArea];
		let url = originalUrl+orderForm;
		if(dateArea.length){
			let start_time = moment(dateArea[0]._d).format('YYYY-MM-DD');
			let end_time = moment(dateArea[1]._d).format('YYYY-MM-DD');
			let params = {
				start_time: start_time,
				end_time: end_time,
				state1: state1,
				state2: '', //筛选配送状态待加
			}
			model.fetch(params,url,'get',(res)=>{
				console.log('筛选数据：',res.data);
				let data = res.data;
				for(let i=0;i<data.length;i++){
					data[i]['create_time'] = moment(data[i]['create_time']).format('YYYY-MM-DD HH:mm:ss');
				}
				changeOrder(data);
				console.log('zhxing：');
				me.setState({data: data})
			})
		}else{
			console.log('日期不存在')
			let params = {state1: state1,start_time: '',end_time: '',state2: '',};
			model.fetch(params,url,'get',(res)=>{
				console.log('筛选数据：',res.data);
				let data = res.data;
				for(let i=0;i<data.length;i++){
					data[i]['create_time'] = moment(data[i]['create_time']).format('YYYY-MM-DD HH:mm:ss');
				}
				changeOrder(data);
				console.log('zhxing：');
				me.setState({data: data,})
			})
		}
	}
	reset = ()=>{
		this.setState({
			dateArea: [],
			state1: '',
		})
		this.init();
	}

	//table区域 handleDelete
	handleDelete = (id)=>{
		console.log('id:',id);
		const me = this;
		let params = {};
		let url = originalUrl+orderForm+ id + '/';
		model.fetch(params,url,'delete',(res)=>{
			console.log('delete sucess!');
			me.init();
		})
	}
}
export default OrdersRecord;