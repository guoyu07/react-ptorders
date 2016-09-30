import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../Action/Index';
import {Tool, merged} from '../Tool';
import {OrderHead,DataLoad, Footer, GetData} from './common/Index';




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
          realname:'',//用户名
          phone:'', //电话
          weixin_code:'', //微信号
          level_id:2, //等级
          identity_card:'', //身份证号
          status:1, // 是否启用
          chooseLevel:{level1:'active_level'}, //选择等级
          oldName:'level1', // 上次选择等级
          user_id:'' // 用户id
        }

        this.handleChange = (name,event) => { // 设置表单value
            if (name == 'realname') {
              this.setState({realname:event.target.value})
            }
            if (name == 'phone') {
              this.setState({phone:event.target.value})
            }
            if (name == 'weixin_code') {
              this.setState({weixin_code:event.target.value})
            }
            if (name == 'identity_card') {
              this.setState({identity_card:event.target.value})
            }

        }
        this.chooselevel = (name,index) => {  // 选择等级
            if (name !== this.state.oldName) {
              this.state.oldName = name;
              this.state.level_id = index;
              this.state.chooseLevel = {};
              this.state.chooseLevel[name] = 'active_level';
              this.setState(this.state.chooseLevel);
            }
        }
        this.changeStatus = (status) => { // 是否启用
            this.setState({
              status:status
            })
        }

        this.createCertifited = (id) => { // 生成证书
            Tool.get('/user/createCertifited',{user_id:id}, (res) => {
                if (res.http_code == 200) {
                    Tool.alert('生成证书成功');
                    window.history.back();
                }else{
                    Tool.alert(res.msg)
                }
            }, (err) => {
                Tool.alert('生成证书失败')
            })
        }

        this.postInform = () => { // 发送请求，保存用户
          if (this.state.realname === '') {
            Tool.alert('用户名不能为空')
          }else if(!(/^\d{11}$/gi).test(this.state.phone)){
            Tool.alert('请输入正确的手机号码')
          }else if(this.state.weixin_code === ''){
            Tool.alert('微信号不能为空')
          }else if(!(/^\d{18}$/gi).test(this.state.identity_card)){
            Tool.alert('请输入正确的身份证号码')
          }else{
            if (this.state.user_id == '') {
              Tool.get('/user/createTeam',{realname:this.state.realname,phone:this.state.phone,weixin_code:this.state.weixin_code,identity_card:this.state.identity_card,level_id:this.state.level_id,status:this.state.status}, (res) => {
                    if (res.http_code == 200) {
                      Tool.alert('添加分销商成功');
                      this.createCertifited(res.data.user_id);
                    }else{
                      Tool.alert(res.msg)
                    }
                }, (err) => {
                    Tool.alert('添加分销商失败')
                    console.log('error')
                })
            } else{
               Tool.get('/user/updateTeam',{user_id:this.state.user_id,realname:this.state.realname,phone:this.state.phone,weixin_code:this.state.weixin_code,identity_card:this.state.identity_card,level_id:this.state.level_id,status:this.state.status}, (res) => {
                    if (res.http_code == 200) {
                      Tool.alert('修改分销商成功')
                      window.history.back();
                    }else{
                      Tool.alert(res.msg)
                    }
                }, (err) => {
                    Tool.alert('修改分销商失败')
                    console.log('error')
                })
            }
          }
        }
    }
    componentDidMount() {
    }
    componentWillUpdate(nextProps, nextState) {
          if (this.props !== nextProps) {
            let inform = nextProps.location.query;
            this.state.realname = inform.realname||'';
            this.state.phone = inform.phone||'';
            this.state.weixin_code = inform.weixin_code||'';
            this.state.level_id = inform.level_id||2;
            this.state.identity_card = inform.identity_card||'';
            this.state.status = inform.status||1;
            this.state.user_id = inform.user_id||'';
            this.state.oldName = 'level'+ (this.state.level_id-1);
            this.state.chooseLevel = {};
            this.state.chooseLevel[this.state.oldName] = 'active_level';
          }
    }
    render() {
        return (
            <div className="index-list-box">
               <OrderHead back title='添加分销商' save postInform={this.postInform}/>
               <ul className='add_member'>
                   <li className='member_name'>
                       <span>姓名：</span>
                       <input type='text' placeholder='请输入姓名' value={this.state.realname} onChange={this.handleChange.bind(this,'realname')} />
                   </li>
                   <li className='member_phone'>
                       <span>手机号：</span>
                       <input type='text' placeholder='请输入电话号码' value={this.state.phone} onChange={this.handleChange.bind(this,'phone')}/>
                   </li>
                   <li className='member_weixin'>
                       <span>微信号：</span>
                       <input type='text' placeholder='请填写微信号' value={this.state.weixin_code} onChange={this.handleChange.bind(this,'weixin_code')}/>
                   </li>
                   <li className='member_level'>
                       <span>分销级别：</span>
                       <div className='choose_level clear'>
                           <div onClick={this.chooselevel.bind(this,'level1',2)} className={this.state.chooseLevel.level1}>金葡萄</div>
                           <div onClick={this.chooselevel.bind(this,'level2',3)} className={this.state.chooseLevel.level2}>银葡萄</div>
                           <div onClick={this.chooselevel.bind(this,'level3',4)} className={this.state.chooseLevel.level3}>葡萄</div>
                       </div>
                   </li>
                   <li className='member_certificate'>
                       <span>身份证号：</span>
                       <input type='text' placeholder='请填写新增分销商身份证号' value={this.state.identity_card} onChange={this.handleChange.bind(this,'identity_card')}/>
                   </li>
                   <li className='member_state'>
                       <span>状态：</span>
                       <div style={{marginRight:'3.65rem'}} onClick={this.changeStatus.bind(this,1)} className={this.state.status==1?'start_use':'stop_use'}>启用</div>
                       <div onClick={this.changeStatus.bind(this,0)} className={this.state.status==0?'start_use':'stop_use'}>停用</div>
                   </li>
               </ul>
            </div>
        );
    }
}


export default GetData({
    id: 'myTeamEdit',
    component: Main
});
