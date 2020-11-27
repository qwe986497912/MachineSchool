import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export function change(data){
	console.log('执行change函数')
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i].id;
				if(data[i].status){
					console.log('fd')
					data[i].status = '在产';
				}else{
					console.log('dfd')
					data[i].status = '停产';
				}
			}
			this.setState({
				data: data,
			});
		}
//订单状态转换
	export function changeOrder(data){
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i]['id'];
			data[i]['create_time'] = moment(data[i]['create_time']).format('YYYY-MM-DD HH:mm:ss')
			
			if(data[i].state2 == 0){
				data[i].state2 = '等待配送';
			}
			if(data[i].state2 == 2){
				data[i].state2 = '配送完成';
			}
			if(data[i].state2 == 1){
				data[i].state2 = '配送中';
			}
			if(data[i].state2 == 3){
				data[i].state2 = '取消配送';
			}
			if(data[i].state1 == 0){
				data[i].state1 = '取消';
			}
			if(data[i].state1 == 1){
				data[i].state1 = '使用中';
			}
			if(data[i].state1 == 2){
				data[i].state1 = '完成';
			}
		}
		return data;
	}
	//机器人管理 状态转换
	export function changeMachine(data){
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i]['id'];
			if(data[i].maintain_state == 0){
				data[i].maintain_state = '等待维护';
			}
			if(data[i].maintain_state == 1){
				data[i].maintain_state = '维护中';
			}
			if(data[i].maintain_state == 2){
				data[i].maintain_state = '维护完成';
			}
			if(data[i].maintain_state == 3){
				data[i].maintain_state = '维护失败，设备报废';
			}
			if(data[i].state2 == '0'){
				data[i].state2 = '正常';
			}//必须分下来写，比较神奇
			if(data[i].state1 == '0'){
				data[i].state1 = '空闲';
			}
			if(data[i].state1 == 1){
				data[i].state1 = '使用中';
			}
			if(data[i].state2 == 1){
				data[i].state2 = '维护中';
			}else if(data[i].state2 == '2'){
				data[i].state2 = '损坏';
			}else if(data[i].state2 == '3'){
				data[i].state2 = '报废';
			}
		}
		return data;
	}
	//机器人管理 反解码 汉字=》数字
	export function machineChange(data){
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i]['id'];
			if(data[i].state2 == '正常'){
				data[i].state2 = '0';
			}//必须分下来写，比较神奇
			if(data[i].state1 == '空闲'){
				data[i].state1 = '0';
			}
			if(data[i].state1 == '使用中'){
				data[i].state1 = '1';
			}
			if(data[i].state2 == '维护中'){
				data[i].state2 = '1';
			}else if(data[i].state2 == '损坏'){
				data[i].state2 = '2';
			}else if(data[i].state2 == '报废'){
				data[i].state2 = '3';
			}
		}
		return data;
	}
	//机器人管理 筛选出正常且空闲的 state1 ==0 state2 == 0
	export function MachineFilter(data,arry){
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i]['id'];
			if(data[i].state1 == '0' && data[i].state2 == '0'){
				if(data[i].state2 == '0'){
					data[i].state2 = '正常';
				};
				if(data[i].state1 == '0'){
					data[i].state1 = '空闲';
				}
				arry.push(data[i]);
			}
		}
		return arry;
	}
	// 账户信息 权限type转换  123
	export function changeType(data){
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i]['id'];
			if(data[i].type == 1){
				data[i].type = '普通用户';
			}
			if(data[i].type == 2){
				data[i].type = '运维人员';
			}
			if(data[i].type == 3){
				data[i].type = '管理人员';
			}
			if(data[i].sex == 0){
				data[i].sex = '女';
			}
			if(data[i].sex == 1){
				data[i].sex = '男';
			}
		}
		return data;
	}
	// 账户信息 权限转数字
	export function typeChange(data){
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i]['id'];
			if(data[i].type == '普通用户'){
				data[i].type = '1';
			}
			if(data[i].type == '运维人员'){
				data[i].type = '2';
			}
			if(data[i].type == '管理人员'){
				data[i].type = '3';
			}
			if(data[i].sex == '女'){
				data[i].sex = 0;
			}
			if(data[i].sex == '男'){
				data[i].sex = 1;
			}
		}
		return data;
	}