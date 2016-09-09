import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {OrderHead,DataLoad, Footer, UserHeadImg, TabIcon, GetNextPage} from './common/Index';




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
    }
    render() {
        var {data, loadAnimation, loadMsg} = this.props.state;
        var tab = this.props.location.query.tab || 'all';
        return (
            <div className="index-list-box">
               <OrderHead back title='收货地址' save/>
               <ul className='add_member'>
                   <li className='member_name'>
                       <span>姓名：</span>
                       <input type='text' placeholder='请输入姓名' />
                   </li>
                   <li className='member_phone'>
                       <span>手机号：</span>
                       <input type='text' placeholder='请输入电话号码'/>
                   </li>
                   <li className='member_weixin'>
                       <span>微信号：</span>
                       <input type='text' placeholder='请填写微信号'/>
                   </li>
                   <li className='member_level'>
                       <span>分销级别：</span>
                       <div className='choose_level clear'>
                           <div className='active_level'>金葡萄</div>
                           <div>银葡萄</div>
                           <div>葡萄</div>
                       </div>
                   </li>
                   <li className='member_certificate'>
                       <span>身份证号：</span>
                       <input type='text' placeholder='请填写新增分销商身份证号'/>
                   </li>
                   <li className='member_state'>
                       <span>状态：</span>
                       <div className='start_use'>启用</div>
                       <div className='stop_use'>停用</div>
                   </li>
               </ul>
            </div>
        );
    }
}


export default GetNextPage({
    id: 'myTeamEdit',  //应用关联使用的redux
    component: Main//, //接收数据的组件入口
    // url: '/api/v1/topics',
    // data: (props, state) => { //发送给服务器的数据
    //     var {page, limit, mdrender} = state;
    //     return {
    //         tab: props.location.query.tab || 'all',
    //         page,
    //         limit,
    //         mdrender
    //     }
    // },
    // success: (state) => { return state; }, //请求成功后执行的方法
    // error: (state) => { return state } //请求失败后执行的方法
});
