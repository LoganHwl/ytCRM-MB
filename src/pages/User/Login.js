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

@createForm()
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class app extends Component {
  state = {};

  submit = () => {
    window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx66b2e7cfd85a93fd&redirect_uri=https%3a%2f%2fcrm.quxiangkeji.com%2fcrm%2fuser%2fopenCallback&response_type=code&scope=snsapi_userinfo&state=3d6be0a4035d839573b04816624a415e#wechat_redirect'
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'login/login'
    // });
  };
  render() {
    return (
      <div className={`page ${style.login}`}>
        <WhiteSpace size="xl" />
        <img src={login_logo} alt="" />
        <div className={style.title}>客户管理后台</div>
        <div className={style.loginTips}>登陆需授权</div>
        <Button type="primary" onClick={this.submit}>
          确定
        </Button>
        <WhiteSpace />
      </div>
    );
  }
}

export default app;
