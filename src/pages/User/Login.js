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
    const { getFieldProps, getFieldError } = this.props.form;
    this.props.form.validateFields((error, values) => {
      if (error) {
        const msg = `请输入${getFieldError('user') || ''}${getFieldError('password') || ''}`;
        Toast.info(msg, 1);
        return;
      }
      // this.props.history.push({ pathname: '/home' })
      const { dispatch } = this.props;
      dispatch({
        type: 'common/login',
        payload: {
          ...values,
        },
      });
    });
  };
  normalize = (val, prev) => {
    if (!loginReg.test(val)) {
      Toast.info('不能包含中文和大写', 1);
      return prev;
    }
    return val;
  };
  render() {
    let errors;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`page ${style.login}`}>
        <div className={`${style['page-header']}`}>
          <label>夜听管理系统</label>
          <img src={avataSrc} alt="" />
        </div>
        <WhiteSpace size="xl" />
        <img src={login_logo} alt="" />

        <WhiteSpace size="xl" />
        <WhiteSpace size="xl" />
        <WhiteSpace size="xl" />
        <div>登陆需授权</div>
        <WhiteSpace size="xl" />
        <Button type="primary" onClick={this.submit}>
          确定
        </Button>
        <WhiteSpace />
      </div>
    );
  }
}

export default app;
