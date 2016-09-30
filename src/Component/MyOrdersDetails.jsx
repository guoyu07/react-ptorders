import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {DataLoad,OrderItem,OrderHead, Footer, GetData} from './common/Index';
import {system} from '../Config/Config';
/**
 * (循环列表)
 * 
 * @class List
 * @extends {Component}
 */

class List extends Component {
    render() {
        var {totalQuantity} = this.props;
        return (
            <div className='detail_container'>
                <header>共计{totalQuantity}箱</header>
                <ul className="detail_list">
                    {
                        this.props.list.map((item, index) => {
                            return <ListItem key={index} {...item} />
                        })
                    }
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
    constructor(props){
        super(props)
    }
    componentDidMount() {
    }
    render() {
        var {icon,price,product_title,price,sku_name,quantity}=this.props;
        return (
            <li className='shoppingcart_item'>
                <div className='item_left'>
                    <img src={icon} className='item_left_img' />
                </div>
                <div className='item_right'>
                    <p className='clear'>{product_title}</p>
                    <p>{sku_name}</p>
                    <p className='clear'>
                        <b>¥ {price}/</b><i>箱</i>
                        <span className='right item_number'>X{quantity}</span>
                    </p>
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
        this.state = {
            order:null, //订单对象
            product:[]  //商品列表
        }
    }
    componentWillMount() {
        var url = window.location.href.split('#')[0];
        if (window.location.href.indexOf('?#') == -1 && system == 'Android') {
            window.location.href = window.location.href.replace(url,url+'?')
        }
        var successFun = (res) => {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appId, // 必填，公众号的唯一标识
                timestamp:res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.nonceStr, // 必填，生成签名的随机串
                signature: res.signature,// 必填，签名，见附录1
                jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }
        var errorFun = (res) => {
            console.log(res)
        } 
        Tool.get('/common/wx/jssdk',{url:url},successFun,errorFun)
    }
    render() {
        var {data, loadAnimation, loadMsg} = this.props.state;
        this.state.order = data&&data.data||{};
        this.state.product = data&&data.data.product||[];
        
        return (
            <div className='order_detail'>
                <OrderHead back title='订单详情'/>
                {
                    this.state.product.length > 0 ? <OrderItem orderDetailPage buy_type='2' {...this.state.order}/>:null

                }
                 {
                    this.state.product.length > 0 ? <List  totalQuantity={this.state.order.totalQuantity} list={this.state.product} /> : null
                }
            </div>
        );
    }
}


export default GetData({
    id: 'MyOrdersDetails',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/order/detail',
    data: (props) => {
        return{
            id:props.location.query.order_id
        }
    },
    success: (state) => { return state; }, //请求成功后执行的方法
    error: (state) => { return state } //请求失败后执行的方法
});
