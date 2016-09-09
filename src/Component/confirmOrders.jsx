import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {OrderHead,OrderFoot,DataLoad, Footer, UserHeadImg, TabIcon, GetNextPage} from './common/Index';




/**
 * (收货地址)
 * 
 * @class  Address
 * 
 * @extends {Component} 
 */
class Address extends Component {
    render() {
        var setCur = {};
        setCur[this.props.tab] = 'on';
        return (
           <div className='order_address'>
              <p className='clear my_name'>
                  <span className='left'>收货人：某某某</span>
                  <span className='right'>18362136989</span>
              </p>
              <p className='address_detail'>收货地址：上海市闵行区田林路1016号科技绿洲三期十号楼 葡萄科技</p>
           </div>
        );
    }
    shouldComponentUpdate(np) {
        return this.props.tab !== np.tab; //tab和之前的不一致，组件才需要更新，否则不更新，提升性能
    }
}

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
            <div> 
                <header className='all_number'>共计80件</header>
                <ul className="order_list">
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
        let {deleteIcon,chooseIcon, title, author, visit_count, reply_count, create_at, last_reply_at} = this.props;
        return (
            <li className='shoppingcart_item'>
                <div className='item_left'>
                    <span className='item_left_img'></span>
                </div>
                <div className='item_right'>
                    <p className='clear'>葡萄探索号</p>
                    <p>颜色:塔塔紫</p>
                    <p className='clear'>¥ 999999.99/<i>箱</i><span className='right item_number'>X1000</span></p>
                </div>
            </li>
        );
    }
}

/**
 * (支付方式)
 * 
 * @class ListItem
 * @extends {Component}
 */
class Payway extends Component {
    render() {
        return (
            <div className='choose_way'>
                <header>
                    配送方式：&nbsp;<span>商家配送</span>
                </header>
                <div className='choose_way_botttom'>
                    <span>支付方式:</span>
                    <span></span>
                    <span>线上支付</span>
                    <span></span>
                    <span>线下转账</span>
                </div>
            </div>
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
        data = [1,1]
        return (
            <div>
               <OrderHead addAddress backToIndex title='确认订单'/>
               <Address/>
               {
                    data.length > 0 ? <List list={data} /> : null
                }{/*此处应判断大于0，但还没有接口，所以先用－1代替*/}
                <Payway/>
               <OrderFoot content='确认订单' transToSuccess />
            </div>
        );
    }
}


export default GetNextPage({
    id: 'confirmOrders',  //应用关联使用的redux
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
