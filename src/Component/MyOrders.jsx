import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {Header,OrderItem, DataLoad, Footer, UserHeadImg, TabIcon, GetNextPage} from './common/Index';


/**
 * (循环列表)
 * 
 * @class List
 * @extends {Component}
 */

class List extends Component {
    render() {
        console.log(this.props)
        return (
            <ul className="order_list">
                {
                    this.props.list.map((item, index) => {
                        return <OrderItem key={index} {...item}/>
                    })
                }{/*等到获取数据后使用，现在不用*/}
            </ul>
        );
    }
}


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
        data = [1,1,1,1,1,1,1]
        return (
            <div>
               <Header nav logo/>
                {
                    data.length > 0 ? <List list={data} /> : null
                }{/*此处应判断大于0，但还没有接口，所以先用－1代替*/}
            </div>
        );
    }
}


export default GetNextPage({
    id: 'MyOrders',  //应用关联使用的redux
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
