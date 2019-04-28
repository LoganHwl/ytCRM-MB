import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, WhiteSpace, Icon, NavBar, Toast, Button } from 'antd-mobile';
import Card_Home from '@/components/Card_Home';

import new_customer from '@/assets/home/new_customer.svg';
import customer_list from '@/assets/home/customer_list.svg';
import data from '@/assets/home/data.svg';
import user_management from '@/assets/home/user_management.svg';

import styles from './home.less';

@connect(({login, home, loading }) => ({
  ...home,
  ...login,
  loading: loading.effects['home/getWarningList'],
}))
class app extends Component {
  state = { noNet: false ,roleId:''};
  componentWillMount() {
    document.body.style.position = 'static';
    Toast.loading('正在加载...', 0);
  }
  async componentDidMount() {
    const { dispatch } = this.props;
    
    await dispatch({
      type: 'login/getUserInfo',
    });
    const roleId = sessionStorage.getItem('roleId');
    this.setState({roleId});
    const res = await dispatch({
      type: 'home/getWarningList',
      payload: {
        startPage: 1,
        pageSize: 100,
      },
    });
    if (res !== false) {
      if (res === 'Failed to fetch') {
        this.setState({ noNet: true });
      }
      Toast.hide();
    }else {
      Toast.fail(res.msg,1)
    }
  }
  showDetail(id, e) {
    // e.preventDefault();
    let getTimestamp = new Date().getTime();
    router.push({
      pathname: '/customer-detail',
      query: { type: 'detail', id, timestamp: getTimestamp },
    });
  }
  showStatusDetail(id, e) {
    e.stopPropagation();
    // e.preventDefault();
    let getTimestamp = new Date().getTime();
    router.push({
      pathname: '/status-detail',
      query: { id, timestamp: getTimestamp },
    });
  }

  // 重新刷新页面
  reload = () => {
    location.reload();
  };

  cardList = [
    { id: 1, title: '新增用户', src: new_customer },
    { id: 2, title: '客户列表', src: customer_list },
    { id: 3, title: '数据统计', src: data },
    { id: 4, title: '用户管理', src: user_management },
  ];
  cardList_noPermission = [
    { id: 1, title: '新增用户', src: new_customer },
    { id: 2, title: '客户列表', src: customer_list },
    { id: 3, title: '数据统计', src: data },
  ];
  render() {
    const { warningList } = this.props;
    const {roleId} =this.state
    return (
      <div className={styles.page}>
        <NavBar style={{ background: '#002140' }} mode="dark">
          客户管理后台
        </NavBar>
        <div className={styles.title}>
          <Card_Home list={roleId == 1 ? this.cardList:this.cardList_noPermission} />
          <div className={styles.warn_title}>超时预警</div>
        </div>
        <div className={styles.timeout_warn}>
          <WhiteSpace size="md" />
          {this.state.noNet ? (
            <div style={{ textAlign: 'center', color: 'grey', marginTop: '60px' }}>
              <h4 style={{ color: 'grey' }}>网络请求出错~</h4>
              <WhiteSpace />
              <Button
                onClick={this.reload}
                type="primary"
                size="small"
                style={{ width: '32%', margin: '0 auto' }}
              >
                点击重试
              </Button>
            </div>
          ) : (
            warningList &&
            warningList.list &&
            warningList.list.length > 1 ?
            warningList.list.map((item, index) => (
              <Card
                key={index}
                className={styles.warn_card}
                onClick={this.showDetail.bind(this, item.id)}
              >
                <Card.Header
                  title={item.name}
                  // thumb=""
                  extra={
                    <span
                      className={styles.warn_card_status}
                      onClick={this.showStatusDetail.bind(this, item.id)}
                    >
                      <b className={styles.warn_card_status_text}>
                        {item.saleStatus && item.saleStatus === 1
                          ? '线索'
                          : item.saleStatus === 2
                            ? '沟通'
                            : item.saleStatus === 3
                              ? '面谈'
                              : item.saleStatus === 4
                                ? '签约'
                                : item.saleStatus === 5
                                  ? '合作'
                                  : null}
                      </b>
                      {/* <b
                            style={item.customerStatus ? { marginLeft: '15px' } : { marginLeft: '37px' }}
                            className={
                              item.customerStatus && item.customerStatus === 2
                                ? `${styles.spec_color} ${styles.normal}`
                                : styles.normal
                            }
                          >
                            {item.customerStatus && item.customerStatus === 1
                              ? '正常'
                              : item.customerStatus === 2
                                ? '超时'
                                : item.customerStatus === 3
                                  ? '关闭'
                                  : item.customerStatus === 4
                                    ? '回收'
                                    : null}
                          </b> */}
                    </span>
                  }
                />
                <Card.Body>
                  <div className={styles.spec}>
                    <div>
                      责&ensp;任&ensp;人：
                      <b>{item.belongUserName}</b>
                    </div>
                    <div>
                      级&emsp;&emsp;别：
                      <b>
                        {item.level && item.expireStatus === 1
                          ? '高'
                          : item.expireStatus === 2
                            ? '中'
                            : item.expireStatus === 3
                              ? '低'
                              : null}
                      </b>
                    </div>
                    <div>
                    过期日期：
                    <b style={item.expireStatus === 3 ? { color: 'red' } : { color: 'black' }}>
                        {item.expireTime}
                      </b>
                    </div>
                  </div>
                </Card.Body>
                {/* <Card.Footer
                  content={
                    <div>
                      过期日期：
                      <b style={item.expireStatus === 3 ? { color: 'red' } : { color: 'black' }}>
                        {item.expireTime}
                      </b>
                    </div>
                  }
                /> */}
              </Card>
            ))
            :
            <div style={{ marginTop: '6em', textAlign: 'center', fontSize: '16px', color: '#999999' }}>暂无数据~</div>
          )      
      }
        </div>
      </div>
    );
  }
}

export default app;
