import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {Header, DataLoad, Footer, UserHeadImg, TabIcon, GetData} from './common/Index';

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
          totalMoney:0,  //总共商品价格
          payType:null,  //付款方式，线上付款和线下付款
          order_id:null //商品id
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
          this.state.totalMoney = nextProps.location.query.totalMoney;
          this.state.payType = nextProps.location.query.type;
          this.state.order_id = nextProps.location.query.order_id;
        }     
    }
    componentDidMount() {
    }
    render() {
        if (this.state.payType == 'offline') {
          var successImg = (<div className='seccess_tip'>
                   <p>恭喜，订单提交成功</p>
                   <p>应付金额： ¥ {this.state.totalMoney}</p>
               </div>)
        }else if(this.state.payType == 'online'){
          var successImg = (<div className='seccess_tip'>
                   <p>恭喜，订单支付成功</p>
                   <p>支付金额： ¥ {this.state.totalMoney}</p>
               </div>)
        }
        return (
            <div>
               <Header nav logo/>
               {successImg}
               {
                  this.state.payType == 'offline'?<div className='pay_tip'>
                   <span className='tip_icon'></span>您选择线下转账，转账完成后请联系管理员审核
               </div>:null
               }

               <Link to={'/myordersdetails?order_id='+this.state.order_id} className='trans_orders'>查看订单</Link>
            </div>
        );
    }
}


export default GetData({
    id: 'confirmOrdersSuccess',  //应用关联使用的redux
    component: Main
});
