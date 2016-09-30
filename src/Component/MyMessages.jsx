import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {DataLoad, Header, Footer, GetData} from './common/Index';

/**
 * 模块入口
 * 
 * @class Main
 * @extends {Component}
 */
class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
          icon:null, // 头像图片
          name:null, // 用户名
          authorize_code:null, // 授权号码
          order_count:0, // 订单数量
          balance:0.00, //账户余额
          deposit:0.00, //保证金
          level_id:1 //葡萄等级
        }
    }
    componentDidMount() {
    }
    render() {  
      let {data} = this.props.state
        if (data&&data.data) {
          data = data.data;
          this.state.icon = data.headimgurl;
          this.state.name = data.realname;
          this.state.authorize_code = data.authorize_code;
          this.state.order_count = data.order_count;
          this.state.balance = data.balance;
          this.state.deposit = data.deposit;
          this.state.level_id = data.level_id;
        }
        return (
            <div className='Message_container'>
               <Header nav logo/>
               <div className='my_inform'>
                   <img src={this.state.icon} className='my_pic' />
                   <div className='my_list'>
                       <p>{this.state.name}&emsp;<span className={'levelstyel level'+this.state.level_id}></span></p>
                       <p>授权编号：{this.state.authorize_code}</p>
                   </div>
               </div>
               <ul className='inform_num clear'>
                   <li>
                       <p className='inform_num_name'>订单量</p>
                       <p className='inform_num_style'>{this.state.order_count}</p>
                       <span></span>
                   </li>
                   <li>
                       <p className='inform_num_name'>账户余额</p>
                       <p className='inform_num_style'>{this.state.balance}</p>
                       <span></span>
                   </li>
                   <li>
                        <p className='inform_num_name'>保证金</p>
                        <p className='inform_num_style'>{this.state.deposit}</p>
                   </li>
               </ul>
               <div className='inform_link'>
                   <Link to='/myorders' className='link_style my_order'>
                        我的订单
                        <span></span>
                   </Link>
                   <Link to='/myaddress' className='link_style my_address'>
                        收货地址
                        <span></span>
                   </Link>
               </div>
            </div>
        );
    }
}


export default GetData({
    id: 'MyMessages',  //应用关联使用的redux
    component: Main , //接收数据的组件入口
    url: '/user/user/personalCenter', //服务器请求的地址
    data: {},
    success: (state) => { return state; }, //请求成功后执行的方法
    error: (state) => { return state } //请求失败后执行的方法
});
