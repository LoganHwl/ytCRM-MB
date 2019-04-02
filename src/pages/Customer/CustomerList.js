import React, { Component } from 'react';
import { connect } from 'dva';
import { NavBar, Card, SearchBar, Flex, Button, WhiteSpace, Icon, Modal, Toast, TextareaItem, InputItem, } from 'antd-mobile';
import { createForm } from 'rc-form';

import styles from './style.less'
import { Select, Radio } from 'antd';
// import 'antd/lib/select/style/index.css';
const Option = Select.Option;
const RadioGroup = Radio.Group;

@connect(({ home, loading }) => ({
  ...home,
  loading: loading.effects['home/getWarningList'],
}))

class CustomerList extends Component {
  state = {
    modal1: false,
    key: '',
    value: 1,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getWarningList',
      payload: {
        startPage: 1,
        pageSize: 100
      }
    });
  }
  showDetail() {

  }
  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      modal1: true,
      key
    });
  }
  onClose =(key)=>(e) => {
    this.setState({
      modal1: false
    });
  }
  // 是否重置销售阶段
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  render() {
    const {
      warningList,
      // form:{
      //   getFieldProps 
      // }
    } = this.props
    const { key } = this.state
    return (
      <div className={styles.page}>
        <div>
          <NavBar
            mode="dark"
            //   icon={<Icon type="left" />}
            leftContent={<Icon type="left" size='md' />}
            onLeftClick={() => console.log('onLeftClick')}
          >客户列表</NavBar>
        </div>
        <div className={styles.search}>
          <div className={styles.search_top}>
            <SearchBar
              className={styles.search_input}
              value={this.state.value}
              placeholder="搜索客户名"
              onSubmit={value => console.log(value, 'onSubmit')}
              onClear={value => console.log(value, 'onClear')}
              onFocus={() => console.log('onFocus')}
              onBlur={() => console.log('onBlur')}
              onCancel={() => console.log('onCancel')}
              showCancelButton
              onChange={this.onChange}
            />
            <Button className={styles.search_btn} type="default" size="small" inline>搜索</Button>
          </div>
          <div className={styles.search_bottom}>
            <Select
              className={styles.search_select}
              placeholder="责任人"
              allowClear={true}

            // onChange={value => this.onSearchConditionChange({ order: value })}
            >
              <Option value={'1'}>小洛不黄</Option>
              <Option value={'0'}>小洛好黄</Option>
            </Select>
            <Select
              className={styles.search_select}
              style={{ width: '12.5%' }}
              placeholder="级别"
              allowClear={true}

            // onChange={value => this.onSearchConditionChange({ order: value })}
            >
              <Option value={1}>高</Option>
              <Option value={2}>中</Option>
              <Option value={3}>低</Option>
            </Select>
            <Select
              className={styles.search_select}
              style={{ width: '12.5%' }}
              placeholder="阶段"
              allowClear={true}

            // onChange={value => this.onSearchConditionChange({ order: value })}
            >
              <Option value={'1'}>小洛不黄</Option>
              <Option value={'0'}>小洛好黄</Option>
            </Select>
            <Select
              className={styles.search_select}
              style={{ width: '12.5%' }}
              placeholder="状态"
              allowClear={true}

            // onChange={value => this.onSearchConditionChange({ order: value })}
            >
              <Option value={'1'}>小洛不黄</Option>
              <Option value={'0'}>小洛好黄</Option>
            </Select>
            <Select
              className={styles.search_select}
              style={{ width: '12.5%', margin: '0 0 0 0.5em' }}
              placeholder="排序"
              allowClear={true}

            // onChange={value => this.onSearchConditionChange({ order: value })}
            >
              <Option value={'1'}>小洛不黄</Option>
              <Option value={'0'}>小洛好黄</Option>
            </Select>
          </div>
        </div>

        <WhiteSpace size="md" />
        {warningList && warningList.list && warningList.list.length > 1 && warningList.list.map((item, index) => (
          <Card key={index} className={styles.list_card} onClick={this.showDetail.bind(this)}>
            <Card.Header
              title={item.name}
              // thumb=""
              extra={
                <span>
                  <b style={{ color: '#D48265', fontSize: '12px' }}>{
                    item.expireStatus &&
                      item.expireStatus === 1 ? '线索' :
                      item.expireStatus === 2 ? '沟通' :
                        item.expireStatus === 3 ? '面谈' :
                          item.expireStatus === 4 ? '签约' :
                            item.expireStatus === 5 ? '合作' : null
                  }</b>
                  {/* <b>超时</b> */}
                </span>
              }
            />
            <Card.Body>
              <div className={styles.col}>
                <div style={{ width: '90%' }}>
                  <div className={styles.spec}>
                    <div style={{ width: '48%' }}>联系人：<b>{item.belongUserName}</b></div>
                    <div>电话：<b>{item.level &&
                      item.expireStatus === 1 ? '高' :
                      item.expireStatus === 2 ? '13517289446' :
                        item.expireStatus === 3 ? '低' : null
                    }</b></div>
                  </div>
                  <div className={styles.spec}>
                    <div style={{ width: '48%' }}>责任人：<b>{item.belongUserName}</b></div>
                    <div>级别：<b>{item.level &&
                      item.expireStatus === 1 ? '高' :
                      item.expireStatus === 2 ? '中' :
                        item.expireStatus === 3 ? '低' : null
                    }</b></div>

                  </div>
                </div>
                <div style={{ width: '10%', textAlign: 'right', margin: '1em -0.3em 0 0' }}>
                  <div> <Icon type="right" size='md' /></div>
                </div>
              </div>

            </Card.Body>
            <Card.Footer extra={
              <div className={styles.col}>
                <Button className={styles.btn} size="small" onClick={this.showModal(1, this)}>阶段变更</Button>
                <Button className={styles.btn} size="small" onClick={this.showModal(2, this)}>状态变更</Button>
                <Button className={styles.btn} size="small" onClick={this.showModal(3, this)} style={{ margin: '1em 0 1em 0.3em' }}>转移</Button>
              </div>
            } />
          </Card>
        ))}
              {/* 弹窗 */}
              <Modal
                  visible={this.state.modal1}
                  transparent
                  maskClosable={false}
                  onClose={this.onClose()}
                  title={key === 1 ? '更新阶段信息' : key === 2 ? '更新状态信息' : key === 3 ? '负责人转移' : ''}
                  wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                  footer={[
                    {
                      text: '取消',
                      onPress: () => {this.onClose()(); } 
                    },
                    {
                      text: '确定',
                      onPress: value => new Promise((resolve, reject) => {
                        Toast.info('onPress promise reject', 1);
                        setTimeout(() => {
                          reject();
                          console.log(`value:${value}`);
                        }, 1000);
                      }),
                    },
                  ]}
                  
                 
                >
                  {key === 1 ?
                    <div className={styles.modal_body}>
                      <div>阶段变更：</div>
                      <div className={styles.stage} >
                        <span>线索</span>
                        <span>线索</span>
                        <span>线索</span>
                        <span>线索</span>
                        <span>线索</span>
                      </div>
                      <div>阶段备注：</div>
                      <div>
                        <TextareaItem
                          placeholder="填写阶段备注"
                          rows={3}
                          data-seed="logId"
                          ref={el => this.autoFocusInst = el}
                          autoHeight
                        />
                      </div>
                    </div>

                    : key === 2 ?
                      <div className={styles.modal_body}>
                        <div>状态变更：</div>
                        <div className={styles.stage} >
                          <span>线索</span>
                          <span>线索</span>
                          <span>线索</span>
                          <span>线索</span>
                          <span>线索</span>
                        </div>
                        <div>状态备注：</div>
                        <div>
                          <TextareaItem
                            placeholder="填写状态备注"
                            rows={3}
                            data-seed="logId"
                            ref={el => this.autoFocusInst = el}
                            autoHeight
                          />
                        </div>
                      </div>
                      : key === 3 ?
                        <div className={styles.modal_body}>
                          <div className={styles.transfer} >
                            <span>转给：</span>
                            <Select
                              className={styles.principal_select}
                              style={{ width: '80%' }}
                              placeholder="选择负责人"
                              allowClear={true}

                            // onChange={value => this.onSearchConditionChange({ order: value })}
                            >
                              <Option value={'1'}>小洛不黄</Option>
                              <Option value={'0'}>小洛好黄</Option>
                            </Select>

                          </div>
                          <div style={{ marginTop: '.8em', display: 'flex' }}>
                            <span> 销售阶段：</span>
                            <RadioGroup onChange={this.onChange} value={this.state.value} style={{ width: '70%' }}>
                              <Radio value={1}>保留当前阶段</Radio>
                              <Radio value={2}>重置为线索</Radio>
                            </RadioGroup>
                          </div>
                        </div>
                        : null
                  }             
                </Modal>
      </div>
    );
  }
}

export default CustomerList;
