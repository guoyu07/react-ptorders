import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../../Action/Index';
import {Tool, merged} from '../../Tool';
import GetData from './GetData';
import GetNextPage from './GetNextPage';

export {GetData, GetNextPage}
/**
 * (加载动画)
 *
 * @class DataLoad
 * @extends {Component}
 */
export class DataLoad extends Component {
    render() {
        let {loadAnimation, loadMsg} = this.props;
        return (
            <div className={'data-load data-load-' + loadAnimation}>
                <div className="msg">{loadMsg}</div>
            </div>
        );
    }
}
// DataLoad.defaultProps = {
//     loadAnimation: true, //默认显示加载动画
//     loadMsg: '正在加载中'
// }

/**
 * 公共头部
 *
 * @export
 * @class Header
 * @extends {Component}
 */
export class Header extends Component {
     constructor(props) {
        super(props);
        this.state = {
            showHide :'none'
        };

        this.showNav = () => {
            if (this.state.showHide == 'block') {
                this.setState({showHide:'none'})
            }else{
                this.setState({showHide:'block'})
            }
        }
    }
    render() {
        let {nav, logo , myMessage , shoppingCart ,title ,searchIcon, leftTo, leftIcon, rightTo, rightIcon, rightClick } = this.props;
        let navState = this.state.showHide;
        if (nav) {
            nav = (
                <div className='head_menu' onClick={this.showNav} >
                    <ul className='head_listname'  style={{display:navState}} >
                        <li>
                            <Link to="/index">
                                <span>首页</span>
                                <span className='head_arrow'></span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/my/orders'>
                                <span>我的订单</span>
                                <span className='head_arrow'></span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/productrule'>
                                <span>商品政策</span>
                                <span className='head_arrow'></span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/myteam'>
                                <span>团队管理</span>
                                <span className='head_arrow'></span>
                            </Link>
                        </li>
                    </ul>
                </div>
            );
        }
        if (logo) {
            logo = (
                <div className='head_logo'></div>
            );
        }
        if (myMessage) {
            myMessage = (
                <Link to="/my/messages" className='head_my'>
                   
                </Link>
            );
        }
        if (shoppingCart) {
            shoppingCart = (
                <Link to="/shoppingcart" className='head_buycart'>
                    <span className="head_num">0</span>
                </Link>
            );
        }

        if (searchIcon) {
            searchIcon = (<span className='searchIcon'></span>)
        }

        if (leftTo && leftIcon) {
            left = (
                <Link to={leftTo}>
                    <i className={'iconfont icon-' + leftIcon}></i>
                </Link>
            );
        } else if (leftIcon === 'fanhui') { //返回上一页
            left = (
                <a onClick={this.context.router.goBack}>
                    <i className={'iconfont icon-' + leftIcon}></i>
                </a>
            );
        }

        let right = null;
        if (rightTo && rightIcon) {
            right = (
                <Link to={rightTo}>
                    <i className={'iconfont icon-' + rightIcon}></i>
                </Link>
            );
        } else if (rightClick && rightIcon) {
            right = (
                <div onClick={rightClick}>
                    <i className={'iconfont icon-' + rightIcon}></i>
                </div>
            );
        }
        return (
            <header className="head-list">
                {nav}
                {logo}
                {myMessage}
                {shoppingCart}
                {searchIcon}
                <span className='head_title'>{title}</span>
                <div className="icon" data-flex="main:center cross:center" data-flex-box="0">
                    {right}
                </div>
            </header>
        );
    }
}
Header.contextTypes = {
    router: React.PropTypes.object.isRequired //传入的类型必须是对象
}


/**
 * 购物车及订单页头部
 *
 * @export
 * @class OrderHead
 * @extends {Component}
 */
