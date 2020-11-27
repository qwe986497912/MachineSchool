import React,{Component} from 'react';
import { Button, Popconfirm, message } from 'antd';
import { originalUrl, orderForm, robotLocation, userOrder } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import { changeOrder } from '../../commonFunction.js';
import history from '../../../common/history.js';
import { Map,Marker } from 'react-amap';
import MapModal from './MapModal.js';
import Dest from '../../../../statistics/终点.png';
import Depart from '../../../../statistics/起点.png';
import '../../style.less';
const model = new Model();

class OrderDetails extends Component{
	constructor(props){
		super(props);
		this.state = {
			orderId: '',       //订单id
			data: {
				origin: '',      //起始点
				destination: '', //终点
				price: '',       //运费
				consignee: '',     //收货人
				contact: '',       //联系方式
				robot_num: '',     //配送机器人
				state2: '',       //订单配送状态 state2 0 1 2 等待 中 完成   
			},
			//实时位置信息
			addressData:[
				
			],
			depart: [],
			dest: [],
		}
	}
	render(){
		const { data, addressData, depart, dest, zoom } = this.state;
		return(
			<div id="orderDetails">
				<div className="header">
					<h2 style={{float: 'left'}}>订单编号:{this.props.match.params.orderId}</h2>
					<Button style={{float: 'right'}} type="primary" onClick={()=>{this.handlePush()}}>返回</Button>
				</div>
				<div className="main">
					<div className="left">
						<table className="table">
							<thead></thead>
							<tbody>
								<tr>
									<td><span>起始点:</span></td>
									<td><span>{data.origin}</span></td>
								</tr>
								<tr>
									<td><span>终点:</span></td>
									<td><span>{data.destination}</span></td>
								</tr>
								<tr>
									<td><span>运费:</span></td>
									<td><span>{data.price}</span></td>
								</tr>
								<tr>
									<td><span>收货人:</span></td>
									<td><span>{data.consignee}</span></td>
								</tr>
								<tr>
									<td><span>联系方式:</span></td>
									<td><span>{data.contact}</span></td>
								</tr>
								<tr>
									<td><span>配送机器人:</span></td>
									<td><span>{data.robot_num}</span></td>
								</tr>
								<tr>
									<td><span>订单状态:</span></td>
									<td><span>{data.state2}</span></td>
								</tr>
								<tr>
									<td>
										<Popconfirm title="确认取消？" onConfirm={()=>{this.cancel()}}>
											<Button type="primary">取消订单</Button>
										</Popconfirm>
									</td>
									<td>
										<Popconfirm title="确认送达？" onConfirm={()=>{this.confirmArrive()}}>
											<Button type="primary">确认送达</Button>
										</Popconfirm>
									</td>
								</tr>
							</tbody>
							<tfoot></tfoot>
						</table>
					</div>
					<div className="right">
						<div style={{width: '100%', height: '100%'}}>
							<div id="container" style={{width: "100%",height: '100%'}}></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	componentDidMount(){
		this.init();
	}
	address = (location)=>{
			console.log('执行导航')
			console.log('location:',location[1])
			const me = this;
			// eslint-disable-next-line no-undef
				var map = new AMap.Map("container", {
						resizeEnable: true,
						center: [116.480885,39.989371],//地图中心点 以起点作为
						zoom: 22 //地图显示的缩放级别
				});
				// //导航
				// 	map.plugin('AMap.Riding', function() {
				// 		//eslint-disable-next-line no-undef
				// 		var riding = new AMap.Riding({
				// 				map: map,
				// 		}); 
				// 		riding.search(
				// 				[116.480885,39.989371],
				// 				[116.483381,39.987574]
				// 		, function(status, result) {
				// 				// result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
				// 				if (status === 'complete') {
				// 						message.success('绘制步行路线完成')
				// 				} else {
				// 						message.error('步行路线数据查询失败' + result)
				// 				} 
				// 		});
				// 	})
						var marker,marker1,marker2, lineArr = location;
						//eslint-disable-next-line no-undef
						marker = new AMap.Marker({
								map: map,
								position: [116.480885,39.989371], //起点
								icon: "https://webapi.amap.com/images/car.png",
								//eslint-disable-next-line no-undef
								offset: new AMap.Pixel(-26, -13),
								autoRotation: true,
								angle:-90,
						});
						//eslint-disable-next-line no-undef
						marker1 = new AMap.Marker({
								map: map,
								position: [116.480885,39.989371], //起点
								icon: Depart,
								// content: '起',
								//eslint-disable-next-line no-undef
								offset: new AMap.Pixel(-26, -13),
								autoRotation: true,
								angle:-90,
						});
						//eslint-disable-next-line no-undef
						marker2 = new AMap.Marker({
								map: map,
								position: [116.483381,39.987574], //终点
								icon: Dest,
								// content: '终',
								//eslint-disable-next-line no-undef
								offset: new AMap.Pixel(-26, -13),
								autoRotation: true,
								angle:-90,
						});
						var markerList = [marker, marker1, marker2];
						map.add(markerList);
					// 绘制轨迹
					map.plugin('AMap.Polyline', function() {
						//eslint-disable-next-line no-undef
						var polyline = new AMap.Polyline({
								map: map,
								path: lineArr,
								showDir:true,
								strokeColor: "#28F",  //线颜色
								// strokeOpacity: 1,     //线透明度
								strokeWeight: 6,      //线宽
								// strokeStyle: "solid"  //线样式
						});
							//eslint-disable-next-line no-undef			
						var passedPolyline = new AMap.Polyline({
								map: map,
								// path: lineArr,
								strokeColor: "#AF5",  //线颜色
								// strokeOpacity: 1,     //线透明度
								strokeWeight: 6,      //线宽
								// strokeStyle: "solid"  //线样式
						});
						marker.on('moving', (e)=> {
							 passedPolyline.setPath(e.passedPath);
						});
						 map.setFitView();	
						 marker.moveAlong(lineArr, 300);
					});
					
	}
	init = ()=>{
		let order_id = this.props.match.params.orderId;
		const me = this;
			// let params = {robot_num: robotId,order_id: orderId};
		let url = originalUrl + robotLocation;
		let params = {};
		model.fetch(params,url,'get',(res)=>{
			console.log('位置location数据：',res.data.location);
			let data = res.data.location;
			let location = [];
			for(let i=0;i<data.length;i++){
				let arry = data[i].split(",");
				console.log('arry:',arry)
				location.push(arry);
			}
			let params = {start_time:'',end_time: '',state1: '',order_id:'',robot_num:'',};
			let url = originalUrl + userOrder;
			console.log('order_id:',order_id)
			model.fetch(params,url,'get',(res)=>{
				console.log('该用户订单信息：',res.data);
				let filter = res.data.filter((item)=>{
					return item.id == order_id;
				})
				console.log('dingdan:',filter[0])
				changeOrder(filter);
				me.setState({
					data: filter[0],
				})
			})
			me.address(location)
		})
	}
	//init() 从订单表拿数据
	// init = ()=>{
	// 	const me = this;
	// 	console.log('zhixing')
	// 	let orderId = this.props.match.params.orderId;
	// 	let url = originalUrl + orderForm;
	// 	let params =  {start_time:'',end_time: '',state1: ''};
	// 	model.fetch(params,url,'get',(res)=>{
	// 		let filter = res.data.filter((item)=>{
	// 				return item.id == orderId;
	// 		}
	// 	)
	// 	console.log(`${orderId}订单数据：`,filter);
	// 	//订单转码
	// 	let data = filter[0];
	// 	if(data['state2'] == 0){
	// 		data['state2'] = '等待配送';
	// 	}
	// 	console.log('form:',data);
	// 	let robotId = data.robot_num;  //机器人id
	// 	let dest = data.dest;					//终点
	// 	let depart = data.depart;			//起点
	// 	//请求实时位置数据
	// 	// let params = {robot_num: robotId,order_id: orderId};
	// 	let params = {};
	// 	let url = originalUrl + robotLocation;
	// 	model.fetch(params,url,'get',(res)=>{
	// 			console.log('机器人的实时位置数据：',res.data);
	// 			let data = res.data;
	// 			let addressData = data.location;
	// 			// let addressData = [];
	// 			// for(let i=0;i<data.length;i++){
	// 			// 	addressData.push(data[i].location);
	// 			// }
	// 			// me.address(addressData,depart,dest);
	// 			me.setState({
	// 				// addressData: addressData,
	// 				addressData: addressData,
	// 				dest: dest,
	// 				depart: depart,
	// 			});
	// 		})
	// 	})
	// }
	handlePush = ()=>{
		history.push('/app/userSide/order/');
	}
	cancel = ()=>{
		let orderId = this.props.match.params.orderId;
		const me = this;
		let params = {state1: 0,state2: 3}
		let url = originalUrl + userOrder + orderId + '/';
		model.fetch(params,url,'put',(res)=>{
			console.log(res.data);
			history.push('/app/userSide/order/');
		})
	}
	confirmArrive = ()=>{
		let orderId = this.props.match.params.orderId;
		const me = this;
		let params = {state1: 2,state2: 2}
		let url = originalUrl + userOrder + orderId + '/';
		model.fetch(params,url,'put',(res)=>{
			console.log(res.data);
			history.push('/app/userSide/order/');
		})
	}
}
export default OrderDetails;