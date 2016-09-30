import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {Header,DataLoad, Footer, GetData} from './common/Index';


/**
 * (循环列表)
 * 
 * @class List
 * @extends {Component}
 */
class List extends Component {
    render() {
        return (
            <ul className="team_list">
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
    constructor(props,context) {
        super(props,context);
        this.state = {
            viewCertifited:'none',//是否显示证书
            imgPath:null   //图片地址
        }

        this.getTime = (time) => { //将时间转换为年月日
            time = time*1000;
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();
            return year+'-'+month+'-'+day
        }


        this.createCertifited = (id) => { //生成证书
            Tool.get('/user/createCertifited',{user_id:id}, (res) => {
                if (res.http_code == 200) {
                    Tool.alert('生成证书成功');
                    this.context.getlist()
                }else{
                    Tool.alert(res.msg)
                }
            }, (err) => {
                Tool.alert('生成证书失败')
                console.log('error')
            })
        }
        this.viewCertifited = (id) => { //查看证书
            if (this.state.viewCertifited == 'none') {
                Tool.get('/user/viewCertifited',{user_id:id}, (res) => {
                    if (res.http_code == 200) {
                        this.setState({viewCertifited:'block',imgPath:res.path});
                    }else{
                        Tool.alert(res.msg)
                    }                
                }, (err) => {
                    Tool.alert('查看证书失败')
                    console.log('error')
                }) 
            }else if (this.state.viewCertifited == 'block') {
                this.setState({viewCertifited:'none'});
            }
        }

    }
    render() {
        let {authorize_code,realname,level_id,phone,created_at,auth_start_time,auth_end_time,status,id,weixin_code,identity_card} = this.props;
        let imgPath = this.state.imgPath;
        let show = this.state.viewCertifited;
        let createTime = this.getTime(created_at);
        let startTime = this.getTime(auth_start_time);
        let endTime = this.getTime(auth_end_time);
        if (Number(auth_end_time) - Number(auth_start_time)<=864000) {
            var createCertifited = (<span className='right creat_certificate' onClick={this.createCertifited.bind(this,id)}>
                        生成证书
                    </span>)
        }else{
            var createCertifited = null;
        }
        if (Number(status) == 1) {
            var context = startTime+'至'+endTime
        }else if (Number(status) == 0) {
            var context = '待审核'
        }else if (Number(status) == -1) {
            var context = '已作废'
        }else if (Number(auth_end_time) - Number(auth_start_time) <= 0) {
            var context = '已过期'
        }

        return (
            <li className='team_item'>
                <header>授权编号：{authorize_code}</header>
                <Link to={'/myteamedit?realname='+realname+'&phone='+phone+'&weixin_code='+weixin_code+'&level_id='+level_id+'&identity_card='+identity_card+'&status='+status+'&user_id='+id} className='team_section'>
                    <p>分销商：{realname}<span className={'level_id level_id' +level_id }></span></p>
                    <p>联系电话：{phone}</p>
                    <p>加入时间：{createTime}</p>
                    <p>有效日期：{context}</p>
                </Link>
                <footer className='clear'>
                    {createCertifited}
                    <span className='right check_certificate' onClick={this.viewCertifited.bind(this,id)}>
                        查看证书
                        <div className='imgCover' style={{display:show}}>
                             <img src={imgPath} alt='证书图片' className='showCertifited'/>
                        </div> 
                    </span>
                </footer>
            </li>
        );
    }
}

ListItem.contextTypes = {
  getlist: React.PropTypes.any
};


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
            data:[],  //分销商列表数组
            oldName:'all', //上次选中的类别，默认为all
            choosedClass:{all:'team_choosed'}, //当前选中的类别，以此设置class名
            currentPage:1, //当前所在页数
            totalPage:1  ,//总共的页数
            limit:20 ,  //每页加载的数量
            shouldUpdata:true  //当获取数据后才能进行加载
        }
        this.chooseStatus = (event) => { //筛选类型
            let name = null;
            if (event.target.children[0]) {
                name = event.target.children[0].getAttribute('name')
            }else{
                name = event.target.getAttribute('name')
            }
            if (name !== this.state.oldName) {
                this.state.oldName = name;
                this.state.choosedClass = {};
                this.state.choosedClass[name] = 'team_choosed';
                Tool.get('/user/lists',{page:1,action:name}, (res) => {
                    if (res.http_code == 200) {
                        this.setState({
                            data:res.data.data,
                            currentPage:1
                        })
                    }else{
                        Tool.alert(res.msg)
                    }
                }, (err) => {
                    console.log('error')
                })
            }
        }
        this.getlist = () => { //获取分销商列表
            Tool.get('/user/lists',{page:this.state.currentPage,action:this.state.oldName}, (res) => {
                if (res.http_code == 200) {
                    this.setState({
                        data:res.data.data
                    })
                }
            }, (err) => {
                console.log('error')
            })
        }
        this.searchUser = (name) => { //搜索分销商
            Tool.get('/user/lists',{page:1,action:this.state.oldName,realname:name}, (res) => {
                if (res.http_code == 200) {
                    if (res.data.data.length == 0) {
                        Tool.alert('您搜索的分销商不存在')
                    }
                    this.setState({
                        data:res.data.data,
                        currentPage:1
                    })
                }
            }, (err) => {
                Tool.alert('检索失败')
                console.log('error')
            })
        }
        this.getNextPage = (currentPage) => { //加载下一页
            if (!this.state.shouldUpdata) {
                return
            }
            this.state.shouldUpdata = false;
            Tool.get('/user/lists',{page:currentPage,action:this.state.oldName}, (res) => {
                this.state.currentPage = currentPage;
                this.state.shouldUpdata = true;
                if (res.http_code == 200) {
                    this.state.data = this.state.data.concat(res.data.data)
                    this.setState(this.state.data)
                }else{
                    Tool.alert(res.msg)
                }
            }, (err) => {
                console.log('error')
            })
        }
    }
    getChildContext () {
        return {
            getlist: this.getlist
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            let {data} = nextProps.state;
            this.state.data = data&&data.data&&data.data.data||[];
            this.state.currentPage = data&&data.data&&data.data.currentPage||1;
            this.state.totalPage = data&&data.data&&data.data.totalPage||1;
        }
          
    }
    componentDidMount() {
        
    }
    render() {
        if (this.state.currentPage < this.state.totalPage) {
            Tool.nextPage(this.refs.Container,this.state.currentPage,this.state.totalPage,this.getNextPage,this.state.shouldUpdata)
        }
        return (
            <div className="index_list_box" ref='Container'>
               <Header nav title='团队管理' searchIcon searchUser = {this.searchUser}/>
               <nav className='team_nav'>
                   <ul className='clear' onClick={this.chooseStatus} >
                       <li className={this.state.choosedClass['all']}><p name='all'>全部列表</p><span></span></li>
                       <li className={this.state.choosedClass['expired']}><p name='expired'>已过期</p><span></span></li>
                       <li className={this.state.choosedClass['cancel']}><p name='cancel'>已作废</p></li>
                   </ul>
               </nav>
                {
                    this.state.data.length > 0 ? <List list={this.state.data} /> : null
                }
                <Link to='/myteamedit' className='add_newAddress'><span></span>添加分销商</Link>
            </div>
        );
    }
}

Main.childContextTypes = {
    getlist: React.PropTypes.any
};

export default GetData({
    id: 'myTeam',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/user/lists',
    data: () => { //发送给服务器的数据
        return {
            page:1,
            action:'all'
        }
    },
    success: (state) => { return state; }, //请求成功后执行的方法
    error: (state) => { return state } //请求失败后执行的方法
});
