import React, { Component } from 'react';
import { connect } from 'dva';
import { Card,WhiteSpace,Icon } from 'antd-mobile';
import Card_Home from '@/components/Card_Home';

import new_customer from '@/assets/home/new_customer.svg';
import customer_list from '@/assets/home/customer_list.svg';
import data from '@/assets/home/data.svg';
import user_management from '@/assets/home/user_management.svg';

import styles from './home.less'


@connect(({ home, loading }) => ({
  ...home,
  loading: loading.effects['home/getWarningList'],
}))
class app extends Component {
  state = {
  };
  componentDidMount(){
 const { dispatch } = this.props;
    dispatch({
      type: 'home/getWarningList',
      payload:{
        startPage:1,
        pageSize:100
      }
    });
  }
  showDetail(){

  }
  cardList = [
    {id:1, title: '新增用户', src: new_customer },
    {id:2, title: '客户列表', src: customer_list },
    {id:3, title: '数据统计', src: data },
    {id:4, title: '用户管理', src:user_management  }
  ];
  render() {
    const{warningList}=this.props
    return (
      <div className={styles.page}>
      <div className={styles.title}>客户管理后台</div>
      <Card_Home list={this.cardList} />
      
      <div className={styles.timeout_warn} >
      <div className={styles.warn_title}>超时预警</div>
      <WhiteSpace size="md" />
      {warningList&&warningList.list&&warningList.list.length>1&&warningList.list.map((item,index)=>(
         <Card key={index} className={styles.warn_card} onClick={this.showDetail.bind(this)}>
         <Card.Header
           title={item.name}
           // thumb=""
           extra={
           <span> 
             <b>{
                 item.expireStatus&&
                 item.expireStatus===1?'线索':
                 item.expireStatus===2?'沟通':
                 item.expireStatus===3?'面谈':
                 item.expireStatus===4?'签约':
                 item.expireStatus===5?'合作':null
                 }</b>
             {/* <b>超时</b> */}
             </span>
             }
         />
         <Card.Body>
           <div className={styles.spec}>
             <div>责任人：<b>{item.belongUserName}</b></div>
             <div>级别：<b>{item.level&&
                 item.expireStatus===1?'高':
                 item.expireStatus===2?'中':
                 item.expireStatus===3?'低':null
                 }</b></div>
             <div> <Icon type="right" size='md' /></div>            
             </div>
         </Card.Body>
         <Card.Footer content={<div>过期日期：<b>{item.expireTime}</b></div>} />
       </Card>
      ))}
   
  </div>
      </div>
    );
  }
}

export default app;
