import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {Header, GetNextPage,Footer} from './common/Index';


/**
 * (循环列表)
 * 
 * @class List
 * @extends {Component}
 */
class List extends Component {
    render() {
        return (
            <ul className="index_list">
                {
                    this.props.list.map((item, index) => {
                        return <ListItem key={index} {...item} buy />
                    })
                }{/*等到获取数据后使用，现在不用*/}
            </ul>
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
    constructor(props) {
        super(props);
        this.state = {
            showHide:'none'
        }
        this.showDetail = () => {
            if (this.state.showHide == 'none') {
                this.setState({
                    showHide:'block'
                })
            }else{
                this.setState({
                    showHide:'none'
                })
            }
        }
    }
    render() {
        let {apply,check,buy,id, title, author, visit_count, reply_count, create_at, last_reply_at} = this.props;
        if (apply) {
            apply = (<span className='product_apply'>申请</span>)
        }
        if (check) {
            check = (<span className='waitForCheck'>待审核</span>)
        }
        if (buy) {
            buy = (<span onClick={this.showDetail} className='addToBuyCart'></span>)
        }
        return (
            <li className='list_item clear' onClick={this.showNav}>
               <div className='item_img left'>
                   {/*<img src={src} alt='商品图片'/>*/}
               </div>
               <div className='item_details left'>
                    <header className='item_name'>葡萄探索号</header>
                    <div className='item_price'>
                        <span>建议售价：</span>
                        <span>¥ 99.00</span>
                    </div>
                    <div className='item_price'>
                        <span>规&emsp;&emsp;格：</span>
                        <span>10套/箱</span>
                    </div>
                    <div className='item_price'>
                        <span>原&emsp;&emsp;价：</span>
                        <span className='item_delete'>
                            <i></i><span>¥ 48990.00/箱</span>
                        </span>
                    </div>
                    <div className='real_price'>
                        ¥ 3890.50/箱 <span>(6.5折)</span>
                    </div>
                    <div className='add_cart clear'>
                        {apply}
                        {check}
                        {buy}
                    </div>
               </div>
               <Footer price='¥3890.05 / 箱' gotoPay reduceAdd alert showFun={this.showDetail} show={this.state.showHide}/>
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
        this.showNav = () => {
            alert(1)
        }
    }
    render() {
        var {data, loadAnimation, loadMsg} = this.props.state;
        //data为获取的数据
        data=[1,1,1];   
        console.log(this.props)     
        return (
            <div className="index_list_container">
                <Header nav logo myMessage shoppingCart/>
                {
                    data.length > 0 ? <List list={data} /> : null
                }{/*此处应判断大于0，但还没有接口，所以先用－1代替*/}
               
            </div>
        );
    }
}


export default GetNextPage({
    id: 'IndexList',  //应用关联使用的redux
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
