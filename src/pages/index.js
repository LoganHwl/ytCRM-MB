import React, { Component } from 'react';
import { connect } from 'dva';
import Fastclick from 'fastclick';
import Transiton from '@/components/Transition';
import '@/styles/base.less';

Fastclick.attach(document.body);
//从地址栏获取想要的参数
function GetQueryString() {
  var obg = {},
    a = '';
  (a = window.location.search.substr(1)) || (a = window.location.hash.split('?')[1]);
  if (!a) {
    return;
  }
  var reg = RegExp(/sig=(\S*)&/);
  if (a.match(reg)) {
    var sig = a.match(/sig=(\S*)&/)[1];
    var timeStamp = a.match(/timeStamp=(\S*)/)[1];
    var obg = {
      sig,
      timeStamp,
    };
    return obg;
  } else {
    return;
  }
}

@connect(({ login }) => ({
  ...login,
}))
class app extends Component {
  state = {};

  componentWillMount() {
    const res = GetQueryString();
    // 解码
    console.log('------', res);
    if (res) {
      if (window.atob(res.sig).includes(res.timeStamp) === true) {
        let t = window.atob(res.sig).split('_');
        console.log('token=====', t[1]);
        sessionStorage.setItem('userToken', t[1]);
      }
    }
    // sessionStorage.setItem('userToken', '250b26274c51c1e1fe182efb24db3733');
  }
  componentDidMount() {
    // 为元素添加事件监听
    //   document.body.addEventListener("touchmove", (ev) => {
    //     ev.preventDefault();
    // }, {
    //   passive: false //  禁止 passive 效果
    // })
  }

  render() {
    return <Transiton {...this.props}>{this.props.children}</Transiton>;
  }
}

export default app;
