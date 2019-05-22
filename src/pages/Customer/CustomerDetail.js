import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { createForm } from 'rc-form';
import { Tabs, WhiteSpace, Icon, NavBar, Toast, Card, Grid } from 'antd-mobile';

import styles from './style.less';

// 引入图标
import baseIcon from '../../assets/customerDetail/base.svg';
import contactIcon from '../../assets/customerDetail/contact.svg';
import financeIcon from '../../assets/customerDetail/finance.svg';
import historyIcon from '../../assets/customerDetail/history.svg';
import otherIcon from '../../assets/customerDetail/other.svg';
import qualificationIcon from '../../assets/customerDetail/qualification.svg';

const data = [
  {
    id: 0,
    icon: baseIcon,
    text: '基本信息',
  },
  {
    id: 1,
    icon: qualificationIcon,
    text: '资质信息',
  },
  {
    id: 2,
    icon: financeIcon,
    text: '财务信息',
  },
  {
    id: 3,
    icon: otherIcon,
    text: '其他投入',
  },
  {
    id: 4,
    icon: contactIcon,
    text: '联系人',
  },

  {
    id: 5,
    icon: historyIcon,
    text: '变更历史',
  },
];

@connect(({ home, loading }) => ({
  ...home,
  loading: loading.effects['home/getCustomerDetail'],
}))
class customerDetail extends Component {
  state = {
    type: '',
    operating: 0,
    index: 0,
    render: false,
  };
  componentWillMount() {
    // Toast.loading('正在加载...',0);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const ID = this.props.location.query.id;
    this.setState({ ID });
    // dispatch({type: 'home/CLEAR_ALL'});

    dispatch({
      type: 'home/getCustomerDetail',
      payload: ID,
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/CLEAR_ALL',
    });
  }
  // 校验表单数据并提交
  validate = e => {
    // e.preventDefault();
    const { dispatch, tabsInfo, customerDetail } = this.props;
    const { type } = this.state;
    if (tabsInfo.nameExisted === 1) {
      if (tabsInfo.name === '') {
        Toast.fail('客户名称必填', 1);
        return;
      } else {
        Toast.fail('客户名称已存在', 1);
        return;
      }
    }
    if (!tabsInfo.foundTime === undefined) {
      tabsInfo.foundTime = '';
    }
    // 如果是编辑状态则带入客户ID
    if (customerDetail) {
      tabsInfo.customerId = customerDetail.id;
      if (!tabsInfo.belongUserId) {
        tabsInfo.belongUserId = customerDetail.belongUserId;
      }
      if (!tabsInfo.name) {
        tabsInfo.name = customerDetail.name;
      }
    }

    if (!tabsInfo.name || tabsInfo.name === '') {
      Toast.fail('客户名称必填', 1);
      return;
    }
    if (!tabsInfo.belongUserId || tabsInfo.belongUserId === '') {
      Toast.fail('当前责任人不能为空', 1);
      return;
    }
    if (type === 'detail') {
      dispatch({
        type: 'home/updateCustomerInfo',
        payload: tabsInfo,
      });
      this.setState({ operating: 0 });
    } else {
      dispatch({
        type: 'home/submitCustomerForm',
        payload: tabsInfo,
      });
    }
  };
  //   状态修改等
  gotoChangeStatus(type, e) {
    const { ID } = this.state;
    router.push({
      pathname: '/change-status',
      query: { type, id: ID },
    });
  }
  //   详细信息对应的icon
  gotoDetailClassification(e) {
    const { ID } = this.state;
    router.push({
      pathname: '/detail-classification',
      query: { id: ID, icon: e.id },
    });
  }

