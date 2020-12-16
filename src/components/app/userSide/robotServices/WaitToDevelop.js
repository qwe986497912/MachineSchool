import React,{Component} from 'react';
class WaitToDevelop extends Component{
	constructor(){
		super();
	}
	
	render(){
		console.log('renderthis实例:',this)
		return(
			<div>
				<h2>等待开发(用户)</h2>
				<button onClick={this.handleClick1('jack')} value='test'>普通函数</button>
				<button onClick={(ev)=>{this.handleClick2(ev)}} value='test'>箭头函数</button>
			</div>
		);
	}
	//情况一 事件 普通函数 函数定义 普通函数
	handleClick1 = function(ev,name){
		console.log('chufa')
		console.log('click1 this:',this)//属于引用赋值问题，把函数赋值给onclick对象，也就是点击事件触发
		//函数，所以函数的执行对象就成了全局变量， 指向全局变量 == undefiend
		console.log('ev.target:',ev.target)
	}
	//情况二 事件 箭头函数 函数定义 普通函数 能够正确绑定this
	handleClick2 = function(ev){
		console.log('chuafa');
		console.log('click2 this:',this)
	} //采用箭头函数，箭头函数本身没有this指向，他会继承外部的this，此时handleClick2函数this指向这个实例
	//情况三 将函数定义成 箭头函数即可 此时函数内部this指向定义时的外部this环境，也就是实例
}
export default WaitToDevelop;