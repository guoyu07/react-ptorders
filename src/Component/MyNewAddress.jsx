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
            <div>
                <OrderHead back title='收货地址' complete/>
                <ul className='new_address'>
                    <li>
                        <span>收货人:</span>
                        <input type='text' placeholder='姓名'/>
                    </li>
                    <li>
                        <span>联系电话:</span>
                        <input type='text' placeholder='请输入手机号码'/>
                    </li>
                    <li>
                        <span>所在地区:</span>
                        <input type='text' placeholder='请选择所在区域'/>
                    </li>
                    <li>
                        <span>详细地址:</span>
                        <input type='text' placeholder='请填写详细地址'/>
                    </li>
                </ul>
                <footer className='set_default'>设为默认<span></span></footer>
            </div>
        );
    }
}


export default GetNextPage({
    id: 'MyNewAddress',  //应用关联使用的redux
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
