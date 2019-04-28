import React, { Component } from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { Tabs, WhiteSpace, Icon, NavBar, Toast } from 'antd-mobile';

import BasicInputWrapper from '../../components/Tabs/base';

import styles from './style.less';

@connect(({ home, tabs, loading }) => ({
  ...home,
  ...tabs,
  loading: loading.effects['home/getCustomerDetail'],
}))
class AddCustomer extends Component {
  state = {
    type: '',
    operating: 0,
    index: 0,
    render: false,
  };
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/CLEAR_ALL',
    });

    const type = this.props.location.query.type;
    this.setState({ type });
  }
  componentDidMount() {}
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/CLEAR_ALL',
    });
  }
  // 校验表单数据并提交
  validate = e => {
    // e.preventDefault();
    const { dispatch, tabsInfo } = this.props;
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

    if (!tabsInfo.name || tabsInfo.name === '') {
      Toast.fail('客户名称必填', 1);
      return;
    }
    if (!tabsInfo.belongUserId || tabsInfo.belongUserId === '') {
      Toast.fail('当前责任人不能为空', 1);
      return;
    }
    dispatch({
      type: 'home/submitCustomerForm',
      payload: tabsInfo,
    });
  };

  render() {
    const {
      customerDetail,
      form: { getFieldDecorator },
      tabsInfo,
    } = this.props;
    const { type, operating, render } = this.state;
    return (
      <div className={styles.page} style={{ background: 'white' }}>
        <NavBar
          style={{ background: '#002140' }}
          mode="dark"
          leftContent={<Icon type="left" size="lg" />}
          onLeftClick={() => {
            history.back(1);
          }}
          rightContent={<span onClick={this.validate}>保存</span>}
        >
          新增客户
        </NavBar>

        <div style={{ marginTop: '45px' }}>
          <BasicInputWrapper />
        </div>
      </div>
    );
  }
}

const AddCustomerWrapper = createForm()(AddCustomer);
export default AddCustomerWrapper;
