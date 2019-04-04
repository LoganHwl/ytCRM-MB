import React, { Component } from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { Tabs, WhiteSpace, Icon, NavBar } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import Header from '../Base/header';

import BasicInputWrapper from '../../components/Tabs/base';
import QualificationsWrapper from '../../components/Tabs/qualifications';
import FinanceWrapper from '../../components/Tabs/finance';
import OtherInputsWrapper from '../../components/Tabs/otherInputs';
import ContactWrapper from '../../components/Tabs/contact';
import ChangeHistoryWrapper from '../../components/Tabs/changeHistory';

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
  };
  tabs = [
    { title: '基本' },
    { title: '资质' },
    { title: '财务' },
    { title: '其他投入' },
    { title: '联系人' },
    { title: '变更历史' },
  ];
  renderTabBar(props) {
    return (
      <Sticky>
        {({ style }) => (
          <div style={{ ...style, zIndex: 1 }}>
            <Tabs.DefaultTabBar {...props} />
          </div>
        )}
      </Sticky>
    );
  }
  componentWillMount() {
    const { dispatch } = this.props;
    const type = this.props.location.query.type;
    const ID = this.props.location.query.id;
    this.setState({ type });
    if (type === 'detail') {
      dispatch({
        type: 'home/getCustomerDetail',
        payload: ID,
      }).then(res => {
        console.log('customerDetail===', res);
      });
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'home/getWarningList',
    //   payload: {
    //     startPage: 1,
    //     pageSize: 100
    //   }
    // });
  }
  // 校验表单数据并提交
  validate = e => {
    e.preventDefault();
    const { dispatch, tabsInfo } = this.props;
    const { type } = this.state;
    console.log(tabsInfo);
    debugger;
    if (type === 'detail') {
      this.setState({ operating: 0 });
    }

    // this.props.form.validateFields((err,values) => {
    //     debugger
    //     if (!err) {
    //         console.log(values);
    //       console.log(this.props.form.getFieldsValue('base'));
    //       debugger
    //     } else {
    //       alert('Validation failed');
    //     }
    //   });
  };

  render() {
    const {
      customerDetail,
      form: { getFieldDecorator },
    } = this.props;
    const { type, operating } = this.state;
    return (
      <div className={styles.add_page}>
        <NavBar
          style={{ background: '#002140' }}
          mode="dark"
          leftContent={<Icon type="left" size="lg" />}
          onLeftClick={() => {
            //window.location.href=document.referrer;
            history.back(1);
          }}
          rightContent={
            type === 'add' ? (
              <span onClick={this.validate}>保存</span>
            ) : type === 'detail' && operating === 0 ? (
              <span onClick={() => this.setState({ operating: 1 })}>编辑</span>
            ) : type === 'detail' && operating === 1 ? (
              <span onClick={this.validate}>保存</span>
            ) : (
              ''
            )
          }
        >
          {type === 'add' ? '新增客户' : type === 'detail' ? '客户详情' : ''}
        </NavBar>
        <StickyContainer>
          <Tabs tabs={this.tabs} initalPage={'t2'} renderTabBar={this.renderTabBar}>
            <form className={styles.tab_pane}>
              {getFieldDecorator('base', {
                // initialValue: customerDetail,
              })(<BasicInputWrapper />)}
            </form>
            <div className={styles.tab_pane}>
              {/* {getFieldDecorator('customerDetail', {
            initialValue: customerDetail,
          })(<QualificationsWrapper customerDetail={customerDetail?customerDetail:null}/>)} */}
              <QualificationsWrapper customerDetail={customerDetail ? customerDetail : null} />
            </div>
            <div className={styles.tab_pane}>
              <FinanceWrapper />
            </div>

            <div className={styles.tab_pane}>
              <OtherInputsWrapper />
            </div>

            <div className={styles.tab_pane}>
              <ContactWrapper />
            </div>
            <div>
              <ChangeHistoryWrapper />
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace />
      </div>
    );
  }
}

const AddCustomerWrapper = createForm()(AddCustomer);
export default AddCustomerWrapper;
