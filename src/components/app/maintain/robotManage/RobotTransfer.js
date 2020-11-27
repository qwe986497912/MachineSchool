import React,{Component} from 'react';
import { Tabs } from 'antd';
import Transfer from './robotTransfer/RobotTransfer.js';
import TransferRecord from './robotTransfer/RobotTransferRecord.js';

const { TabPane } = Tabs;
function callback(key){
		console.log(key);
	}
class RobotTransfer extends Component{
	constructor(){
		super();
	}
	render(){
		return(
			<Tabs defaultActiveKey="1" onChange={callback}>
				<TabPane tab="机器人调拨" key="1">
					<Transfer/>
				</TabPane>
				<TabPane tab="机器人调拨记录" key="2">
					<TransferRecord/>
				</TabPane>
			</Tabs>
		);
	}
} 
export default RobotTransfer;