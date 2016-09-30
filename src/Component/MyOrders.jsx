import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory,History, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {Header,OrderItem, DataLoad, Footer, GetData} from './common/Index';
import {system} from '../Config/Config';

/**
 * (循环列表)
 * 
 * @class List
 * @extends {Component}
 */

class List extends Component {
    render() {
        return (
            <ul>
                {
                    this.props.list.map((item, index) => {
                        return <OrderItem buy_type='2' key={index} {...item} />
                    })
                }
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
    constructor(props,context) {
        super(props,context);
        this.state = {
            orders:[],  //订单列表
            total_order:0, // 订单总数
            currentPage:1, //当前所在页数
            totalPage:1 ,//总共的页数
            limit:20 ,  //每页加载的数量
            shouldUpdata:true  //当获取数据后才能进行加载
        }
        this.getNextPage = (currentPage) => { //加载下一页
            if (!this.state.shouldUpdata) {
                return
            }
            this.state.shouldUpdata = false;
            Tool.get('/order/lists',{page:currentPage,type:0}, (res) => {
                this.state.currentPage = currentPage;
                this.state.shouldUpdata = true;
                if (res.http_code == 200) {
                    this.state.orders = this.state.orders.concat(res.data)
                    this.setState(this.state.orders)
                }else{
                    Tool.alert(res.msg)
                }
            }, (err) => {
                console.log('error')
            })
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
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            let {data} = nextProps.state;
            this.state.orders = data&&data.data||[];
            this.state.currentPage = data&&data.currentPage||1;
            this.state.totalPage = data&&data.totalPage||1;
        }     
    }
    render() {
        if (this.state.currentPage < this.state.totalPage) {
                Tool.nextPage(this.refs.Container,this.state.currentPage,this.state.totalPage,this.getNextPage,this.state.shouldUpdata)
        }
        return (
            <div className='order_container' ref='Container'>
               <Header nav logo />
                {
                    this.state.orders.length > 0 ? <List list={this.state.orders} /> : null
                }
            </div>
        )
    }
}


export default GetData({
    id: 'MyOrders',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/order/lists',
    data: () => {
        return{
            type:0,
            page:1
        }
    },
    success: (state) => { return state; }, //请求成功后执行的方法
    error: (state) => { return state } //请求失败后执行的方法
});
