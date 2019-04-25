import React, { Component } from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { WhiteSpace, Icon, NavBar, Toast } from 'antd-mobile';

import BasicInputWrapper from '../../components/Tabs/base_detail';
import QualificationsWrapper from '../../components/Tabs/qualifications';
import FinanceWrapper from '../../components/Tabs/finance';
import FinanceDetailWrapper from '../../components/Tabs/finance_detail';
import OtherInputsWrapper from '../../components/Tabs/otherInputs';
import OtherInputsDetailWrapper from '../../components/Tabs/otherInputs_detail';

import ContactWrapper from '../../components/Tabs/contact';
import ContactDetailWrapper from '../../components/Tabs/contact_detail';

import ChangeHistoryWrapper from '../../components/Tabs/changeHistory';

import styles from './style.less';

@connect(({ home, loading }) => ({
  ...home,
  loading: loading.effects['home/getCustomerDetail'],
}))
class customerDetailClassification extends Component {
  state = {
    icon: '',
    operating: 0,
    index: 0,
    render: false,
    ID: '',
  };
  componentWillReceiveProps(nextState) {
    if (nextState.operating !== this.state.operating) {
      this.forceUpdate()
    }
  }
  componentWillMount() {
    const { dispatch } = this.props;
    const icon = this.props.location.query.icon;
    const ID = this.props.location.query.id;
    // dispatch({type: 'home/CLEAR_ALL'});
    this.setState({ icon, ID });
    // Toast.loading('正在加载...',0);
    dispatch({
      type: 'home/getCustomerDetail',
      payload: ID,
    }).then(res => {
      // Toast.hide()
    });
  }
  componentDidMount() {
    // Toast.hide()
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/CLEAR_ALL',
    });
  }
  // 校验表单数据并提交
  validate = e => {
    e.preventDefault();
    const { dispatch, tabsInfo, customerDetail } = this.props;
    const { icon } = this.state;
    if (icon == 0) {
      if (tabsInfo.nameExisted === 1) {
        if (tabsInfo.name === '') {
          Toast.fail('客户名称必填', 1);
          return;
        } else {
          Toast.fail('客户名称已存在', 1);
          return;
        }
      }
      // 如果当前客户名称没有更改，则带入原来的数据
      if (!tabsInfo.name) {
        tabsInfo.name = customerDetail.name;
      }
      if (!tabsInfo.foundTime === undefined) {
        tabsInfo.foundTime = '';
      }
      // 保存原来的客户ID
      tabsInfo.customerId = customerDetail.id;
      // 如果当前责任人没有更改，则带入原来的数据
      if (!tabsInfo.belongUserId) {
        tabsInfo.belongUserId = customerDetail.belongUserId;
      }

      if (!tabsInfo.name || tabsInfo.name === '') {
        Toast.fail('客户名称必填', 1);
        return;
      }
      if (!tabsInfo.belongUserId || tabsInfo.belongUserId === '') {
        Toast.fail('当前责任人不能为空', 1);
        return;
      }
    } else {
      // 保存原来的客户ID
      tabsInfo.customerId = customerDetail.id;
      tabsInfo.belongUserId = customerDetail.belongUserId;
      tabsInfo.name = customerDetail.name;
    }
    customerDetail.customerId = customerDetail.id;
    // customerDetail.brandCount = Number(customerDetail.brandCount)
    // console.log(typeof(customerDetail.brandCount))
    // debugger
    dispatch({
      type: 'home/updateCustomerInfo',
      payload: customerDetail,
    });
    this.setState({ operating: 0 });
  };
  render() {
    const { customerDetail } = this.props;
    const { icon, operating, ID } = this.state;
    return (
      <div className={styles.page} style={icon == 0 || icon == 1 ? { background: 'white' } : null}>
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
                  Toast.loading('重载中...', 1);
                  window.location.reload();
                }}
              >
                取消
              </span>
            )
          }
          onLeftClick={() => {
            operating === 0 ? history.back(1) : null;
          }}
          rightContent={
            operating === 0 ? (
              icon != 5 ? (
                <span onClick={() => this.setState({ operating: 1 })}>编辑</span>
              ) : null
            ) : (
              <span onClick={this.validate}>保存</span>
            )
          }
        >
          {icon == 0
            ? '基本信息'
            : icon == 1
              ? '资质信息'
              : icon == 2
                ? '财务信息'
                : icon == 3
                  ? '其他投入'
                  : icon == 4
                    ? '联系人'
                    : icon == 5
                      ? '变更历史'
                      : null}
        </NavBar>

        {icon == 0 ? (
          <div className={styles.tab_pane} style={{ marginTop: '45px' }}>
            <BasicInputWrapper icon={icon} operating={operating} customerDetail={customerDetail} />
          </div>
        ) : icon == 1 ? (
          <div className={styles.tab_pane} style={{ marginTop: '45px' }}>
            <QualificationsWrapper operating={operating} customerDetail={customerDetail} />
          </div>
        ) : icon == 2 ? (
          <div className={styles.tab_pane} style={{ marginTop: '45px' }}>
            <FinanceDetailWrapper operating={operating} customerDetail={customerDetail} ID={ID} />
          </div>
        ) : icon == 3 ? (
          <div className={styles.tab_pane} style={{ marginTop: '45px' }}>
            <OtherInputsDetailWrapper
              operating={operating}
              customerDetail={customerDetail}
              ID={ID}
            />
          </div>
        ) : icon == 4 ? (
          <div className={styles.tab_pane} style={{ marginTop: '45px' }}>
            <ContactDetailWrapper operating={operating} customerDetail={customerDetail} ID={ID} />
          </div>
        ) : icon == 5 ? (
          <div className={styles.tab_pane} style={{ marginTop: '45px' }}>
            <ChangeHistoryWrapper operating={operating} customerDetail={customerDetail} />
          </div>
        ) : null}
      </div>
    );
  }
}

const customerDetailClassificationWrapper = createForm()(customerDetailClassification);
export default customerDetailClassificationWrapper;
