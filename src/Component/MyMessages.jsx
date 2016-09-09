import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {DataLoad, DataNull, Header, TipMsgSignin, Footer, GetData, UserHeadImg} from './common/Index';

/**
 * 模块入口
 * 
 * @class Main
 * @extends {Component}
 */
class Main extends Component {
    constructor(props){
        super(props);
    }
    render() {  
      console.log(this.props)
        return (
            <div className='Message_container'>
               <Header nav logo/>
               <div className='my_inform'>
                   <div className='my_pic'></div>
                   <div className='my_list'>
                       <p>某某某&emsp;<span></span></p>
                       <p>授权编号：pt2222222222</p>
                   </div>
               </div>
               <ul className='inform_num clear'>
                   <li>
                       <p className='inform_num_name'>订单量</p>
                       <p className='inform_num_style'>9999</p>
                       <span></span>
                   </li>
                   <li>
                       <p className='inform_num_name'>账户余额</p>
                       <p className='inform_num_style'>100000</p>
                       <span></span>
                   </li>
                   <li>
                        <p className='inform_num_name'>保证金</p>
                        <p className='inform_num_style'>100000</p>
                   </li>
               </ul>
               <div className='inform_link'>
                   <Link to='/my/orders' className='link_style my_order'>
                        我的订单
                        <span></span>
                   </Link>
                   <Link to='/my/address' className='link_style my_address'>
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
    component: Main //, //接收数据的组件入口
    // url: '/api/v1/messages', //服务器请求的地址
    // stop: (props, state) => {
    //     return !Boolean(props.User); //true 拦截请求，false不拦截请求
    // },
    // data: (props, state) => { //发送给服务器的数据
    //     return { accesstoken: props.User.accesstoken }
    // },
    // success: (state) => { return state; }, //请求成功后执行的方法
    // error: (state) => { return state } //请求失败后执行的方法
});
