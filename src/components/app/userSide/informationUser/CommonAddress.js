import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select,BackTop, Popconfirm } from 'antd';
import { originalUrl,machineManage, commonAddress } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import { getCookie } from '../../../../helpers/cookies.js';
import Edit from '../../../../statistics/edit.png';
import Delete from '../../../../statistics/delete.png';
import { changeMachine } from '../../commonFunction.js';
import '../../style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();
// const id = JSON.parse(getCookie('user')).id;
const id=110;


class CommonAddress extends Component{
	constructor(props) {
	    super(props);
			console.log('this.props:',this.props)
			this.state = {
				order_id: '',    //订单id
				//table 
				data: [
					// {id: '110',consignee: '爱峰',contact: '151348313215',address: '上海理工大学'},
				],
				columns : [
					{ title: '收货人',key:'consignee', dataIndex: 'consignee', width: '25%', },
				  { title: '联系方式',key:'contact', dataIndex: 'contact', width: '25%', },
					{ title: '地址',key:'address', dataIndex: 'address', width: '25%', },
					{ title: '操作', key: 'action', render: (text,record) => {
							return (
								<div>
									<span style={{cursor: 'pointer',marginRight: '10px'}} onClick={()=>{this.Modal1Visible(record.id)}}>
										<img src={Edit}/>
									</span>
									<Popconfirm  title="确认删除？" onConfirm={()=>{this.handleDelete(record.id)}}>
										<img src={Delete} style={{cursor: 'pointer'}}/>
									</Popconfirm>
								</div>
							)
						} 
					},
					
				],
				//弹框函数
				ModalForm: {
					address: '',
					consignee: '',
					contact: '',
				},
				Modal2Visible: false,
				Modal1Visible: false,
			}
	}
	render(){
		const { consignee ,contact, ModalForm,Modal1Visible,Modal2Visible} = this.state
		return(
		<div id="personalInformation">
			<div className="header">
				<div className="title">
					<span>地址管理</span>
					<button className="button" onClick={()=>{this.Modal2Visible()}}>添加地址</button>
				</div>
				<div className="filter">
					<span className="span">
					</span>
					<span className="span">
					</span>
					<span className="span">
					</span>
				</div>
			</div>
			<div className="main">
				<Table className="antd-Table" columns={this.state.columns} dataSource={this.state.data} 
				pagination={{ pageSize: 8 }} scroll={{ y: '100%',x: 1000 }}/>
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
			</div>
			<div className="robot-modify">
				<Modal
					title="地址信息编辑"
					visible={Modal1Visible}
					onOk={this.handleModal1Ok}
					onCancel={this.handleModal1Cancel}
				>
					<table className="table">
						<thead></thead>
						<tbody>
							<tr>
								<td className="title" style={{marginRight:20}}>收货人:</td>
								<td><Input style={{width: '100%',height:'100%'}} value={ModalForm.consignee} onChange={(ev)=>{this.Modal1Change(ev,'consignee')}}/></td>
							</tr>
							<tr>
								<td>联系方式:</td>
								<td><Input style={{width: '100%',height: '100%'}} value={ModalForm.contact} onChange={(ev)=>{this.Modal1Change(ev,'contact')}}/></td>
							</tr>
							<tr>
								<td>地址:</td>
								<td>
									<input id='tipinput1' type="text" className="input" value={ModalForm.address} onChange={(ev)=>{this.Modal1Change(ev,'address')}}/>
								</td>
							</tr>
						</tbody>
						<tfoot></tfoot>
					</table>
				</Modal>
			</div>
			<div className="robot-add">
				<Modal
					title="添加常用收货地址"
					visible={Modal2Visible}
					onOk={this.handleModal2Ok}
					onCancel={this.handleModal2Cancel}
				>
					<div id="container"></div> {/* 地图实例隐藏就好，用来做搜索提示的地图实例 */}
					<table className="table">
						<thead>
						</thead>
						<tbody>
							<tr>
								<td className="title" style={{marginRight:20}}>收货人:</td>
								<td><Input style={{width: '100%',height:'100%'}} value={ModalForm.consignee} onChange={(ev)=>{this.Modal2Change(ev,'consignee')}}/></td>
							</tr>
							<tr>
								<td>联系方式:</td>
								<td><Input style={{width: '100%',height: '100%'}} value={ModalForm.contact} onChange={(ev)=>{this.Modal2Change(ev,'contact')}}/></td>
							</tr>
							<tr>
								<td>地址:</td>
								<td>
									<input id='tipinput2' type="text" className="input" value={ModalForm.address} onChange={(ev)=>{this.Modal2Change(ev,'address')}}/>
								</td>
							</tr>
						</tbody>
						<tfoot></tfoot>
					</table>
					<div id="container"></div> {/* 地图实例隐藏就好，用来做搜索提示的地图实例 */}
				</Modal>
			</div>
		</div>
		)
	}
	componentDidMount(){
		this.init()
	}
	componentDidUpdate(){   //组件跟新时触发，可以再这个函数内取得Modal的DOM元素
		console.log('chufa')
		// setTimeout(()=>{  //必须要用setTimeout把这个任务放到异步队列里，不然第一次获取不到！！
		
		// },)
	}
	//
	init = ()=>{
		const me = this;
		let params = {};
		let url = originalUrl + commonAddress;
		model.fetch(params,url,'get',(res)=>{
			console.log('init——res.data:',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i].key = data[i].id;
			}
			me.setState({data: data});
		})
	}
		//弹框函数区域 编辑
	Modal1Visible = (id)=>{
		console.log("编辑id:",id)
		setTimeout(()=>{  //必须要用setTimeout把这个任务放到异步队列里，不然第一次获取不到！！
			let Form = {...this.state.ModalForm};
			let address = document.getElementById('tipinput1');
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
		let data = [...this.state.data];
		let filter = data.filter((item)=>{
			return item.id == id;
		})
		console.log('filter:',filter)
		this.setState({
			Modal1Visible: true,
			ModalForm: filter[0],
			order_id: id,
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
		handleModal1Ok = e => {
			let form = {...this.state.ModalForm};
			let order_id = this.state.order_id;
			let address = document.getElementById('tipinput1').value;
			console.log('address:',address)
			form.address = address;
			const me = this;
			let params = form;
			let url = originalUrl + commonAddress + order_id +'/';
			model.fetch(params,url,'put',function(res){
				console.log('编辑地址信息发送：',res.data);
				for(let item in form){
					if(item != 'create_time'){
						form[item] = '';
					}else{
						form[item] = null;
					}
				}
				me.setState({
					Modal1Visible: false,
					ModalForm: form,
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
		handleDelete = (id)=>{
			const me = this;
			let params = {};
			let url = originalUrl + commonAddress + id +'/';
			model.fetch(params,url,'delete',(res)=>{
				console.log(`删除${id}地址信息成功`);
				me.setState({
					Modal1Visible: false,
				});
				me.init();
			})
		}
			//新增地址信息弹窗
		Modal2Visible = ()=>{
			console.log('新增地址弹框')
			setTimeout(()=>{  //必须要用setTimeout把这个任务放到异步队列里，不然第一次获取不到！！
				let Form = {...this.state.ModalForm};
				let address = document.getElementById('tipinput2');
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
			let address = document.getElementById('tipinput2').value;
			console.log('address:',address)
			form.address = address;
			const me = this;
			let params = form;
			let url = originalUrl + commonAddress;
			model.fetch(params,url,'post',(res)=>{
				console.log('增加地址-res.data:',res.data);
				//数据清空,方便下次填写 新增主机表
				//数据清空,方便下次填写 新增主机表
				for(let item in form){
					if(item != 'create_time'){
						form[item] = '';
					}else{
						form[item] = [];
					}
				}
				me.setState({
					Modal2Visible: false,
					ModalForm: form,
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
export default CommonAddress;