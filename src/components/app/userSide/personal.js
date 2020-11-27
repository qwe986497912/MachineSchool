import React,{Component} from 'react';
import { Tabs } from 'antd';
import PersonalInformation from './informationUser/PersonalInformation.js';
import CommonAddress from './informationUser/CommonAddress.js';

const { TabPane } = Tabs;
function callback(key){
		console.log(key);
	}
class Personal extends Component{
	constructor(){
		super();
	}
	render(){
		return(
			<Tabs defaultActiveKey="1" onChange={callback}>
				<TabPane tab="个人信息" key="1">
					<PersonalInformation/>
				</TabPane>
				<TabPane tab="常用地址" key="2">
					<CommonAddress/>
				</TabPane>
			</Tabs>
		);
	}
} 
export default Personal;