export class OrderHead extends Component {
    constructor(props){
        super(props);
        this.goBack = () => {
            window.history.back();
        }

    }
    render() {
         let {edit, addAddress,title,back,backToIndex,complete,save} = this.props; 
         if (backToIndex) {
            backToIndex = (<Link to='/index' className='go_back_index'>
                    <span className='icon_arrow'></span>返回首页
                </Link>)
         }
         if (back) {
            back = (<span  className='go_back_index' onClick = {this.goBack}>
                    <span className='icon_arrow'></span>返回
                </span>)
         }

         if (complete) {
            complete = (<div className='shoppingcart_edit'>完成</div>)
         }

        if (save) {
            save = (<div className='shoppingcart_edit'>保存</div>)
         }

         if (edit) {
            edit = (<div className='shoppingcart_edit'>编辑</div>)
         }

         if (addAddress) {
            addAddress = (<div className='shoppingcart_edit'>添加地址</div>)
         }
        return (
            <header className='shoppingcart_head'>
               {backToIndex}
               {back}
                <div className='shoppingcart_title'>
                    {title}
                </div>
                {complete}
                {save}
                {edit}
                {addAddress}
            </header>
        );
    }
}
/**
 * 购物车及订单页底部
 *
 * @export
 * @class OrderFoot
 * @extends {Component}
 */
export class OrderFoot extends Component {
    render() {
        let {chooseAll,content,transToConfirmorders,transToSuccess } = this.props; 
        console.log(this.props)
        if (transToConfirmorders) {
            transToConfirmorders = (<Link to='/confirmorders' className='footer_payButton right'>
                                   {content}
                               </Link>)
        }
        if (transToSuccess) {
            transToSuccess = (<Link to='/confirmorders/success' className='footer_payButton right'>
                                   {content}
                               </Link>)
        }
        if (chooseAll) {
            chooseAll = (<div className='footer_chooseAll right'>
                           <span className='choose_all'></span>
                            全选
                        </div>
                        )
        }
        return (
             <footer className='shoppingcart_footer clear'>
               {transToConfirmorders}
               {transToSuccess}
               <div className='footer_allMoney right'>
                   <p>合计: <i>¥</i><span>999999.99</span></p>
                   <p>不含运费</p>
               </div>
               {chooseAll}
           </footer>
        );
    }
}

/**
 * 底部导航菜单
 *
 * @export
 * @class Footer
 * @extends {Component}
 */
class FooterInit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productCount: 1,
            index:0
        };
        this.selectType = (index,state) => {
            if (state !== 2) {
                this.setState({index:index})               
            }
        } 
        this.getProductCount = (type) => {
            if (type == 'reduce'&&this.state.productCount > 1) {
                let num = this.state.productCount - 1;
                this.setState({productCount:num})
            }else if (type == 'add') {
                let num = this.state.productCount + 1;
                this.setState({productCount:num});
            }
        }
        this.handleChange = (event) => {         
            let newValue = event.target.value;
            newValue = newValue.replace((/\D+/gi),'')
            this.setState({productCount:Number(newValue)})
        }
       
        // this.getMessageCount = () => {
        //     var accesstoken = this.props.User ? this.props.User.accesstoken : '';
        //     if (accesstoken) {
        //         Tool.get('/api/v1/message/count', { accesstoken }, (res) => {
        //             this.setState({
        //                 messageCount: res.data
        //             });
        //         });
        //     }
        // }
    }
    componentWillReceiveProps(){
        this.setState({productCount:1,index:0})
    }
    render() {
       
        let {price,stockNum,chooseType,gotoPay,reduceAdd,commit,alert,show,showFun} = this.props;
        let typeList = [
            {name:'魔方橙',state:1},
            {name:'魔方橙',state:1},
            {name:'魔方橙',state:1},
            {name:'魔方橙',state:2},
            {name:'魔方橙',state:2}
            ];
        let selectIndex = this.state.index;
        if (gotoPay) {
            gotoPay = (
                <footer className='goto_pay'>
                    <div className='right pay_button'>去结账</div>
                    <div className='right all_money'>¥ 999999.99</div>
                    <div className='right all_text'>合计:</div>
                </footer>
            );
        }
        if (reduceAdd) {
            reduceAdd = (
                <div className='edit_number'>
                    <span className='order_numbers'>订货数量:</span>
                    <span className='reduce_add'>
                        <span className='reduce edit_style' onClick={this.getProductCount.bind(this,'reduce')}></span>
                        <input type='text' value={this.state.productCount} onChange={this.handleChange}/>
                        <span className='add edit_style' onClick={this.getProductCount.bind(this,'add')}></span>
                    </span>
                </div>
            );
        }
        if (commit) {
            commit = (
                <div className='commit pay_button'>确认</div>
            );
        }
        if (alert) {
            alert = (
                <div className='show_alert' style={{display:'none'}}>
                    <p>葡萄探索号：桃桃粉</p>
                    <p>没有库存了</p>
                </div>
            );
        }
        return (
            <div className="choose_item" style={{display:show}}>
                <div className='cover'></div>
                {alert}
                <div className="choose_detail">
                    <header className="item_header clear">
                        <div className='item_header_left left'>
                        </div>
                        <div className='item_header_right left'>
                            <p className='item_header_close' onClick={showFun}></p>
                            <p className='item_header_name'>葡萄探索号</p>
                            <p className='item_header_price'>{price}</p>
                            <p className='item_header_price'>{stockNum}</p>
                            <p className='item_header_price'>{chooseType}</p>
                        </div>
                    </header>
                    <section className='item_center'>
                        <div className='item_size'>
                            规格:
                        </div>
                        <ul className='item_options clear'>
                            {
                                typeList.map(( item, index ) => {
                                    let hasNoProduct = '';
                                    let selectProduct = selectIndex==index?'choosed':'';
                                    if (item.state == 2) {
                                        hasNoProduct = 'has_no_products';
                                    }
                                    return (
                                        <li key={index} className={hasNoProduct+selectProduct} onClick={this.selectType.bind(this,index,item.state)}>{item.name}</li>
                                        )
                                })
                            }
                        </ul>
                        {reduceAdd}
                    </section>
                    {gotoPay}
                    {commit}
                </div>
            </div>
        );
    }
    // componentDidMount() {
    //     this.getMessageCount();
    // }
    // shouldComponentUpdate(np, ns) {
    //     return this.props.index !== np.index || this.state.messageCount !== ns.messageCount; //防止组件不必要的更新
    // }
    // componentDidUpdate() {
    //     this.getMessageCount();
    // }
}
FooterInit.defaultProps = {
    index: 0
};


