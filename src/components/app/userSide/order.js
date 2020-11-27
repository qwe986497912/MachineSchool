import React,{Component} from 'react';
import { Tabs } from 'antd';
import CurrentOrders from './ordersUser/CurrentOrders.js';
import HistoryOrders from './ordersUser/HistoryOrders.js';

const { TabPane } = Tabs;
function callback(key){
		console.log(key);
	}
class Order extends Component{
	constructor(){
		super();
	}
	render(){
		return(
			<Tabs defaultActiveKey="1" onChange={callback}>
				<TabPane tab="当前订单" key="1">
					<CurrentOrders/>
				</TabPane>
				<TabPane tab="历史订单" key="2">
					<HistoryOrders/>
				</TabPane>
			</Tabs>
		);
	}
} 
export default Order;