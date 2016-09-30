import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {DataLoad, OrderHead,Footer, UserHeadImg, TabIcon, GetData} from './common/Index';


/**
 * (循环列表)
 * 
 * @class List
 * @extends {Component}
 */
class List extends Component {
    render() {
        return (
            <ul className="address_list">
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
    constructor(props,context){
        super(props,context)
        this.state = {
          address:null //地址信息
        }

        this.delelteAddress = (id) => {//将地址id传给父级，删除地址
          this.context.getDelete(id)
        }
        this.setDefault = (id) => {  //设置默认地址
          this.context.setStateDefault(id)
        }
    }
    render() {
        let {address,addressName, area_id ,city_id, province_id,created_at, id,mobile,realname, status,updated_at} = this.props;
        this.state.address = addressName[province_id] + addressName[city_id]+ addressName[area_id]
        if (status == 1) {
          var addressStatus = (<div className='left address_set'>
                       <span className='address_icon'></span>
                       <span className='address_state'>默认地址</span>
                   </div>)
        }else{
          var addressStatus = (<div className='left address_set'  onClick={this.setDefault.bind(this,id)}>
                       <span className='address_icon1'></span>
                       <span className='address_state1'>设为默认</span>
                   </div>)
        }


        if (this.context.fromConfirm == 'fromConfirm') { //是否从确认订单页面跳转过来
          var toConfirm = (<Link to={'/confirmorders?buy_type='+this.context.buy_type+'&sku_id='+this.context.sku_id+'&totalMoney='+this.context.totalMoney+'&id='+id+'&realname='+realname+'&mobile='+mobile+'&address='+this.state.address+address+'&fromAddress=fromAddress'} className='address_detail'>
                   <p className='name_phone'>
                       <span className='name'>{realname}</span>
                       <span className='phone'>{mobile}</span>
                   </p>
                   <p className='address_inform'>{this.state.address}{address}</p>
               </Link>)
        }else{
          var toConfirm = (<section className='address_detail'>
                   <p className='name_phone'>
                       <span className='name'>{realname}</span>
                       <span className='phone'>{mobile}</span>
                   </p>
                   <p className='address_inform'>{this.state.address}{address}</p>
               </section>)
        }

        return (
            <li className='address_item'>
              {toConfirm}
               <footer className='address_edit clear'>
                   {addressStatus}
                   <div className='right edit_address'>
                       <Link className='editLink' to={'/mynewaddress?realname='+realname+'&mobile='+mobile+'&province_id='+province_id+'&city_id='+city_id+'&area_id='+area_id+'&address='+address+'&status='+status+'&edit=edit'+'&id='+id+'&cityName='+this.state.address}>编辑</Link>
                       <span className='deleteIcon' onClick={this.delelteAddress.bind(this,id)}>删除</span>
                   </div>
               </footer>
            </li>
        );
    }
}
ListItem.contextTypes = {
  getDelete: React.PropTypes.any,
  setStateDefault:React.PropTypes.any,
  fromConfirm: React.PropTypes.any,
  buy_type: React.PropTypes.any,
  sku_id: React.PropTypes.any,
  totalMoney: React.PropTypes.any
};



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
          data:[],  //地址列表
          fromConfirm:'', //是否从确认订单页面调转来
          buy_type:'', //接受参数，以便返回给确认订单页面
          sku_id:'',
          totalMoney:''
        }

        this.getAddress = (id) => {//删除地址后，从数据中删掉相应的地址
            let resetData = this.state.data;
            for (var i = 0; i < resetData.length; i++) {
                if (resetData[i].id == id) {
                  resetData.splice(i,1)
                }
            }
            this.setState({
              data:resetData
            })
        }

        this.getDelete = (id) => { //发送请求删除地址
            Tool.get('/address/del',{id:id}, (res) => {
                if (res.http_code == 200) {
                  Tool.alert('删除地址成功')
                    this.getAddress(id)
                }else{
                  Tool.alert(res.msg)
                }
            }, (err) => {
                Tool.alert('删除地址失败')
                console.log('error')
            })
        }
        this.setStateDefault = (id) => { //设置默认地址
            Tool.get('/address/setDefaultAddress',{id:id}, (res) => {
                if (res.http_code == 200) {
                  let resetData = this.state.data;
                  for (var i = 0; i < resetData.length; i++) {
                        resetData[i].status = 0;
                      if (resetData[i].id == id) {
                        resetData[i].status = 1;
                      }
                  }
                  this.setState({
                    data:resetData
                  })
                }
            }, (err) => {
                console.log('error')
            })
        }
    }
     getChildContext () {   //上下文传递函数及变量
        return {
            getDelete: this.getDelete,
            setStateDefault:this.setStateDefault,
            fromConfirm:this.state.fromConfirm,
            buy_type:this.state.buy_type,
            sku_id:this.state.sku_id,
            totalMoney:this.state.totalMoney
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
          this.state.fromConfirm = nextProps.location.query.fromConfirm||'';
          this.state.buy_type = nextProps.location.query.buy_type||'';
          this.state.sku_id = nextProps.location.query.sku_id||'';
          this.state.totalMoney = parseFloat(nextProps.location.query.totalMoney)||'';
          let {data} = nextProps.state;
          this.state.data = data&&data.data||[];
          if (this.state.data.length > 0) {  //对数据进行排序，让默认地址在第一位
            let resetData = this.state.data;
            for (var i = 0; i < resetData.length; i++) {
                if (resetData[i].status == 1) {
                  let containArr = resetData.splice(i,1);
                  resetData = containArr.concat(resetData)
                }
            }
            this.state.data = resetData;
          }
        }
    }
    componentDidMount() {
    }
    render() {
        if (this.state.data.length == 0) {
          var emptyAddress = (<div className='empty_address'>
            <div className='empty_img'></div>
            <div className='empty_title'>您还没有添加收货地址</div>
          </div>)
        }else{
          var emptyAddress = null;
        }
        return (
            <div className='myAddress'>
                <OrderHead back title='收货地址' fromConfirm={this.state.fromConfirm}  buy_type={this.state.buy_type} sku_id={this.state.sku_id} totalMoney={this.state.totalMoney}/>
                {emptyAddress}
                {
                    this.state.data.length > 0 ? <List list={this.state.data} /> : null
                }
                <Link to='/mynewaddress' className='add_newAddress'><span></span>新增收货地址</Link>
            </div>
        );
    }
}

Main.childContextTypes = {
    getDelete: React.PropTypes.any,
    setStateDefault: React.PropTypes.any,
    fromConfirm: React.PropTypes.any,
    buy_type: React.PropTypes.any,
    sku_id: React.PropTypes.any,
    totalMoney: React.PropTypes.any

};


export default GetData({
    id: 'MyAddress',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/address/lists',
    data: {},
    success: (state) => { return state; }, //请求成功后执行的方法
    error: (state) => { return state } //请求失败后执行的方法
});
