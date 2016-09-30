import React, {Component, PropTypes} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Provider} from 'react-redux';
import route from './Config/Route'; //路由配置
import store from './Config/Store';
import './Config/Config.js';//引入默认配置
import './Style/LArea.css';
import './Style/common.less';
import './Style/head.less';
import './Style/indexList.less';
import './Style/shoppingCart.less';
import './Style/confirmOrders.less';
import './Style/confirmOrdersSuccess.less';
import './Style/myOrders.less';
import './Style/myOrdersDetails.less';
import './Style/myMessage.less';
import './Style/myAddress.less';
import './Style/myNewAddress.less';
import './Style/productRule.less';
import './Style/myTeam.less';
import './Style/myTeamEdit.less';

store.subscribe(function () { //监听state变化
    
});

render(
    <Provider store={store}>
        {route}
    </Provider>,
    document.body.appendChild(document.createElement('div'))
);