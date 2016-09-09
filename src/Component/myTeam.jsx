import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {Header,DataLoad, Footer, UserHeadImg, TabIcon, GetNextPage} from './common/Index';


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
            <ul className="team_list">
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
            <li className='team_item'>
                <header>授权编号：pt22222222222222</header>
                <section>
                    <p>分销商：哈哈哈<span></span></p>
                    <p>联系电话：99999999999</p>
                    <p>加入时间：2016-08-24</p>
                    <p>有效日期：2016-08-24至2016-08-24</p>
                </section>
                <footer className='clear'>
                    <span className='right creat_certificate'>生成证书</span>
                    <span className='right check_certificate'>查看证书</span>
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
        data = [1,1,1]
        return (
            <div className="index-list-box">
               <Header nav title='团队管理' searchIcon/>
               <nav className='team_nav'>
                   <ul className='clear'>
                       <li className='team_choosed'><p>全部列表</p><span></span></li>
                       <li><p>已过期</p><span></span></li>
                       <li><p>已作废</p></li>
                   </ul>
               </nav>
                {
                    data.length > 0 ? <List list={data} /> : null
                }
                <Link to='/myteam/edit' className='add_newAddress'><span></span>添加分销商</Link>
            </div>
        );
    }
}


export default GetNextPage({
    id: 'myTeam',  //应用关联使用的redux
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
