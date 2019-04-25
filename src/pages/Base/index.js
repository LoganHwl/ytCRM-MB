import React, { Component } from 'react';
import { connect } from 'dva';
import { InputItem, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import router from 'umi/router';
import cookie from 'react-cookies';
import Header from './header';


class Base extends Component {
  state = {
    // navLeftVisibility: false,
  };

  componentWillMount() {}


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
