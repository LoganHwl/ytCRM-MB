import React, { Component } from 'react';
import { InputItem, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import Header from './header';
import NavLeft from './navLeft';

class Base extends Component {
  state = {
    // navLeftVisibility: false,
  };

  componentDidMount() {}

  render() {
    return (
      <>
        <div className="page">
          <Header />
          <div className="page-content">{this.props.children}</div>
        </div>
        <NavLeft {...this.props} />
      </>
    );
  }
}

export default Base;
