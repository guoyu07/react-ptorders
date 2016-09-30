import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory,History, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {OrderHead,OrderFoot,DataLoad, Footer, GetData} from './common/Index';
import {system} from '../Config/Config';



/**
 * (收货地址)
 * 
 * @class  Address
 * 
 * @extends {Component} 
 */
class Address extends Component { //地址信息
    constructor(props){
        super(props);
        this.state = {
            addressId:this.props.id  //地址ID
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            this.state.addressId = nextProps.id;
        }     
    }
    render() {
        let {name , phone ,address ,id} = this.props;
        return (
           <div className='order_address'>
              <p className='clear my_name'>
                  <span className='left'>收货人：{name}</span>
                  <span className='right order_phone'>{phone}</span>
              </p>
              <p className='address_detail'>收货地址：{address}</p>
           </div>
        );
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
        let {total_quantity} = this.props;
        return (
            <div> 
                <header className='all_number'>共计{total_quantity}件</header>
                <ul className="confirm_order_list">
                    {
                        this.props.list.map((item, index) => {
                            return <ListItem key={index} {...item}/>
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
    render() {
        let {icon,order_price,price,product_no,product_title,quantity,sku_id,sku_name,useful} = this.props;
        
        return (
            <li className='shoppingcart_item'>
                <div className='item_left'>
                    <img src={icon} className='item_left_img' />
                </div>
                <div className='item_right'>
                    <p className='clear'>{product_title}</p>
                    <p>{sku_name}</p>
                    <p className='clear'>¥ {price}/<i>箱</i><span className='right item_number'>X{quantity}</span></p>
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
    constructor(props){
        super(props);
        this.state = {
            pay_way:false  //支付方式，默认线上支付//临时改成线下支付false
        }
        this.changeway = (type,num) => {//选择付款方式，并将地址id传给父组件
            this.setState({
                pay_way:type
            })
            this.props.changePayType(num)
        }
    }
    render() {
        let {pay_type,changePayType} = this.props;

        return (
            <div className='choose_way'>
                <header>
                    配送方式：&nbsp;<span>商家配送</span>
                </header>
                <div className='choose_way_botttom'>
                    <span>支付方式:</span>
                    <span style={{display:'none'}} className={this.state.pay_way==true?'choosed':'notChoosed'} onClick={this.changeway.bind(this,true,5)}></span>
                    <span style={{display:'none'}}>在线支付</span>
                    <span className={!this.state.pay_way ==true?'choosed':'notChoosed'} onClick={this.changeway.bind(this,false,7)}></span>
                    <span>线下支付</span>
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
        this.state = {
            address:{},  //地址对象
            products:[],  // 商品列表
            totalNum:0,   // 商品总数
            addressId:null,  // 地址ID
            payType:7,    //当前选择的购买方式/默认线下支付（临时）
            pay_type:{},  // 默认的购买方式
            buy_type:1,  //  付款方式
            sku_id:'' , // 商品id
            totalMoney:0,  // 总归的价钱
            addressState:'hasAddress',  //是否选中地址，如果没有地址，弹出提示框
            fromAddress:''  //判断是否从地址页面跳转过来
        }
        this.changePayType = (payType) => {//付款方式
            this.setState({
                payType:payType
            })
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            let {data} = nextProps.state;
            this.state.address = data&&data.data&&data.data.address||{};
            this.state.products = data&&data.data&&data.data.order_products||[];
            this.state.totalNum = data&&data.data&&data.data.total_quantity || 0;
            this.state.addressId = this.state.address.id;
            this.state.pay_type = data&&data.data&&data.data.pay_type || {};
            let query = nextProps.location.query;
            this.state.buy_type = query.buy_type||'';
            this.state.sku_id = query.sku_id||'';
            this.state.totalMoney = parseFloat(query.totalMoney)||0;
            this.state.fromAddress = query.fromAddress||'';
            if (this.state.fromAddress == 'fromAddress') { //判断是否是从地址页过来的参数，如果是则改变地址信息
                this.state.address.consignee = query.realname;
                this.state.address.mobile = query.mobile;
                this.state.address.detail = query.address;
                this.state.address.id = query.id;
                this.state.addressId = query.id;
            }
        }     
    }
    componentWillMount() {
        //配置微信SDK
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
        if (this.state.address.length == 0) {
            this.state.addressState = 'noAddress';
        }else{
            this.state.addressState = 'hasAddress';
        }
        return (
            <div className='comfirmOrder_container'>
               <OrderHead addAddress backToIndex title='确认订单' buy_type={this.state.buy_type} sku_id={this.state.sku_id} totalMoney={this.state.totalMoney}/>
                <Address name={this.state.address.consignee} phone={this.state.address.mobile} id={this.state.address.id} address={this.state.address.detail}/>
               
               {
                    this.state.products.length > 0 ? <List list={this.state.products} total_quantity={this.state.totalNum} /> : null
                }
                <Payway pay_type={this.state.pay_type} changePayType = {this.changePayType}/>
               <OrderFoot totalMoney={this.state.totalMoney} content='确认订单' transToSuccess={this.state.addressState} ProductNum={this.state.products.length} buy_type={this.state.buy_type} sku_id={this.state.sku_id} address_id={this.state.addressId} pay_type={this.state.payType}/>
            </div>
        );
    }
}


export default GetData({
    id: 'confirmOrders',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/order/order/confirm',
    type:'POST',
    data: (props) => { //发送给服务器的数据
        return {
            buy_type: Number(props.location.query.buy_type), 
            sku_id:props.location.query.sku_id
        }
    },
    success: (state) => { return state; }, //请求成功后执行的方法
    error: (state) => { return state } //请求失败后执行的方法
});
