import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {OrderHead,OrderFoot, DataLoad, Footer, UserHeadImg, TabIcon, GetNextPage} from './common/Index';



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
            <ul className="shoppingcart_list">
                {
                    this.props.list.map((item, index) => {
                        return <ListItem chooseIcon key={index} {...item}/>
                    })
                }{/*等到获取数据后使用，现在不用*/}
            </ul>
        );
    }
}

/**
 * (失效商品循环列表)
 * 
 * @class Disabled
 * @extends {Component}
 */


class Disabled extends Component {
    render() {
        console.log(this.props)
        return (
            <div className='disabled'>
                <h1 className='disabled_header'>失效商品</h1>
                <ul className="index_list">
                    {
                        this.props.list.map((item, index) => {
                            return <ListItem deleteIcon key={index} {...item}/>
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
        let src = '../images/tu.png';
        if (chooseIcon) {
            chooseIcon = (<span className='back_img'></span>)
        }

        if (deleteIcon) {
            deleteIcon = (<span className='delete_prodcut right'></span>)
        }
        return (
            <li className='shoppingcart_item clear'>
                <div className='item_left'>
                    <span className='item_left_choose'>{chooseIcon}</span>
                    <span className='item_left_img'></span>
                </div>
                <div className='item_right'>
                    <p className='clear'>葡萄探索号{deleteIcon}</p>
                    <p>颜色:塔塔紫</p>
                    <p className='clear'>¥ 999999.99/<i>箱</i><span className='right item_number'>X1000</span></p>
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
        var {data,disabled ,loadAnimation, loadMsg} = this.props.state;
        var tab = this.props.location.query.tab || 'all';
        data = [1,1,1];
        disabled = [1]
        return (
            <div className='shoppingcart_container'>
                <OrderHead backToIndex edit title='购物车'/>
               {
                    data.length > 0 ? <List list={data} /> : null
                }{/*此处应判断大于0，但还没有接口，所以先用－1代替*/}
                {
                    disabled.length > 0 ? <Disabled list={disabled}  /> : null
                }{/*失效商品*/}
              <OrderFoot content='去结算(20)' chooseAll transToConfirmorders/>
            </div>
        );
    }
}


export default GetNextPage({
    id: 'shoppingcart',  //应用关联使用的redux
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
