import React, { Component } from 'react';
import { connect } from 'dva';
import { InputItem, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import router from 'umi/router';
import Header from './header';

@connect(({ login }) => ({
  ...login,
}))
class Base extends Component {
  state = {
    // navLeftVisibility: false,
  };
  componentWillMount() {
    // const userToken = localStorage.getItem('user');
    // if(!userToken){
    //   router.push('/login');
    // }
    const { dispatch } = this.props;
    dispatch({
      type: 'login/getUserInfo',
    }).then(res => {
      //  let roleId= sessionStorage.getItem('roleId');
    });
  }
  componentDidMount() {
    const userToken = localStorage.getItem('userToken');
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
