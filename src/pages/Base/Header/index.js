import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import PropTypes from 'prop-types';
import { connect } from 'dva';

class Header extends Component {
  PropTypes = {};

  state = {};
  //展开侧边栏
  iconClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/updateNavLeftVisible',
      payload: true,
    });
  };
  render() {
    return (
      <NavBar
        style={{ background: '#002140' }}
        mode="dark"
        leftContent={<Icon type="left" size="lg" />}
        onLeftClick={() => {
          //window.location.href=document.referrer;
          history.back(1);
        }}
        // rightContent={this.props.children}
      >
        {this.props.children}
      </NavBar>
      // React.Children.map(this.props.children, function (child) {
      //   debugger
      //   return <NavBar
      //   mode="dark"
      //   leftContent={<Icon type="left" size='lg' />}
      //   onLeftClick={() => { window.location.href=document.referrer;}}
      //   rightContent={child}
      // >
      // {child}
      // </NavBar>
      // })
    );
  }
}

export default Header;
