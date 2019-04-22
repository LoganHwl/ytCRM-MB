import React, { Component } from 'react';
import { connect } from 'dva';
import { InputItem, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import router from 'umi/router';
import cookie from 'react-cookie';
import Header from './header';

const loginUser = () => {
  return cookie.load('current-user');
};

const isLogin = () => {
  const user = loginUser();
  return typeof (user) === 'object';
};

@connect(({ login }) => ({
  ...login,
}))
class Base extends Component {
  state = {
    // navLeftVisibility: false,
  };

  componentWillMount() {
 
    // setCookie('userToken','250b26274c51c1e1fe182efb24db3733');
    // const userToken = localStorage.getItem('user');
    // if(!userToken){
    //   router.push('/login');
    // }
    const { dispatch } = this.props;
    dispatch({
      type: 'login/getUserInfo',
    })
  }
  componentDidMount() {
    
    cookie.save('userToken', '250b26274c51c1e1fe182efb24db3733', { path: '/', maxAge:new Date().setDate(new Date().getDate()+30) });
    const user = cookie.load('userToken');
       
    // cookie.remove('userToken');
  //   if (!user.isLogin()) {
  //     router.push('/login');
  // }
    // const userToken = localStorage.getItem('userToken');
    debugger
    // if(!userToken){
    //   router.push('/login');
    // }
  }

  render() {
    return (
      <div className="page">
        {/* <Header /> */}
        <div className="page-content">{this.props.children}</div>
      </div>
    );
  }
}

export default Base;
