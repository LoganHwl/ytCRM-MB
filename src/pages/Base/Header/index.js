import React, { Component } from 'react';
import { NavBar,Icon } from 'antd-mobile';
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
            mode="dark"
            leftContent={<Icon type="left" size='md' />}
            onLeftClick={() => console.log('onLeftClick')}
          >
          {this.props.children}
          </NavBar>
    );
  }
}

export default Header;
