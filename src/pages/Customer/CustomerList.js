import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Card,
  SearchBar,
  Button,
  WhiteSpace,
  Icon,
  Modal,
  Toast,
  TextareaItem,
  ListView,
  Accordion,
  List,
} from 'antd-mobile';
import { createForm } from 'rc-form';
import Header from '../Base/header';

import styles from './style.less';
import { Select, Radio } from 'antd';
// import 'antd/lib/select/style/index.css';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const saleStatusList = [
  {
    id: 1,
    title: '线索',
  },
  {
    id: 2,
    title: '沟通',
  },
  {
    id: 3,
    title: '面谈',
  },
  {
    id: 4,
    title: '签约',
  },
  {
    id: 5,
    title: '合作',
  },
];
const statusList = [
  {
    id: 1,
    title: '正常',
  },
  {
    id: 2,
    title: '超时',
  },
  {
    id: 3,
    title: '关闭',
  },
  {
    id: 4,
    title: '回收',
  },
];
const level = [
  {
    id: 1,
    title: '高',
  },
  {
    id: 2,
    title: '中',
  },
  {
    id: 3,
    title: '低',
  },
];

@connect(({ home, loading }) => ({
  ...home,
  loading: loading.effects['home/getCustomerList'],
}))
class CustomerList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      modal1: false,
      key: '',
      customer_value: '',
      page: 1,
      pageSize: 20,
      saleStatusNum: null,
      saleStatusNumChange: null,
      statusNum: null,
      statusNumChange: null,
      remark: '',
      customerId: '',
      userId: '',
      radio_value: false,
      isLoading: true,
      dataSource: ds,
      customerList: [],
      noNet: false,
      realName: '不限责任人',
      saleStatus: '不限阶段',
      moreCondition: '更多筛选',
      activeKey: '',
      statusId: '',
      levelId: '',
      order: '',
    };
  }
  componentWillReceiveProps(nextState) {
    if (nextState.customerList !== this.state.customerList) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextState.customerList),
      });
    }
  }
  componentWillMount() {
    Toast.loading('正在加载...', 0);
  }
  onEndReached = () => {
    const { page } = this.state;
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    let p = page + 1;
    this.setState({ isLoading: true, page: p });
    this.onSearch(1);
  };

  componentWillUnmount() {
    // 清除状态
    this.props.dispatch({
      type: 'home/CLEAR_ALL',
    });
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getUserForAssign',
    });
    this.onSearch();
  }
  // 分页&过滤查询客户列表数据
  async onSearch(v) {
    const { dispatch, search } = this.props;
    const { pageSize, page, customerList } = this.state;

    dispatch({
      type: 'home/CHANGE_PAGENO',
      startPage: page,
    });

    const params = {
      startPage: page,
      pageSize,
    };

    for (const [key, value] of Object.entries(search)) {
      if (value) {
        params[key] = value;
      }
    }
    const res = await dispatch({
      type: 'home/getCustomerList',
      payload: params,
    });
    if (res && res.list) {
      if (v === 1) {
        let list = customerList.concat(res.list);
        this.setState({ isLoading: false, customerList: list });
      } else {
        this.setState({ isLoading: false, customerList: res.list });
      }
      Toast.hide();
    } else if (res === 'Failed to fetch') {
      Toast.hide();
      this.setState({ noNet: true, isLoading: false });
    }
  }
  // 存储搜索条件
  onSearchConditionChange(searchPair) {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/SEARCH_CONDITION_CHANGE',
      payload: searchPair,
    });
  }
  showDetail(id, e) {
    e.preventDefault();
    let getTimestamp = new Date().getTime();
    router.push({
      pathname: '/customer-add',
      query: { type: 'detail', id, timestamp: getTimestamp },
    });
  }
  showStatusDetail(id, e) {
    e.stopPropagation();
    e.preventDefault();
    let getTimestamp = new Date().getTime();
    router.push({
      pathname: '/status-detail',
      query: { id, timestamp: getTimestamp },
    });
  }
  // 打开模态框
  showModal = key => e => {
    e.stopPropagation();
    e.preventDefault(); // 修复 Android 上点击穿透
    const { customerList } = this.state;
    const cutomerId = e.currentTarget.dataset.id;
    if (customerList && cutomerId) {
      customerList && customerList.length > 0
        ? customerList.map(item => {
            if (item.id === Number(cutomerId)) {
              if (key === 1) {
                this.setState({
                  customerId: item.id,
                  saleStatusNum: item.saleStatus,
                  saleStatusNumChange: item.saleStatus,
                });
              } else if (key === 2) {
                this.setState({
                  customerId: item.id,
                  statusNum: item.status,
                  statusNumChange: item.status,
                });
              } else if (key === 3) {
                this.setState({
                  customerId: item.id,
                });
              }
            }
          })
        : '';
    }

    this.setState({
      modal1: true,
      key,
    });
  };

  // 阶段变更
  saleStatusClick(id, e) {
    this.setState({
      saleStatusNumChange: id,
    });
  }
  // 状态变更
  statusClick(id, e) {
    this.setState({
      statusNumChange: id,
    });
  }
  // 阶段&状态备注信息
  valueChange(value) {
    this.setState(value);
  }
  // 负责人变更
  principalChange(value) {
    this.setState(value);
  }
  // 关闭模态框
  onClose = () => () => {
    this.setState({
      modal1: false,
      remark: '',
      customerId: '',
      radio_value: false,
    });
  };
  // 提交阶段&状态&负责人的更改
  submitChange = key => () => {
    const { dispatch } = this.props;
    const {
      remark,
      customerId,
      saleStatusNum,
      saleStatusNumChange,
      statusNum,
      statusNumChange,
      radio_value,
      userId,
    } = this.state;
    if (key === 1) {
      const params = {
        remark,
        customerId,
        status: saleStatusNumChange === null ? saleStatusNum : saleStatusNumChange,
      };
      dispatch({
        type: 'home/changeSaleInfo',
        payload: params,
      }).then(res => {
        if (res.code === 0) {
          Toast.success('修改成功', 1);
          this.onClose()();
          this.onSearch();
        } else {
          Toast.fail(res.msg, 1);
          return;
        }
      });
    } else if (key === 2) {
      const params = {
        remark,
        customerId,
        status: statusNumChange === null ? statusNum : statusNumChange,
      };
      dispatch({
        type: 'home/changeStatusInfo',
        payload: params,
      }).then(res => {
        if (res.code === 0) {
          Toast.success('修改成功', 1);
          this.onClose()();
          this.onSearch();
        } else {
          Toast.fail(res.msg, 1);
          return;
        }
      });
    } else if (key === 3) {
      const params = {
        userId,
        customerId,
        flush: radio_value,
      };
      dispatch({
        type: 'home/changeBelong',
        payload: params,
      }).then(res => {
        if (res.code === 0) {
          Toast.success('修改成功', 1);
          this.onClose()();
          this.onSearch();
        } else {
          Toast.fail(res.msg, 1);
          return;
        }
      });
    }
  };
  // 是否重置销售阶段
  onChange = e => {
    this.setState({
      radio_value: e.target.value,
    });
  };
  // 重新刷新页面
  reload = () => {
    location.reload();
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'home/getUserForAssign',
    // });
    // this.onSearch();
  };

  // 手风琴点击及选择对应筛选条件后回调
  onAccordionChange = e => {
    if (!e) {
      this.setState({ activeKey: '' });
    } else if (e) {
      this.setState({ activeKey: e });
    }
  };
  // 筛选项---销售阶段
  saleStatusChange(e, title) {
    this.setState({ saleStatus: title });
    if (title === '不限阶段') {
      this.onSearchConditionChange({ saleStatus: '' });
    }
    saleStatusList.map(item => {
      if (item.title === title) {
        this.onSearchConditionChange({ saleStatus: item.id });
      }
    });
    this.onAccordionChange();
  }
  // 更多筛选---状态
  statusChange(e, id) {
    if (this.state.levelId === id) {
      this.setState({ statusId: '' });
    } else {
      this.setState({ statusId: id });
    }

    // this.onAccordionChange()
  }
  // 更多筛选---级别
  levelChange(e, id) {
    if (this.state.levelId === id) {
      this.setState({ levelId: '' });
    } else {
      this.setState({ levelId: id });
    }

    // this.onAccordionChange()
  }
  // 更多筛选---排序
  sortChange(e, id) {
    if (this.state.order === id) {
      this.setState({ order: '' });
    } else {
      this.setState({ order: id });
    }

    // this.onAccordionChange()
  }
  render() {
    const {
      // customerList,
      userForAssign,
    } = this.props;
    const {
      key,
      customer_value,
      radio_value,
      saleStatusNum,
      saleStatusNumChange,
      statusNum,
      statusNumChange,
      dataSource,
      customerList,
      isLoading,
      noNet,
      realName,
      saleStatus,
      moreCondition,
      activeKey,
      statusId,
      levelId,
      order,
    } = this.state;
    //获取item进行展示
    const row = item => {
      return (
        <div>
          <Card
            key={item.id}
            className={styles.list_card}
            onClick={this.showDetail.bind(this, item.id)}
          >
            <Card.Header
              title={item.name}
              // thumb=""
              extra={
                <span onClick={this.showStatusDetail.bind(this, item.id)} style={{ zIndex: 999 }}>
                  <b
                    className={
                      item.saleStatus && item.saleStatus === 5
                        ? `${styles.spec_color} ${styles.normal}`
                        : styles.normal
                    }
                  >
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
                  <b
                    style={item.status ? { marginLeft: '15px' } : { marginLeft: '37px' }}
                    className={
                      item.status && item.status === 2
                        ? `${styles.spec_color} ${styles.normal}`
                        : styles.normal
                    }
                  >
                    {item.status && item.status === 1
                      ? '正常'
                      : item.status === 2
                        ? '超时'
                        : item.status === 3
                          ? '关闭'
                          : item.status === 4
                            ? '回收'
                            : null}
                  </b>
                </span>
              }
            />
            <Card.Body>
              <div className={styles.col}>
                <div style={{ width: '100%' }}>
                  <div className={styles.spec}>
                    <div style={{ width: '48%' }}>
                      联系人：
                      <b>
                        {item.contactInfos &&
                          item.contactInfos.length > 0 &&
                          item.contactInfos[0].name}
                      </b>
                    </div>
                    <div>
                      电话：
                      <b>
                        {item.contactInfos &&
                          item.contactInfos.length > 0 &&
                          item.contactInfos[0].phone}
                      </b>
                    </div>
                  </div>
                  <div className={styles.spec}>
                    <div style={{ width: '48%' }}>
                      责任人：
                      <b>{item.belongUserName}</b>
                    </div>
                    <div>
                      级别：
                      <b>
                        {item.level && item.level === 1
                          ? '高'
                          : item.level === 2
                            ? '中'
                            : item.level === 3
                              ? '低'
                              : null}
                      </b>
                    </div>
                  </div>
                </div>
                {/* <div style={{ width: '10%', textAlign: 'right', margin: '1em -0.3em 0 0' }}>
                  <div>
                    {' '}
                    <Icon type="right" size="md" />
                  </div>
                </div> */}
              </div>
            </Card.Body>
            {/* <Card.Footer
              extra={
                <div className={styles.col}>
                  <Button
                    className={styles.btn}
                    size="small"
                    onClick={this.showModal(1)}
                    data-id={item.id}
                  >
                    阶段变更
                  </Button>
                  <Button
                    className={styles.btn}
                    size="small"
                    onClick={this.showModal(2)}
                    data-id={item.id}
                  >
                    状态变更
                  </Button>
                  <Button
                    className={styles.btn}
                    size="small"
                    onClick={this.showModal(3)}
                    data-id={item.id}
                    style={{ margin: '1em 0 1em 0.3em' }}
                  >
                    转移
                  </Button>
                </div>
              }
            /> */}
          </Card>
        </div>
      );
    };
    return (
      <div className={styles.page}>
        <div>
          <Header>客户列表</Header>
        </div>
        <div className={styles.search}>
          <div className={styles.search_top}>
            <SearchBar
              className={styles.search_input}
              value={customer_value}
              placeholder="搜索客户名"
              showCancelButton
              onChange={value => {
                this.setState({ customer_value: value });
                this.onSearchConditionChange({ name: value });
              }}
            />
            <Button
              className={styles.search_btn}
              type="default"
              size="small"
              inline
              onClick={() => this.onSearch()}
            >
              搜索
            </Button>
          </div>
          <Accordion
            accordion
            activeKey={activeKey}
            openAnimation={{}}
            className={styles.search_bottom}
            onChange={this.onAccordionChange}
          >
            <Accordion.Panel key={'0'} header={realName} className={styles.search_select}>
              <List className="my-list">
                <List.Item
                  onClick={v => {
                    this.setState({ realName: '不限责任人' });
                    this.onAccordionChange();
                  }}
                >
                  不限责任人
                </List.Item>
                {userForAssign &&
                  userForAssign.length > 0 &&
                  userForAssign.map((item, index) => (
                    <List.Item
                      key={index}
                      onClick={v => {
                        this.setState({ realName: item.realName });
                        this.onAccordionChange();
                      }}
                    >
                      {item.realName}
                    </List.Item>
                  ))}
              </List>
            </Accordion.Panel>
            <Accordion.Panel key={'1'} header={saleStatus} className={styles.search_select}>
              <List className="my-list">
                <List.Item onClick={e => this.saleStatusChange(e, '不限阶段')}>不限阶段</List.Item>
                {saleStatusList.map((item, index) => (
                  <List.Item key={index} onClick={e => this.saleStatusChange(e, item.title)}>
                    {item.title}
                  </List.Item>
                ))}
              </List>
            </Accordion.Panel>
            <Accordion.Panel key={'2'} header={moreCondition} className={styles.search_select}>
              <div>级别:</div>
              {level.map((item, index) => (
                <Button
                  key={index}
                  type={item.id === levelId ? 'primary' : ''}
                  inline
                  size="small"
                  style={{ marginRight: '4px' }}
                  onClick={e => this.levelChange(e, item.id)}
                >
                  {item.title}
                </Button>
              ))}
              <div>状态:</div>
              {statusList.map((item, index) => (
                <Button
                  key={index}
                  type={item.id === statusId ? 'primary' : ''}
                  inline
                  size="small"
                  style={{ marginRight: '4px' }}
                  onClick={e => this.statusChange(e, item.id)}
                >
                  {item.title}
                </Button>
              ))}
              <div>排序:</div>
              <Button
                type={order === 0 ? 'primary' : ''}
                inline
                size="small"
                style={{ marginRight: '4px' }}
                onClick={e => this.sortChange(e, 0)}
              >
                高-中-低
              </Button>
              <Button
                type={order === 1 ? 'primary' : ''}
                inline
                size="small"
                style={{ marginRight: '4px' }}
                onClick={e => this.sortChange(e, 1)}
              >
                低-中-高
              </Button>
            </Accordion.Panel>
          </Accordion>
          {/* <Select
              className={styles.search_select}
              placeholder="责任人"
              allowClear={true}
              onChange={value => this.onSearchConditionChange({ belongUserName: value })}
              dropdownMatchSelectWidth={false}
              // dropdownStyle={{width:"30%"}}
            >
              {userForAssign &&
                userForAssign.length > 0 &&
                userForAssign.map((item, index) => (
                  <Option key={index} value={item.realName}>
                    {item.realName}
                  </Option>
                ))}
            </Select>
            <Select
              className={styles.search_select}
              style={{ width: '13.5%' }}
              placeholder="级别"
              allowClear={true}
              onChange={value => this.onSearchConditionChange({ level: value })}
              dropdownMatchSelectWidth={false}
            >
              <Option value={1}>高</Option>
              <Option value={2}>中</Option>
              <Option value={3}>低</Option>
            </Select>
            <Select
              className={styles.search_select}
              style={{ width: '13.5%' }}
              placeholder="阶段"
              allowClear={true}
              onChange={value => this.onSearchConditionChange({ saleStatus: value })}
              dropdownMatchSelectWidth={false}
            >
              <Option value={1} style={{ width: '110%' }}>
                线索
              </Option>
              <Option value={2} style={{ width: '110%' }}>
                沟通
              </Option>
              <Option value={3} style={{ width: '110%' }}>
                面谈
              </Option>
              <Option value={4} style={{ width: '110%' }}>
                签约
              </Option>
              <Option value={5} style={{ width: '110%' }}>
                合作
              </Option>
            </Select>
            <Select
              className={styles.search_select}
              style={{ width: '13.5%' }}
              placeholder="状态"
              allowClear={true}
              onChange={value => this.onSearchConditionChange({ status: value })}
              dropdownMatchSelectWidth={false}
            >
              <Option value={1} style={{ width: '110%' }}>
                正常
              </Option>
              <Option value={2} style={{ width: '110%' }}>
                超时
              </Option>
              <Option value={3} style={{ width: '110%' }}>
                关闭
              </Option>
              <Option value={4} style={{ width: '110%' }}>
                回收
              </Option>
            </Select>
            <Select
              className={styles.search_select}
              style={{ width: '13.5%', margin: '0 0 0 0.5em' }}
              placeholder="排序"
              allowClear={true}
              onChange={value => this.onSearchConditionChange({ order: value })}
              dropdownMatchSelectWidth={false}
            >
              <Option value={1}>低-中-高</Option>
              <Option value={0}>高-中-低</Option>
            </Select> */}
        </div>

        <WhiteSpace size="md" />
        <div style={{ marginTop: '115px' }}>
          {customerList && customerList.length > 0 ? (
            <ListView
              dataSource={dataSource.cloneWithRows(customerList)}
              renderFooter={() => (
                <div style={{ textAlign: 'center' }}>
                  {isLoading ? (
                    '拼命加载中...'
                  ) : noNet ? (
                    <div>
                      网络请求出错~
                      <Button
                        onClick={this.reload}
                        type="primary"
                        size="small"
                        style={{ width: '32%', margin: '0 auto' }}
                      >
                        点击重试~
                      </Button>
                    </div>
                  ) : (
                    '加载完毕'
                  )}
                </div>
              )}
              renderRow={row}
              // renderSeparator={separator}
              className="am-list"
              initialListSize={20}
              pageSize={20}
              useBodyScroll
              onScroll={() => {
                console.log('scroll');
              }}
              scrollRenderAheadDistance={500}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={20}
              // scrollEventThrottle={50}
            />
          ) : (
            <div style={{ marginTop: '200px', textAlign: 'center', color: '#999999' }}>
              {noNet ? (
                <div>
                  <h4 style={{ color: 'grey' }}>网络请求出错~</h4>
                  <WhiteSpace />
                  <Button
                    onClick={this.reload}
                    type="primary"
                    size="small"
                    style={{ width: '32%', margin: '0 auto' }}
                  >
                    点击重试~
                  </Button>
                </div>
              ) : (
                '暂无数据~'
              )}
            </div>
          )}
        </div>
        {/* 弹窗 */}
        <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={true}
          onClose={this.onClose()}
          title={
            key === 1 ? '更新阶段信息' : key === 2 ? '更新状态信息' : key === 3 ? '负责人转移' : ''
          }
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          footer={[
            {
              text: '取消',
              onPress: () => {
                this.onClose()();
              },
            },
            {
              text: '确定',
              onPress: () => {
                this.submitChange(key)();
              },
            },
          ]}
        >
          {key === 1 ? (
            <div className={styles.modal_body}>
              <div>阶段变更：</div>
              <div className={styles.stage}>
                {saleStatusList &&
                  saleStatusList.map((item, index) => (
                    <span
                      className={`${
                        (saleStatusNum === item.id) === saleStatusNumChange
                          ? styles.active
                          : item.id === saleStatusNumChange
                            ? styles.active
                            : saleStatusNum <= item.id
                              ? styles.normal
                              : null
                      }`}
                      key={index}
                      onClick={
                        saleStatusNum <= item.id ? this.saleStatusClick.bind(this, item.id) : null
                      }
                    >
                      {item.title}
                    </span>
                  ))}
              </div>
              <div>阶段备注：</div>
              <div>
                <TextareaItem
                  style={{ textAlign: 'left' }}
                  placeholder="填写阶段备注"
                  rows={3}
                  data-seed="logId"
                  ref={el => (this.autoFocusInst = el)}
                  autoheight="true"
                  onChange={value => this.valueChange({ remark: value })}
                />
              </div>
            </div>
          ) : key === 2 ? (
            <div className={styles.modal_body}>
              <div>状态变更：</div>
              <div className={styles.stage}>
                {statusList &&
                  statusList.map((item, index) => (
                    <span
                      className={`${
                        (statusNum === item.id) === statusNumChange
                          ? styles.active
                          : item.id === statusNumChange
                            ? styles.active
                            : statusNum <= item.id
                              ? styles.normal
                              : null
                      }`}
                      key={index}
                      onClick={statusNum <= item.id ? this.statusClick.bind(this, item.id) : null}
                    >
                      {item.title}
                    </span>
                  ))}
              </div>
              <div>状态备注：</div>
              <div>
                <TextareaItem
                  style={{ textAlign: 'left' }}
                  placeholder="填写状态备注"
                  rows={3}
                  data-seed="logId"
                  ref={el => (this.autoFocusInst = el)}
                  autoheight="true"
                  onChange={value => this.valueChange({ remark: value })}
                />
              </div>
            </div>
          ) : key === 3 ? (
            <div className={styles.modal_body}>
              <div className={styles.transfer}>
                <span>转给：</span>
                <Select
                  className={styles.principal_select}
                  style={{ width: '80%' }}
                  placeholder="选择负责人"
                  allowClear={true}
                  onChange={value => this.principalChange({ userId: value })}
                >
                  {userForAssign &&
                    userForAssign.length > 0 &&
                    userForAssign.map((item, index) => (
                      <Option key={index} value={item.id}>
                        {item.realName}
                      </Option>
                    ))}
                </Select>
              </div>
              <div style={{ marginTop: '.8em', display: 'flex' }}>
                <span> 销售阶段：</span>
                <RadioGroup value={radio_value} onChange={this.onChange} style={{ width: '70%' }}>
                  <Radio value={false}>保留当前阶段</Radio>
                  <Radio value={true}>重置为线索</Radio>
                </RadioGroup>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    );
  }
}

export default CustomerList;
