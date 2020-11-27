import React,{Component} from 'react';
import { Tabs } from 'antd';
import Maintain from './robotMaintain/RobotMaintain.js';
import MaintainRecord from './robotMaintain/RobotMainRecord.js';

const { TabPane } = Tabs;
function callback(key){
		console.log(key);
	}
class RobotMaintain extends Component{
	constructor(){
		super();
	}
	render(){
		return(
			<Tabs defaultActiveKey="1" onChange={callback}>
				<TabPane tab="机器人维护" key="1">
					<Maintain/>
				</TabPane>
				<TabPane tab="机器人维护记录" key="2">
					<MaintainRecord/>
				</TabPane>
			</Tabs>
		);
	}
} 
export default RobotMaintain;