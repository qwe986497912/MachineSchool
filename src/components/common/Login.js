import React, { Component } from 'react';
import {setCookie,getCookie} from "../../helpers/cookies";
import { originalUrl, login } from '../../dataModule/UrlList';
import axios from 'axios';
import { Model } from '../../dataModule/testBone.js';
import history from './history.js';
import '../../style/login.less';
import { Form, Icon, Input, Button, Checkbox, message, Spin } from 'antd';
const FormItem = Form.Item;
const model = new Model();
const users = [];
function PatchUser(values) {  //匹配用户
		    const {username, password} = values;
				const { users } = this.state;
		    return users.find(user => user.username === username && user.password === password);
		}


class NormalLoginForm extends Component {
    state = {
        isLoding:false,
				users: [
					
				],
    };
		componentDidMount(){
			console.log('挂载');
			let cookie = getCookie('user');
			console.log('cookie:',cookie)
		}
    handleSubmit = (e) => {
			const me = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
					if (!err) {
						console.log('Received values of operation: ', values);
						let username = values['username'];
						let password = values['password'];
						let params = {username:username,password:password};
						console.log('params:',params);
						let url = originalUrl + login;
						model.fetch(params,url,'post',(res)=>{
							console.log('账户信息：',res.data);
							let data = res.data;
							//将后台返回的账号信息进行存储
							if(data.state){
								console.log('true')
								setCookie('user',{...data,username:values.username});
								me.setState({
										isLoding: true,
								});
								message.success('login successed!'); //成功信息
								setTimeout(function() { //延迟进入
								let cookie = JSON.parse(getCookie('user'));
								console.log('cookie延迟进入:',getCookie('user'))
									history.push('/app/');
								}, 2000);
							 }else{
								 message.error('login failed!'); //失败信息
							 }
						})
           }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            this.state.isLoding?<Spin size="large" className="loading" />:
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <div className="login-name" style={{textAlign:'center',color:'#fff',fontSize:'24px',fontWeight:'bold',letterSpacing:'8px'}}>智慧校园管理系统</div>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '428px'}}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名 (admin)" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码 (admin)" />
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:'0'}}>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox style={{color:'#fff',fontWeight:'bold'}}>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" href="" style={{float:'right',color:'#fff',fontWeight:'bold'}}>忘记密码?</a>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                    {/* <a className="githubUrl" href={`${authorize_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}`}> </a> */}
                </div>
            </div>
        );
    }
}

const Login = Form.create()(NormalLoginForm);
export default Login;
