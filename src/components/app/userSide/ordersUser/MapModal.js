import React,{Component} from "react";
import ReactDOM from "react-dom";
import { message } from 'antd';
class MapModal extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			addressData: [],
			depart: [],
			dest: [],
		}
	}
  render() {
		console.log('render:props:',this.props)
    return (
			<div style={{width: '100%', height: '100%'}}>
				<div id="container" style={{width: "100%",height: '100%'}}></div>
			</div>
		)
  }
	componentDidMount(){
		let props = this.props;
		this.setState({
			addressData: props.addressData,
			depart: props.depart,
			dest: props.dest,
		})
		this.init();
	}
	// componentWillReceiveProps = (nextProps) => {
	// 	console.log('nextProps:',nextProps)
	// 	console.log(nextProps.addressData)
	// 	this.setState({
	// 		addressData: props.addressData,
	// 		depart: props.depart,
	// 		dest: props.dest,
	// 	})
	// 	 this.init(nextProps.addressData,nextProps.depart,nextProps.dest);
	// }
	init = ()=>{
		const me = this;
	// eslint-disable-next-line no-undef
		var map = new AMap.Map("container", {
				resizeEnable: true,
				center: this.state.depart,//地图中心点 以起点作为
				zoom: 13 //地图显示的缩放级别
		});
		//导航
			map.plugin('AMap.Riding', function() {
				//eslint-disable-next-line no-undef
				var riding = new AMap.Riding({
						map: map,
				}); 
				riding.search(
						this.state.depart,
						this.state.dest
				, function(status, result) {
						// result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
						if (status === 'complete') {
								message.success('绘制步行路线完成')
						} else {
								message.error('步行路线数据查询失败' + result)
						} 
				});
			})
				var marker, lineArr = this.state.addressData;
				//eslint-disable-next-line no-undef
				marker = new AMap.Marker({
						map: map,
						position: this.state.depart, //起点
						icon: "https://webapi.amap.com/images/car.png",
						//eslint-disable-next-line no-undef
						offset: new AMap.Pixel(-26, -13),
						autoRotation: true,
						angle:-90,
				});
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
}
export default MapModal;

