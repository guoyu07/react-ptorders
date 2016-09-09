import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {DataLoad,OrderItem,OrderHead, Footer, UserHeadImg, TabIcon, GetNextPage} from './common/Index';

/**
 * (循环列表)
 * 
 * @class List
 * @extends {Component}
 */

class List extends Component {
    render() {
        return (
            <div className='detail_container'>
                <header>共计9999箱</header>
                <ul className="detail_list">
                    {
                        this.props.list.map((item, index) => {
                            return <ListItem key={index} {...item}/>
                        })
                    }{/*等到获取数据后使用，现在不用*/}
                </ul>
            </div>
               
        );
    }
}

/**
 * (商品详情)
 * 
 * @class ListItem
 * @extends {Component}
 */
class ListItem extends Component {
    render() {
        let {id, title, author, visit_count, reply_count, create_at, last_reply_at} = this.props;
        return (
            <li className='shoppingcart_item'>
                <div className='item_left'>
                    <span className='item_left_img'></span>
                </div>
                <div className='item_right'>
                    <p className='clear'>葡萄探索号</p>
                    <p>颜色:塔塔紫</p>
                    <p className='clear'><b>¥ 999999.99/</b><i>箱</i><span className='right item_number'>X1000</span></p>
                </div>
            </li>
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
        data = [1,1,1]
        return (
            <div className='order_detail'>
                <OrderHead back title='订单详情'/>
                <OrderItem/>
                 {
                    data.length > 0 ? <List list={data} /> : null
                }{/*此处应判断大于0，但还没有接口，所以先用－1代替*/}
            </div>
        );
    }
}


export default GetNextPage({
    id: 'MyOrdersDetails',  //应用关联使用的redux
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
