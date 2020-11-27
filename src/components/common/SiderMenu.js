import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { getCookie, setCookie } from "../../helpers/cookies";
// import store from '../../store';
import { Provider } from 'react-redux';
 const { SubMenu } = Menu;
 const { Content, Sider } = Layout;
 class SiderMenu extends Component{
	 render(){
		 //cookie中取username
		 let name;
		 let type;
		 //cookie不存在重定向到登录界面
		 if (!getCookie("user") || getCookie("user") === "undefined") {
		   return <Redirect to="/login" />
		 } else {
				name = JSON.parse(getCookie("user")).username;
				type = JSON.parse(getCookie("user")).type;
				console.log('type:',type)
				//type 3：admin所有页面 2：运维 1：用户端
		 }
			if(type == 3){
				return(
					<Menu
						mode="inline"
						// defaultSelectedKeys={['1']}
						// defaultOpenKeys={['sub1']}
						style={{ height: 'calc(100% - 3rem)', borderRight: 0 ,marginTop: '3rem'}}
					>
						<SubMenu
							key="sub1"
							title={
								<span>
									<Icon type="android" />
									机器人服务(用户)
								</span>
							}
						>
							<Menu.Item key="1">
											<Link to="/app/userSide/robotServices/DispatchService/">
												<Icon type="up"/>
												配送服务
											</Link>
										</Menu.Item>
										<Menu.Item key="2">
											<Link to="/app/userSide/robotServices/WaitToDevelop/">
												<Icon type="up"/>
												待开发
											</Link>
										</Menu.Item>
						</SubMenu>
						<SubMenu
							key="sub2"
							title={
								<span>
									<Icon type="calendar" />
									订单系统(用户)
								</span>
							}
						>
							<Menu.Item key="3">
								<Link to="/app/userSide/order/">
												<Icon type="up"/>
												订单信息
											</Link>
										</Menu.Item>
						</SubMenu>
						<SubMenu
							key="sub3"
							title={
								<span>
									<Icon type="idcard" />
									个人中心(用户)
								</span>
							}
						>
							<Menu.Item key="4">
								<Link to="/app/userSide/Personal/">
												<Icon type="up"/>
											个人信息管理
											</Link>
							</Menu.Item>
						</SubMenu>
						<SubMenu
							key="sub4"
							title={
								<span>
									<Icon type="setting" />
									机器人管理(运维)
								</span>
							}
						>
							<Menu.Item key="5">
								<Link to="/app/maintain/robotManage/RobotManage">
												<Icon type="up"/>
											机器人管理
											</Link>
										</Menu.Item>
										<Menu.Item key="6">
											<Link to="/app/maintain/robotManage/RobotMaintain">
												<Icon type="up"/>
											机器人维护
											</Link>
										</Menu.Item>
										<Menu.Item key="7">
											<Link to="/app/maintain/robotManage/RobotTransfer">
												<Icon type="up"/>
												机器人调拨
											</Link>
										</Menu.Item>
						</SubMenu>
									<SubMenu
										key="sub5"
										title={
											<span>
												<Icon type="appstore"/>
												订单系统(运维)
											</span>
										}
										>
										<Menu.Item key="8">
											<Link to="/app/maintain/ordersAdmin/OrdersRecord/">
												<Icon type="up"/>
											订单记录
											</Link>
										</Menu.Item>
									</SubMenu>
									<SubMenu
										key="sub6"
										title={
											<span>
												<Icon type="idcard"/>
												账户信息(admin)
											</span>
										}
										>
										<Menu.Item key="9">
											<Link to="/app/backstage/informationAdmin/AccountInformation/">
											<Icon type="up"/>
											账户信息
											</Link>
										</Menu.Item>
									</SubMenu>
									<SubMenu
										key="sub7"
										title={
											<span>
												<Icon type="money-collect" />
												财务信息系统
											</span>
										}
									>
										<Menu.Item key="10">
											<Link to="/app/backstage/finance/FinanceToday/">
												<Icon type="up"/>
											当日流水
											</Link>
										</Menu.Item>
										<Menu.Item key="11">
											<Link to="/app/backstage/finance/History/">
												<Icon type="up"/>
											财务统计
											</Link>
										</Menu.Item>
									</SubMenu>
					</Menu>
				)
			}else if(type == 2){
				return(
					<Menu
						mode="inline"
						// defaultSelectedKeys={['1']}
						// defaultOpenKeys={['sub1']}
						style={{ height: 'calc(100% - 3rem)', borderRight: 0 ,marginTop: '3rem'}}
					>
						<SubMenu
							key="sub4"
							title={
								<span>
									<Icon type="setting" />
									机器人管理(运维)
								</span>
							}
						>
							<Menu.Item key="5">
								<Link to="/app/maintain/robotManage/RobotManage">
												<Icon type="up"/>
											机器人管理
											</Link>
										</Menu.Item>
										<Menu.Item key="6">
											<Link to="/app/maintain/robotManage/RobotMaintain">
												<Icon type="up"/>
											机器人维护
											</Link>
										</Menu.Item>
										<Menu.Item key="7">
											<Link to="/app/maintain/robotManage/RobotTransfer">
												<Icon type="up"/>
												机器人调拨
											</Link>
										</Menu.Item>
						</SubMenu>
						<SubMenu
							key="sub5"
							title={
								<span>
									<Icon type="appstore"/>
									订单系统(运维)
								</span>
							}
							>
							<Menu.Item key="8">
								<Link to="/app/maintain/ordersAdmin/OrdersRecord/">
									<Icon type="up"/>
								订单记录
								</Link>
							</Menu.Item>
						</SubMenu>
					</Menu>
				)
			}else{
				return (
					<Menu
							mode="inline"
							// defaultSelectedKeys={['1']}
							// defaultOpenKeys={['sub1']}
							style={{ height: 'calc(100% - 3rem)', borderRight: 0 ,marginTop: '3rem'}}
						>
							<SubMenu
								key="sub1"
								title={
									<span>
										<Icon type="android" />
										机器人服务(用户)
									</span>
								}
							>
								<Menu.Item key="1">
												<Link to="/app/userSide/robotServices/DispatchService/">
													<Icon type="up"/>
													配送服务
												</Link>
											</Menu.Item>
											<Menu.Item key="2">
												<Link to="/app/userSide/robotServices/WaitToDevelop/">
													<Icon type="up"/>
													待开发
												</Link>
											</Menu.Item>
							</SubMenu>
							<SubMenu
								key="sub2"
								title={
									<span>
										<Icon type="calendar" />
										订单系统(用户)
									</span>
								}
							>
								<Menu.Item key="3">
									<Link to="/app/userSide/order/">
													<Icon type="up"/>
													订单信息
												</Link>
											</Menu.Item>
							</SubMenu>
							<SubMenu
								key="sub3"
								title={
									<span>
										<Icon type="idcard" />
										个人中心(用户)
									</span>
								}
							>
								<Menu.Item key="4">
									<Link to="/app/userSide/Personal/">
													<Icon type="up"/>
												个人信息管理
												</Link>
								</Menu.Item>
							</SubMenu>
						</Menu>
				)
			}
	 }
 }
 export default SiderMenu;
 