  render() {
    const { customerDetail } = this.props;
    const { operating } = this.state;
    return (
      <div
        className={`${styles.page} ${styles.customerDetail_panel}`}
        style={{ background: 'white' }}
      >
        <NavBar
          style={{ background: '#002140' }}
          mode="dark"
          leftContent={
            operating === 0 ? (
              <Icon type="left" size="lg" />
            ) : (
              <span
                onClick={() => {
                  this.setState({ operating: 0 });
                  Toast.loading('重载中...', 2);
                  window.location.reload();
                }}
              >
                取消
              </span>
            )
          }
          onLeftClick={() => {
            operating === 0 ? history.back(-1) : null;
          }}
        >
          客户详情
        </NavBar>
        <div style={{ marginTop: '45px' }}>
          {customerDetail && (
            <Card className={styles.list_card}>
              <Card.Header title={customerDetail.name} />
              <Card.Body>
                <div className={styles.status_panel}>
                  <span>
                    {customerDetail.saleStatus ? (
                      <b
                        style={{ marginRight: '5px' }}
                        className={
                          customerDetail.saleStatus === 5
                            ? `${styles.spec_color} ${styles.normal}`
                            : styles.normal
                        }
                      >
                        {customerDetail.saleStatus && customerDetail.saleStatus === 1
                          ? '线索'
                          : customerDetail.saleStatus === 2
                            ? '沟通'
                            : customerDetail.saleStatus === 3
                              ? '面谈'
                              : customerDetail.saleStatus === 4
                                ? '签约'
                                : customerDetail.saleStatus === 5
                                  ? '合作'
                                  : null}
                      </b>
                    ) : (
                      ''
                    )}
                    {customerDetail.status ? (
                      <b
                        style={customerDetail.status ? null : { marginLeft: '37px' }}
                        className={customerDetail.status === 2 ? `${styles.spec_color}` : ''}
                      >
                        {customerDetail.status === 1
                          ? '正常'
                          : customerDetail.status === 2
                            ? '超时'
                            : customerDetail.status === 3
                              ? '关闭'
                              : customerDetail.status === 4
                                ? '回收'
                                : null}
                      </b>
                    ) : (
                      ''
                    )}
                  </span>
                </div>
                <div className={styles.col}>
                  <div style={{ width: '100%' }}>
                    <div className={styles.spec}>
                      <div style={{ width: '48%' }}>
                        联系人：
                        <b>
                          {customerDetail.contactInfos &&
                            customerDetail.contactInfos.length > 0 &&
                            customerDetail.contactInfos[0].name}
                        </b>
                      </div>
                      <div>
                        电话：
                        <b>
                          {customerDetail.contactInfos &&
                            customerDetail.contactInfos.length > 0 &&
                            customerDetail.contactInfos[0].phone}
                        </b>
                      </div>
                    </div>
                    <div className={styles.spec}>
                      <div style={{ width: '48%' }}>
                        责任人：
                        <b>{customerDetail.belongUserName}</b>
                      </div>
                      <div>
                        级别：
                        <b>
                          {customerDetail.level && customerDetail.level === 1
                            ? '高'
                            : customerDetail.level === 2
                              ? '中'
                              : customerDetail.level === 3
                                ? '低'
                                : null}
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
          <div className={styles.detail_footer_col}>
            <div onClick={this.gotoChangeStatus.bind(this, 0)}>阶段变更</div>
            <span>|</span>

            <div onClick={this.gotoChangeStatus.bind(this, 1)}>状态变更</div>
            <span>|</span>
            <div onClick={this.gotoChangeStatus.bind(this, 2)}>转移</div>
            {/* <Button
                    className={styles.btn}
                    size="small"
                    // onClick={this.showModal(1)}
                    data-id={customerDetail.id}
                  >
                    阶段变更
                  </Button> */}
          </div>
        </div>
        <div className={styles.detail_grid}>
          <Grid
            data={data}
            activeStyle={false}
            onClick={this.gotoDetailClassification.bind(this)}
          />
        </div>
        {/* <WhiteSpace /> */}
      </div>
    );
  }
}

const customerDetailWrapper = createForm()(customerDetail);
export default customerDetailWrapper;
