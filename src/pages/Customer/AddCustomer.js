import React, { Component } from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { Tabs, WhiteSpace, Icon, NavBar,Toast } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import Header from '../Base/header';

import BasicInputWrapper from '../../components/Tabs/base';
import QualificationsWrapper from '../../components/Tabs/qualifications';
import FinanceWrapper from '../../components/Tabs/finance';
import FinanceDetailWrapper from '../../components/Tabs/finance_detail';
import OtherInputsWrapper from '../../components/Tabs/otherInputs';
import OtherInputsDetailWrapper from '../../components/Tabs/otherInputs_detail';

import ContactWrapper from '../../components/Tabs/contact';
import ContactDetailWrapper from '../../components/Tabs/contact_detail';

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
    index:0,
    render:false
  };
  tabs = [
    { title: '基本' },
    { title: '资质' },
    { title: '财务' },
    { title: '其他投入' },
    { title: '联系人' },
    { title: '变更历史' },
  ];
  tabs_add = [
    { title: '基本' },
    { title: '资质' },
    { title: '财务' },
    { title: '其他投入' },
    { title: '联系人' },
  ];
  // renderTabBar(props) {
  //   return (
  //     <Sticky>
  //       {({ style }) => (
  //         <div style={{ ...style, zIndex: 999,marginTop:'45px' }}>
  //           <Tabs.DefaultTabBar {...props} />
  //         </div>
  //       )}
  //     </Sticky>
  //   );
  // }
  componentWillMount() {
    
    const { dispatch } = this.props;
    const type = this.props.location.query.type;
    const ID = this.props.location.query.id;
    dispatch({type: 'home/CLEAR_ALL'});
    this.setState({ type });
    if (type === 'detail') {
      // Toast.loading('正在加载...',0);
      dispatch({
        type: 'home/getCustomerDetail',
        payload: ID,
      }).then(res => {
        // Toast.hide()
      });
    }
  }
  componentDidMount() {
    // Toast.hide()
  }
  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'home/CLEAR_ALL'
    });
  }
  // 校验表单数据并提交
  validate = e => {
    e.preventDefault();
    const { dispatch, tabsInfo,customerDetail } = this.props;
    const { type } = this.state;
    if(tabsInfo.nameExisted === 1 ){
      if(tabsInfo.name ===''){
        Toast.fail('客户名称必填', 1);
        return
      }else{
        Toast.fail('客户名称已存在', 1);
        return
      }
    }
    if(!tabsInfo.foundTime===undefined){
      tabsInfo.foundTime=''
    }
      // 如果是编辑状态则带入客户ID
      if(customerDetail){
        tabsInfo.customerId=customerDetail.id              
        if(!tabsInfo.belongUserId){
          tabsInfo.belongUserId=customerDetail.belongUserId
        }
        if(!tabsInfo.name){
          tabsInfo.name=customerDetail.name     
        }
      }

     
      if(!tabsInfo.name || tabsInfo.name===''){
        Toast.fail('客户名称必填', 1);
        return
      }
      if(!tabsInfo.belongUserId || tabsInfo.belongUserId===''){
        Toast.fail('当前责任人不能为空', 1);
        return
      }
// debugger
    if (type === 'detail') {
    
      dispatch({
        type: 'home/updateCustomerInfo',
        payload: tabsInfo
      });
      this.setState({ operating: 0 });
    }else{
      dispatch({
        type: 'home/submitCustomerForm',
        payload: tabsInfo
      })
    }
  };
tabClick=(e)=>{
  const {
    tabsInfo
  } = this.props;
  if(tabsInfo.nameExisted === 1){
    Toast.fail('客户名称已存在', 1);
  }else{
    Toast.fail('客户名称必填', 1);
  }
  
}
  render() {
    const {
      customerDetail,
      form: { getFieldDecorator },
      tabsInfo
    } = this.props;
    const { type, operating,render } = this.state   
    return (
      <div className={styles.add_page}>
      
        <NavBar
          style={{ background: '#002140' }}
          mode="dark"
          leftContent={
            type === 'add' ? (
              <Icon type="left" size="lg" />
            ) : type === 'detail' && operating === 0 ? (
              <Icon type="left" size="lg" />
            ) : type === 'detail' && operating === 1 ? (
              <span onClick={() =>{this.setState({ operating: 0 });Toast.loading('重载中...',2);window.location.reload() } }>取消</span>
              
            ) : (
              ''
            )
            }
          onLeftClick={() => {
            //window.location.href=document.referrer;
            type === 'add' ? history.back(1)
            :
            type === 'detail' && operating === 0 ? 
              history.back(1)
             :null

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
        {type === 'add' ?
          tabsInfo && tabsInfo.name && !tabsInfo.nameExisted ?
          null
          :
          <div onClick={this.tabClick} style={{width:'80%',height:'45px',margin:'45px 0 0 20%',position: 'fixed',zIndex:'10000'}}></div>
          :
          null
          }
        
          <Tabs tabs={type === 'add' ?this.tabs_add:operating===0?this.tabs:this.tabs_add} initalPage={0} swipeable={false}>
            <div className={styles.tab_pane}>
              {getFieldDecorator('base', {
              })(<BasicInputWrapper type={type} operating={type === 'detail'  ? operating : null} customerDetail={type === 'detail'  ? customerDetail : null}/>)}
            </div>
           
            <div className={styles.tab_pane} key='2'>
              <QualificationsWrapper operating={type === 'detail'  ? operating : null} customerDetail={type === 'detail'  ? customerDetail : null} />
            </div>
            <div className={styles.tab_pane}  style={{marginTop:'95px'}}>
            {type === 'detail'  ?
              <FinanceDetailWrapper operating={operating} customerDetail={customerDetail}/>
             :
              <FinanceWrapper/>
             }
              
            </div>
            

            <div className={styles.tab_pane}  style={{marginTop:'95px'}}>
            {type === 'detail'  ?
              <OtherInputsDetailWrapper operating={operating} customerDetail={customerDetail}/>
             :
              <OtherInputsWrapper/>
             }
            </div>

            <div className={styles.tab_pane}  style={{marginTop:'95px'}}>
            {type === 'detail'  ?
              <ContactDetailWrapper operating={operating} customerDetail={customerDetail}/>
             :
              <ContactWrapper/>
             }
            </div>
            {
              type==='detail'? 
            <div style={{marginTop:'95px'}}>
              <ChangeHistoryWrapper operating={type === 'detail'  ? operating : null} customerDetail={type === 'detail'  ? customerDetail : null}/>
            </div>:''
          }
           
          </Tabs>
        <WhiteSpace />
      </div>
    );
  }
}

const AddCustomerWrapper = createForm()(AddCustomer);
export default AddCustomerWrapper;
