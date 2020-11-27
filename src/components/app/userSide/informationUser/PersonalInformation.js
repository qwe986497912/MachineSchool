import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select,BackTop, AutoComplete  } from 'antd';
import { originalUrl,userForm } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import Maintain from '../../../../statistics/maintain.png';
import { changeMachine } from '../../commonFunction.js';
import { getCookie } from '../../../../helpers/cookies.js';
import '../../style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { OptionInput } = AutoComplete;
const model = new Model();
// const id = JSON.parse(getCookie('user')).id;
let id;
class PersonalInformation extends Component{
	constructor(props) {
	    super(props);
			console.log('this.props:',this.props)
			this.state = {
				user_id: '',          					//账户id
				form: {
					username: '',    					//用户名
					password: '',             //密码
					sex: '',             			//性别
					phone_number: '',         //联系方式  
					address: '',
					email: '',
				},
				ModalVisible: false,
				ModalForm:{
					username: '',    					//用户名
					password: '',             //密码
					sex: '',             			//性别
					phone_number: '',         //联系方式  
					address: '',
					email: '',
				}
			}
	}
	render(){
		const { form, ModalVisible, ModalForm  } = this.state;
		return(
		<div id="personalInformation">
			<div className="header">
				<div className="title">
					<span>个人信息</span>
					<button className="button" onClick={()=>{this.ModalVisible()}}>编辑</button>
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
				<table className="table">
					<thead></thead>
					<tbody>
						<tr>
							<td className="title" style={{marginRight:20}}>账户名称:</td>
							<td>{form.username}</td>
						</tr>
						<tr>
							<td className="title" style={{marginRight:20}}>密码:</td>
							<td>
								{form.password}
							</td>
						</tr>
						<tr>
							<td className="title" style={{marginRight:20}}>邮箱:</td>
							<td>
								{form.email}
							</td>
						</tr>
						<tr>
							<td className="title" style={{marginRight:20}}>性别:</td>
							<td>
								{form.sex}
							</td>
						</tr>
						<tr>
							<td className="title" style={{marginRight:20}}>联系方式:</td>
							<td>
								{form.phone_number}
							</td>
						</tr>
						<tr>
							<td className="title" style={{marginRight:20}}>地址:</td>
							<td>
								{form.address}
							</td>
						</tr>
					</tbody>
				</table>
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
			</div>
			<div className="modify">
				<Modal
					title="账户信息编辑"
					visible={ModalVisible}
					onOk={this.handleModalOk}
					onCancel={this.handleModalCancel}
				>
					<table className="table">
						<thead></thead>
						<tbody>
							<tr>
								<td>用户名:</td>
								<td>
									<Input style={{width: '100%',height:'100%'}} value={ModalForm.username} onChange={(ev)=>{this.ModalChange(ev,'username')}}/>
								</td>
							</tr>
							<tr>
								<td>密码:</td>
								<td>
									<Input style={{width: '100%',height:'100%'}} value={ModalForm.password} onChange={(ev)=>{this.ModalChange(ev,'password')}}/>
								</td>
							</tr>
							<tr>
								<td>邮箱:</td>
								<td>
									<Input style={{width: '100%',height:'100%'}} value={ModalForm.email} onChange={(ev)=>{this.ModalChange(ev,'email')}}/>
								</td>
							</tr>
							<tr>
								<td>性别:</td>
								<td>
									<select style={{height:29,width:198,padding: '4px 11px',border: '1px solid #d9d9d9',borderRadius: 4}} className="select" value={ModalForm.sex} onChange={(ev)=>{this.ModalChange(ev,'sex')}}>
										<option value='0'>女</option>
										<option value='1'>男</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>联系方式:</td>
								<td>
									<Input style={{width: '100%',height:'100%'}} value={ModalForm.phone_number} onChange={(ev)=>{this.ModalChange(ev,'phone_number')}}/>
								</td>
							</tr>
							<tr>
								<td>地址:</td>
								<td>
									<Input style={{width: '100%',height:'100%'}} value={ModalForm.address} onChange={(ev)=>{this.ModalChange(ev,'address')}}/>
								</td>
							</tr>
						</tbody>
					</table>
				</Modal>
			</div>
		</div>
		)
	}
	componentDidMount(){
		this.init()
	}
	// 函数区
	init = ()=>{
		const me = this;
		let params = {};
		let url = originalUrl + userForm;
		model.fetch(params,url,'get',(res)=>{
			console.log(`账户信息res.data:`,res.data);
			let data = res.data;
			if(data['sex'] == 0){
				data.sex = '女';
			}else{
				data.sex = '男';
			}
			console.log('data:',data)
			me.setState({user_id: data.id,form: data});
		})
	}
	
		//弹框函数区域 个人信息编辑
		ModalVisible = ()=>{
			let form = {...this.state.form};
			if(form.sex == '女'){
				form.sex = 0;
			}else{
				form.sex = 1;
			}
			this.setState({
				ModalForm: form,
				ModalVisible: true,
			})
		}
		ModalChange = (ev,key)=>{
			let form = {...this.state.ModalForm};
			for(let item in form){
				if(item === key){
					form[item] = ev.target.value;
					this.setState({ModalForm: form});
				}
			}
		}
		handleModalOk = e => {
			// let id = this.state.id;
			let form = {...this.state.ModalForm};
			const me = this;
			let params = form;
			let url = originalUrl + userForm;
			model.fetch(params,url,'put',(res)=>{
				console.log('编辑个人信息发送：',res.data);
				let Form = {...this.state.form};
				//数据清空,方便下次填写 新增主机表
				for(let item in Form){
					Form[item] = '';
				}
				me.setState({
					form: Form,
					ModalVisible: false,
				});
				me.init();
			})
		};
		handleModalCancel = e => {
			//数据清空,方便下次填写 新增主机表
			let Form = {...this.state.data};
			for(let item in Form){
					Form[item] = '';
			}
			this.setState({
				ModalVisible: false,
				ModalForm: Form,
			});
			this.init();
		};
	}
export default PersonalInformation;