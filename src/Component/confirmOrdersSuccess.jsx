import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {Header, DataLoad, Footer, UserHeadImg, TabIcon, GetNextPage} from './common/Index';

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
        var {data,loadAnimation, loadMsg} = this.props.state;
        var tab = this.props.location.query.tab || 'all';
        return (
            <div>
               <Header nav logo/>
               <div className='seccess_tip'>
                   <p>恭喜，订单提交成功</p>
                   <p>应付金额： ¥ 999999.99</p>
               </div>
               <div className='pay_tip'>
                   <span className='tip_icon'></span>您选择线下转账，转账完成后请联系管理员审核
               </div>
               <Link to='/my/orders' className='trans_orders'>查看订单</Link>
            </div>
        );
    }
}


export default GetNextPage({
    id: 'confirmOrdersSuccess',  //应用关联使用的redux
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