var Footer = connect((state) => { return { User: state.User }; }, action('User'))(FooterInit);




/**
 * (商品详情)
 * 
 * @class ListItem
 * @extends {Component}
 */
export class OrderItem extends Component {
    render() {
        let {id, title, author, visit_count, reply_count, create_at, last_reply_at} = this.props;
        return (
            <li className='order_item'>
                <Link to='/my/orders/details'>
                    <header className='order_head'>
                        订单号：pt222222222222222
                        <span className='order_state'>
                            待支付
                        </span>
                    </header>
                    <section className='order_inform'>
                        <p>配送方式： 商家配送</p>
                        <p>付款方式： 在线支付 未付款</p>
                        <p>下单时间： 2016－8-24 10:11:36</p>
                    </section>
                </Link>  
                <footer className='order_money'>
                    订单金额: &nbsp; 
                    <span className='money_num'>¥ 999999.99</span>
                    <span className='pay_money pay_style right'>马上支付</span>
                    <span className='close_order pay_style right'>关闭订单</span>
                </footer>
            </li>
        );
    }
}





export {Footer}
/**
 * 提示登录
 *
 * @export
 * @class TipMsgSignin
 * @extends {Component}
 */
export class TipMsgSignin extends Component {
    render() {
        return (
            <div className="tip-msg-signin">
                你还未登录，请先<Link to="/signin">登录</Link>
            </div>
        );
    }
}

/**
 * 用户头像
 *
 * @export
 * @class UserHeadImg
 * @extends {Component}
 */
export class UserHeadImg extends Component {
    render() {
        return (<div className="user-headimg"  style={{ backgroundImage: 'url(' + this.props.url + ')' }}></div>)
    }
}

/**
 * 生成主题类型小图标
 *
 * @export
 * @class tabIcon
 * @extends {Component}
 */
export class TabIcon extends Component {
    render() {
        var {tab, top, good} = this.props;

        if (top) {
            tab = 'top';
        } else if (good) {
            tab = 'good';
        }

        return (
            <i className={'iconfont icon-' + tab}></i>
        );
    }
}
