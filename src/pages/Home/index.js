import React, { Component } from 'react';
import { InputItem, Button, WhiteSpace, WingBlank, NoticeBar } from 'antd-mobile';
import Carousel from './model/Carousel';
import Card from '@/components/Card';
import img from '@/images/moon.png';

class app extends Component {
  state = {
    title: '欢迎来到夜听！！！！！欢迎来到夜听！！！！！欢迎来到夜听！！！！！',
  };
  cardList = [
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
    { title: '夜听大法', src: img },
  ];
  render() {
    const { title } = this.state;
    return (
      <div className="page">
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>{title}</NoticeBar>
        <Carousel />
        <Card list={this.cardList} />
      </div>
    );
  }
}

export default app;
