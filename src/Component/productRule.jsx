import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import { Header,DataLoad, Footer, UserHeadImg, TabIcon, GetNextPage} from './common/Index';


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
          toggleList:'none',
          selected:{list1:'rule_active'},
          oldSelected:'list1'
        }
        this.showHide = () => {
          if (this.state.toggleList == 'none') {
            this.setState({toggleList:'block'})
          }else{
            this.setState({toggleList:'none'})
          }
        }
        this.toggleSelect = (event) => {
          let name = event.target.getAttribute('name');
          if (this.state.oldSelected !== name) {
            this.state.selected = {};
            this.state.selected[name] = 'rule_active';
            this.setState(this.state.selected);
            this.state.oldSelected = name;
          }
        }
    }
    render() {
        var {data, loadAnimation, loadMsg} = this.props.state;
        var tab = this.props.location.query.tab || 'all';
        let listState = this.state.toggleList;
        return (
            <div>
               <Header nav logo myMessage shoppingCart/>
               <nav className='rule_nav'>
                   <ul className='left rule_name' onClick={this.toggleSelect}>
                       <li name='list1' className={this.state.selected.list1}>葡萄探索号</li>
                       <li name='list2' className={this.state.selected.list2}>哈尼海洋</li>
                       <li name='list3' className={this.state.selected.list3}>Hello编程</li>
                   </ul>
                   <aside className='right rule_aside' onClick={this.showHide}>
                       <ul className='rule_hide' style={{display:listState}}>
                           <li><span></span><p>奇妙电路</p></li>
                           <li><span></span><p>涂涂世界</p></li>
                           <li><span></span><p>麦斯丝</p></li>
                       </ul>
                   </aside>
               </nav>
               <section className='rule_content'>
                   商品号政策
               </section>
            </div>
        );
    }
}


export default GetNextPage({
    id: 'productRule',  //应用关联使用的redux
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
