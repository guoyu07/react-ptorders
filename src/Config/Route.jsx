import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';

import IndexList from '../Component/IndexList'; //首页组件
import shoppingCart from '../Component/shoppingCart'; //购物车
import confirmOrders from '../Component/confirmOrders'; //确认订单
import confirmOrdersSuccess from '../Component/confirmOrdersSuccess'; //订单提交成功
import productRule from '../Component/productRule'; //商品政策
import myTeam from '../Component/myTeam'; //个人团队
import myTeamEdit from '../Component/myTeamEdit'; //编辑团队
import MyMessages from '../Component/MyMessages'; //个人信息
import MyAddress from '../Component/MyAddress'; //收货地址
import MyNewAddress from '../Component/MyNewAddress'; //新增地址
import MyOrders from '../Component/MyOrders'; //订单页
import MyOrdersDetails from '../Component/MyOrdersDetails'; //订单详情页

/**
 * (路由根目录组件，显示当前符合条件的组件)
 * 
 * @class Roots
 * @extends {Component}
 */
class Roots extends Component {
    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}
var history = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;
const RouteConfig = (
    <Router history={history}>
        <Route path="/" component={Roots}>
            <IndexRoute component={IndexList} />//首页
            <Route path="index" component={IndexList} />//首页组件
            <Route path="shoppingcart" component={shoppingCart} />//购物车
            <Route path="confirmorders" component={confirmOrders} />//确认订单
            <Route path="confirmorderssuccess" component={confirmOrdersSuccess} />//订单提交成功
            <Route path="productrule" component={productRule} />//商品政策
            <Route path="myteam" component={myTeam} />//个人团队
            <Route path="myteamedit" component={myTeamEdit} />//编辑团队
            <Route path="mymessages" component={MyMessages} />//个人信息
            <Route path="myaddress" component={MyAddress} />//收货地址
            <Route path="mynewaddress" component={MyNewAddress} />//新增地址
            <Route path="myorders" component={MyOrders} /> //订单页
            <Route path="myordersdetails" component={MyOrdersDetails} />//订单详情页
        </Route>
    </Router>
);

export default RouteConfig;