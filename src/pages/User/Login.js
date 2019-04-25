import React, { Component } from 'react';
import { InputItem, Button, WhiteSpace, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { loginReg } from '@regularConfig';
import style from '@/styles/login.less';
import avataSrc from '@/images/icon/avatar.png';
import loginUserSrc from '@/images/icon/login_user.png';
import loginPassSrc from '@/images/icon/login_pass.png';

import login_logo from '@/assets/Login.svg';


//从地址栏获取想要的参数
function GetQueryString() {    
  var obg={},a='';    
  (a=window.location.search.substr(1))||(a=window.location.hash.split('?')[1]);
  if(!a){
    return
  }  
  var reg = RegExp(/type=(\S*)&/);
  if(a.match(reg)){
    var type = a.match(/type=(\S*)&/)[1];
    var obg ={
      type,
    }
    return obg       
  }else{
    return
  }
 
}

@createForm()
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class app extends Component {
  state = {type:null};
componentWillMount(){
  // const res = GetQueryString();
  const type = this.props.location.query.type;
  // 解码
  console.log('------', type);
  if(type){
    this.setState({type})
  }
}
  submit = () => {
    window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx66b2e7cfd85a93fd&redirect_uri=http%3a%2f%2fmicro.yetingfm.com%2fcrm%2fuser%2fmpCallback&response_type=code&scope=snsapi_userinfo&state=3d6be0a4035d839573b04816624a415e#wechat_redirect'
  };
  render() {
    const {type} = this.state
    return (
      <div className={`page ${style.login}`}>
        <WhiteSpace size="xl" />
        <img src={login_logo} alt="" />
        
        {type ? 
          <div>
          <div className={style.title}>注册成功</div>
          <div className={style.loginTips}>请联系管理员配置权限</div>
          <Button type="primary" onClick={()=>{
          history.go(-1)
        }}>
          我知道了
        </Button>
        </div>
         
        : 
        <div>
        <div className={style.title}>客户管理后台</div>
        <div className={style.loginTips}>登陆需授权</div>
        <Button type="primary" onClick={this.submit}>
        确定
        </Button>
      </div>
      
      }
        <WhiteSpace />
      </div>
    );
  }
}

export default app;
