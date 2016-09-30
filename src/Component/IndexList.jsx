import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory,History, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {Header,Footer,GetData} from './common/Index';
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
            <ul className="index_list">
                {
                    this.props.list.map((item, index) => {
                        return <ListItem key={index} {...item}/>
                    })
                }
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
            showHide:'none',//底部选择组件是否显示，默认不显示
            apply_status:this.props.sale_status //商品状态，申请，待审核，审核成功
        }
        this.showDetail = () => {  //隐藏显示底部选择组件
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
        this.applyProduct = (id) => {  //申请商品
            Tool.post('/product/product/applyProduct',{product_id:id},(res) => {
                if (res.http_code == 200) {
                    this.setState({apply_status:0})//返回成功则设置申请状态为审核中
                }else{
                    Tool.alert(res.msg);
                }
            },(error) => {
                console.log(error)
            })
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            let {sale_status} = nextProps;
            this.state.apply_status = sale_status;
        }
    }
    componentWillMount() {
        var url = window.location.href.split('#')[0];
        console.log(url)
        var successFun = (res) => {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appId, // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.nonceStr, // 必填，生成签名的随机串
                signature: res.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            console.log(res)
        }
        
        var errorFun = (res) => {
            console.log(res)
        }

        Tool.get('/common/wx/jssdk', {url: url}, successFun, errorFun)

        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: '葡萄科技自助订货系统', // 分享标题
                link: 'http://sale.putao.com/', // 分享链接
                imgUrl: 'http://h5.ptevent.cn/pt_order_sys/share.jpg', // 分享图标
                success: function() {
                    
                },
                cancel: function() {
                    
                }
            });
            wx.onMenuShareAppMessage({
                title: '葡萄科技自助订货系统', // 分享标题
                desc: '下单、查询、代发、分级管理让您了如指掌', // 分享描述
                link: 'http://sale.putao.com/', // 分享链接
                imgUrl: 'http://h5.ptevent.cn/pt_order_sys/share.jpg', // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () { 
                    
                },
                cancel: function () { 
                    
                }
            });

            wx.onMenuShareQQ({
                title: '葡萄科技自助订货系统', // 分享标题
                desc: '下单、查询、代发、分级管理让您了如指掌', // 分享描述
                link: 'http://sale.putao.com/', // 分享链接
                imgUrl: 'http://h5.ptevent.cn/pt_order_sys/share.jpg', // 分享图标
                success: function () { 
                   
                },
                cancel: function () { 
                   
                }
            });

            wx.onMenuShareWeibo({
                title: '葡萄科技自助订货系统', // 分享标题
                desc: '下单、查询、代发、分级管理让您了如指掌', // 分享描述
                link: 'http://sale.putao.com/', // 分享链接
                imgUrl: 'http://h5.ptevent.cn/pt_order_sys/share.jpg', // 分享图标
                success: function () { 
                   
                },
                cancel: function () { 
                    
                }
            });

            wx.onMenuShareQZone({
                title: '葡萄科技自助订货系统', // 分享标题
                desc: '下单、查询、代发、分级管理让您了如指掌', // 分享描述
                link: 'http://sale.putao.com/', // 分享链接
                imgUrl: 'http://h5.ptevent.cn/pt_order_sys/share.jpg', // 分享图标
                success: function () { 
                   
                },
                cancel: function () { 
                    
                }
            });
        })    
    }
    render() {
        let {buy,title,single_price,product_unit,pack_num,pack_market_price,pack_cheap_price,list_sort,h5_image_url,id} = this.props;
        let showFooter = this.state.showHide;
        //如果已经点击申请且返回成功，则用state中的状态,否则使用默认的值
        let discount = ((pack_cheap_price/pack_market_price)*10).toFixed(1);//折扣
        if (discount >= 10.0) {
            discount = null;
        }else{
            discount = '(' + discount +'折)'
        }
        if (this.state.apply_status == -1) {
            buy = (<span className='product_apply' onClick={this.applyProduct.bind(this,id)}>申请</span>)
        }
        if (this.state.apply_status == 0) {
            buy = (<span className='waitForCheck'>待审核</span>)
        }
        if (this.state.apply_status == 1) {
            buy = (<span onClick={this.showDetail} className='addToBuyCart'></span>)
        }
        if (showFooter == 'block') {
            showFooter = (<Footer gotoPay reduceAdd alert replaceButton showFun={this.showDetail} product_id={id} title={title} addToCart/>)
        }else{
            showFooter = null;
        }
        return (
            <li className='list_item clear' onClick={this.showNav}>
               <div className='item_img left'>
                   <img src={h5_image_url} alt='商品图片'/>
               </div>
               <div className='item_details left'>
                    <header className='item_name'>{title}</header>
                    <div className='item_price'>
                        <span>建议售价：</span>
                        <span>¥ {single_price}</span>
                    </div>
                    <div className='item_price'>
                        <span>规&emsp;&emsp;格：</span>
                        <span>{pack_num}{product_unit}/箱</span>
                    </div>
                    <div className='item_price'>
                        <span>原&emsp;&emsp;价：</span>
                        <span className='item_delete'>
                            <i></i><span>¥ {pack_market_price}/箱</span>
                        </span>
                    </div>
                    <div className='real_price'>
                        ¥ {pack_cheap_price}/箱 <span>{discount}</span>
                    </div>
                    <div className='add_cart clear'>
                        {buy}
                    </div>
               </div>
                {showFooter}
            </li>
        )
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
    constructor(props , context) {
        super(props , context);
        this.state = {
            data:[],//商品列表
            productNum:0 , //购物车数量
            currentPage:1, //当前所在页数
            totalPage:1  ,//总共的页数
            limit:20 ,  //每页加载的数量
            shouldUpdata:true  //当获取数据后才能进行加载
        }
        this.showNum = (num) => {
           this.setState({
                productNum:num
           })
        }
        this.getNextPage = (currentPage) => { //加载下一页
            if (!this.state.shouldUpdata) {
                return
            }
            this.state.shouldUpdata = false;//ajax返回数据后才能继续加载下一页
            Tool.get('/product/product/lists',{page:currentPage,limit:this.state.limit}, (res) => {
                this.state.currentPage = currentPage;
                this.state.shouldUpdata = true;
                if (res.http_code == 200) {
                    this.state.data = this.state.data.concat(res.data.product_list)
                    this.setState(this.state.data)
                }else{
                    Tool.alert(res.msg)
                }
            }, (err) => {
                console.log('error')
            })
        }
    }

    getChildContext () { //上下文
        return {
            showNum: this.showNum
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            let {data} = nextProps.state;
            this.state.data = data&&data.data&&data.data.product_list||[];
            this.state.currentPage = data&&data.data&&data.data.req_page||1;
            this.state.totalPage = data&&data.data&&data.data.total_page||1;
        }
          
    }
    componentDidMount() {
        document.title = '订货系统'
    }
    render() {
        let productNum = this.state.productNum;
        if (this.state.currentPage < this.state.totalPage) {
                Tool.nextPage(this.refs.Container,this.state.currentPage,this.state.totalPage,this.getNextPage,this.state.shouldUpdata)
        }
        return (
            <div className="index_list_container" ref='Container'>
                <Header nav logo myMessage shoppingCart history={this.props.history} productNum={productNum}/>
                {
                    this.state.data.length > 0 ? <List list={this.state.data} /> : null
                }
               
            </div>
        )
    }
}

Main.childContextTypes = {
    showNum: React.PropTypes.any
};

export default GetData({
    id: 'IndexList',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/product/product/lists',
    data: (props, state) => { //发送给服务器的数据
        let {req_page, limit} = state;
        return {
            req_page,
            limit
        }
    },
    success: (state) => {
        return state; 

     }, //请求成功后执行的方法
    error: (state) => { 
        return state
     } //请求失败后执行的方法
});

