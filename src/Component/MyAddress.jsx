import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {DataLoad, OrderHead,Footer, UserHeadImg, TabIcon, GetNextPage} from './common/Index';


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
            <ul className="address_list">
                {
                    this.props.list.map((item, index) => {
                        return <ListItem key={index} {...item}/>
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
    render() {
        let {id, title, author, visit_count, reply_count, create_at, last_reply_at} = this.props;
        let src = '../images/tu.png';
        return (
            <li className='address_item'>
               <section className='address_detail'>
                   <p className='name_phone'>
                       <span className='name'>简单的</span>
                       <span className='phone'>18362136989</span>
                   </p>
                   <p className='address_inform'>上海市田林路1016号科技绿洲三期10号楼葡萄科技</p>
               </section>
               <footer className='address_edit clear'>
                   <div className='left address_set'>
                       <span className='address_icon'></span>
                       <span className='address_state'>默认地址</span>
                   </div>
                   <div className='right edit_address'>
                       <span>编辑</span>
                       <span>删除</span>
                   </div>
               </footer>
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
        var {data, loadAnimation, loadMsg} = this.props.state;
        var tab = this.props.location.query.tab || 'all';
        data = [1,1]
        return (
            <div>
                <OrderHead back title='收货地址' complete/>
                {
                    data.length > 0 ? <List list={data} /> : null
                }{/*此处应判断大于0，但还没有接口，所以先用－1代替*/}
                <Link to='/my/newaddress' className='add_newAddress'><span></span>新增收货地址</Link>
            </div>
        );
    }
}


export default GetNextPage({
    id: 'MyAddress',  //应用关联使用的redux
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
