import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select,BackTop, Popconfirm, message } from 'antd';
import { originalUrl, commonAddress, userOrder, } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import Img from '../../../../statistics/img1.png';
import { changeMachine } from '../../commonFunction.js';
import { getCookie } from '../../../../helpers/cookies.js';
import history from '../../../common/history.js';
import '../../style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();
class DispatchService extends Component{
	constructor(props) {
	    super(props);
			console.log('this.props:',this.props)
			this.state = {
				user_id: '',
				data: [],                //地址薄数据
				selectForm: {
					user_id: '',          					//账户id
					origin: '',    					//起点
					destination: '',        //终点
					consignee: '',           //收货人
					contact: '',             //联系方式
					price: '9.98 RMB',       //运费
				},
			}
	}
	render(){
		const { id, selectForm, data } = this.state;
		return(
		<div id="dispatchService">
			<div className="header">
				<div className="title">
					<span>配送服务</span>
				</div>
			</div>
			<div className="main">
				<div className="left">
					<table className="table">
						<thead></thead>
						<tbody>
							<tr>
								<td style={{marginRight:20}}>起始位置:</td>
								<td>
									<Input id='tipinput' className="input" value={selectForm.origin} onChange={(ev)=>{this.origin(ev)}}/>
									{/* <Input className="input" value={selectForm.origin} onChange={(ev)=>{this.origin(ev)}}></Input> */}
								</td>
							</tr>
							<tr>
								<td style={{marginRight:20}}>地址薄:</td>
								<td>
									<select className="select" value={selectForm.destination} onChange={(ev)=>{this.destination(ev)}}>
										<option key="0" value=''></option>
										{
											data.map((item)=>{
												return <option  key={item.id} value={item.id}>{item.address}</option>
											})
										}
									</select>
								</td>
							</tr>
							<tr>
								<td className="title" style={{marginRight:20}}>运费:</td>
								<td>
									{selectForm.price}
								</td>
							</tr>
							<tr>
								<td colSpan="2">
									<Popconfirm title="确认下单？" onConfirm={()=>{this.submit()}}>
										<Button type="primary" className="button" style={{width: '80%'}}>下单</Button>
									</Popconfirm>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="right">
					<div style={{width: '100%', height: '100%'}}>
						<div id="container" style={{width: "100%",height: '100%'}}></div>
						<div id="panel" 
							style={{position: 'fixed',backgroundColor: 'white',overflowY:'auto',
							top:20,right:10,width:250, maxHeight: '90%',
						}}></div>
					</div>
				</div>
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
			</div>
		</div>
		)
	}
	componentDidMount(){
		this.init()
	}
	
	// 函数区 取地址薄数据
	init = ()=>{
		//eslint-disable-next-line
		var map = new AMap.Map("container", {
				resizeEnable: true
		});
		map.plugin('AMap.Autocomplete', function() {
			//eslint-disable-next-line no-undef
			var auto = new AMap.Autocomplete({
			    input: "tipinput"
			});
			map.plugin('AMap.PlaceSearch', function() {
				//eslint-disable-next-line no-undef
				var placeSearch = new AMap.PlaceSearch({
						map: map
				});  //构造地点查询类
				//eslint-disable-next-line no-undef
				AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
					function select(e) {
							placeSearch.setCity(e.poi.adcode); // 
							placeSearch.search(e.poi.name);  //关键字查询查询
					}
			})
		})
		const me = this;
		let params = {};
		let url = originalUrl + commonAddress;
		model.fetch(params,url,'get',(res)=>{
			console.log(`用户地址薄数据：`,res.data);
			let data = res.data;
			me.setState({
				data: data, 
			});
		})
	}
	origin = (ev)=>{
		console.log('起点：',ev.target.value);
		let form = {...this.state.selectForm}
		form.origin = ev.target.value;
		this.setState({selectForm: form});
	}
	destination = (ev)=>{
		console.log('ev',ev.target.value)
		let origin = document.getElementById('tipinput').value;
		let destination_id = ev.target.value;
		let form = {...this.state.selectForm}
		form.origin = origin;
		form.destination = destination_id;
		let data = [...this.state.data];
		let filterAddress = data.filter((item)=>{
			return item.id == destination_id;
		})
		console.log('filterAddress:',filterAddress)
		//导航
		//eslint-disable-next-line no-undef
		 var map = new AMap.Map("container", {
					resizeEnable: true,
					center: [121.56290925340559,31.293409795332167],//地图中心点
					zoom: 13 //地图显示的缩放级别
			});
			var transOptions = {
						 map: map,
						 city: '上海市',
						 //eslint-disable-next-line no-undef
						 panel: 'panel',  
								 //eslint-disable-next-line no-undef
						 // policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
				 };
				 //构造公交换乘类
				map.plugin('AMap.Transfer',function(){
					//eslint-disable-next-line no-undef
					var transfer = new AMap.Transfer(transOptions);
					//根据起、终点名称查询公交换乘路线
					transfer.search([
											 {keyword: origin},
											 //第一个元素city缺省时取transOptions的city属性
											 {keyword: filterAddress[0].address}
											 //第二个元素city缺省时取transOptions的cityd属性
					], function(status, result) {
											 // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_TransferResult
											 if (status === 'complete') {
													 message.success('公交路线查询完成')
											 } else {
													 message.error('公交路线查询失败' + result)
											 }
					});
				})
				 
		//将地址数据上传
		for(let item in form){
			for(let key in filterAddress[0]){
				if(item == key){
					form[item] = filterAddress[0][key];
				}
			}
		}
		console.log('form:',form)
		this.setState({selectForm: form});
	}
	submit = ()=>{
		const me = this;
		let form = {...this.state.selectForm};
		let data = [...this.state.data];
		let filter = data.filter((item)=>{
			return item.id == form.destination
		})
		form.destination = filter[0].address;   //因为state中存的是地址薄的id，应该传address,要转换
		let url = originalUrl + userOrder;
		let params = {...form,service_type: 'dispatchService',}
		model.fetch(params,url,'post',(res)=>{
			console.log('下单数据发送')
			console.log(res.data)
			let order_id = res.data;
			message.success('订单创建成功！');
			history.push(`/app/userSide/ordersUser/OrderDetails/${order_id}/`);
		})
	}
}
export default DispatchService;