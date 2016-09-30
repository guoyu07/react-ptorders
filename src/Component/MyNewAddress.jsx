import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {OrderHead,DataLoad, Footer, GetData} from './common/Index';
import {provs_data,citys_data,dists_data} from '../Config/LAreaData2.js';
import {LArea} from '../Config/LArea.js';


/**
 * (导出组件)
 * 
 * @export
 * @class Main
 * @extends {Component}
 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            realname:'',//姓名
            mobile:'',  //电话
            province_id:'', //省id
            city_id:'', // 城市id
            area_id:'', // 地区id
            address:'', // 地址
            status:0, // 是否为默认
            defaultValue:'', //  从地址页过来的城市地址信息
            cityId:'',  // 从地址页过来的城市地址id
            edit:'', // 判断是否是从地址页过来的编辑地址状态
            id:null  //  地址id
        }
       
        this.handleChange = (name,event) => { //表单的值用状态来控制
            if (name == 'realname') {
              this.setState({realname:event.target.value})
            }
            if (name == 'mobile') {
              this.setState({mobile:event.target.value})
            }
            if (name == 'address') {
              this.setState({address:event.target.value})
            }
            if (name == 'addressId') {
                this.state.defaultValue = event.target.value;
                this.state.cityId = this.refs.myInput.value;
                let address = this.refs.myInput.value.split(',');
                for (var i = 0; i < 3 ; i++) {
                    address[i] = address[i]||0;
                }
                    this.state.province_id=address[0];
                    this.state.city_id=address[1];
                    this.state.area_id=address[2]
            }
        }

        this.changeDefaultAddress = () => { //是否设置为默认地址
            if (this.state.status == 0) {
                this.setState({
                    status:1
                })
            }else{
                this.setState({
                    status:0
                })
            }
        }

        this.addNewAddress = () => { //点击保存时进行简单的判断和发送请求
            if (this.state.realname == '') {
                Tool.alert('用户名不能为空')
            }else if(!(/^\d{11}$/gi).test(this.state.mobile)) {
                Tool.alert('请输入正确的手机号码')
            }else if (Number(this.state.province_id) == 0) {
                Tool.alert('请选择所在区域')
            }else if (this.state.address == '') {
                Tool.alert('请填写详细地址')
            }else{
                if (this.state.edit == 'edit') {
                    Tool.get('/address/update',{province_id:this.state.province_id,city_id:this.state.city_id,area_id:this.state.area_id,address:this.state.address,mobile:this.state.mobile,tel:null,realname:this.state.realname,status:this.state.status,id:this.state.id}, (res) => {
                        if (res.http_code == 200) {
                            Tool.alert('修改地址成功')
                            window.history.back();
                        }else{
                            Tool.alert(res.msg)
                        }
                    }, (err) => {
                        Tool.alert('修改地址失败')
                        console.log('error')
                    })
                }else{
                    Tool.get('/address/add',{province_id:this.state.province_id,city_id:this.state.city_id,area_id:this.state.area_id,address:this.state.address,mobile:this.state.mobile,tel:null,realname:this.state.realname,status:this.state.status}, (res) => {
                        if (res.http_code == 200) {
                            Tool.alert('添加地址成功')
                            window.history.back();
                        }else{
                            Tool.alert(res.msg)
                        }
                    }, (err) => {
                        Tool.alert('添加地址失败')
                        console.log('error')
                    })
                }
            }
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            let inform = nextProps.location.query;
            this.state.realname = inform.realname||'';
            this.state.mobile = inform.mobile||'';
            this.state.province_id = inform.province_id||0;
            this.state.city_id = inform.city_id||0;
            this.state.area_id = inform.area_id||0;
            this.state.address = inform.address||'';
            this.state.edit = inform.edit||'';
            this.state.id = inform.id||'';
            this.state.status = inform.status||0;
            this.state.defaultValue = inform.cityName||'';
            this.state.cityId = this.state.province_id+','+this.state.city_id+','+this.state.area_id;
            
        }     
    }
    componentDidMount() {
        var area = new LArea();//调用插件
        area.init({
            'trigger': '#areaChoose',
            'valueTo': '#cityId',
            'keys': {
                id: 'value',
                name: 'text'
            },
            'type': 2,
            'data': [provs_data, citys_data, dists_data]
        });
    }
    render() {

        return (
            <div>
                <OrderHead back title='收货地址' complete addNewAddress={this.addNewAddress}/>
                <ul className='new_address'>
                    <li>
                        <span>收货人:</span>
                        <input type='text' placeholder='姓名' value={this.state.realname} onChange={this.handleChange.bind(this,'realname')} />
                    </li>
                    <li>
                        <span>联系电话:</span>
                        <input type='text' placeholder='请输入手机号码' value={this.state.mobile}  onChange={this.handleChange.bind(this,'mobile')} />
                    </li>
                    <li  className="content-block">
                        <span>所在地区:</span>
                        <input type='text' placeholder='请选择所在区域' value={this.state.defaultValue} id="areaChoose" readOnly onBlur={this.handleChange.bind(this,'addressId')} />
                        <input id="cityId" ref="myInput" type="hidden" value={this.state.cityId}/>
                    </li>
                    <li>
                        <span>详细地址:</span>
                        <input type='text' placeholder='请填写详细地址' value={this.state.address}  onChange={this.handleChange.bind(this,'address')} />
                    </li>
                </ul>
                <footer className='set_default' onClick={this.changeDefaultAddress}>设为默认<span className={'defaultImg'+this.state.status}></span></footer>
            </div>
        );
    }
}


export default GetData({
    id: 'MyNewAddress',  //应用关联使用的redux
    component: Main
});
