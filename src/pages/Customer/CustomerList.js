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
  async onSearchConditionChange(searchPair) {
    const { dispatch } = this.props;
    await dispatch({
      type: 'home/SEARCH_CONDITION_CHANGE',
      payload: searchPair,
    });
    if (
      searchPair.belongUserName ||
      searchPair.saleStatus ||
      searchPair.belongUserName === '' ||
      searchPair.saleStatus === ''
    ) {
      this.onSearch();
    }
  }
  showDetail(id, e) {
    e.preventDefault();
    let getTimestamp = new Date().getTime();
    router.push({
      pathname: '/customer-detail',
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
  // 筛选项---责任人姓名
  belongeNameChange(e, title) {
    this.setState({ realName: title });
    if (title === '不限责任人') {
      this.onSearchConditionChange({ belongUserName: '' });
    } else {
      this.onSearchConditionChange({ belongUserName: title });
    }

    this.onAccordionChange();
  }
  // 筛选项---销售阶段
  saleStatusChange(e, title) {
    this.setState({ saleStatus: title });
    if (title === '不限阶段') {
      this.onSearchConditionChange({ saleStatus: '' });
    } else {
      saleStatusList.map(item => {
        if (item.title === title) {
          this.onSearchConditionChange({ saleStatus: item.id });
        }
      });
    }

    this.onAccordionChange();
  }
  // 更多筛选---状态
  statusChange(e, id) {
    if (this.state.statusId === id) {
      this.setState({ statusId: '' });
      this.onSearchConditionChange({ status: '' });
    } else {
      this.setState({ statusId: id });
      this.onSearchConditionChange({ status: id });
    }

    // this.onAccordionChange()
  }
  // 更多筛选---级别
  levelChange(e, id) {
    if (this.state.levelId === id) {
      this.setState({ levelId: '' });
      this.onSearchConditionChange({ level: '' });
    } else {
      this.setState({ levelId: id });
      this.onSearchConditionChange({ level: id });
    }

    // this.onAccordionChange()
  }
  // 更多筛选---排序
  sortChange(e, id) {
    if (this.state.order === id) {
      this.setState({ order: '' });
      this.onSearchConditionChange({ order: '' });
    } else {
      this.setState({ order: id });
      this.onSearchConditionChange({ order: id });
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
                <span
                  onClick={this.showStatusDetail.bind(this, item.id)}
                  className={styles.status_panel}
                >
                  {item.saleStatus ? (
                    <b
                      style={{ marginRight: '5px' }}
                      className={item.saleStatus === 5 ? `${styles.spec_color}` : ''}
                    >
                      {item.saleStatus === 1
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
                  ) : (
                    ''
                  )}
                  {item.status ? (
                    <b
                      style={item.status ? null : { marginLeft: '37px' }}
                      className={item.status === 2 ? `${styles.spec_color}` : ''}
                    >
                      {item.status === 1
                        ? '正常'
                        : item.status === 2
                          ? '超时'
                          : item.status === 3
                            ? '关闭'
                            : item.status === 4
                              ? '回收'
                              : null}
                    </b>
                  ) : (
                    ''
                  )}
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
              </div>
            </Card.Body>
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
                <List.Item onClick={e => this.belongeNameChange(e, '不限责任人')}>
                  不限责任人
                </List.Item>
                {userForAssign &&
                  userForAssign.length > 0 &&
                  userForAssign.map((item, index) => (
                    <List.Item
                      key={index}
                      onClick={e => this.belongeNameChange(e, item.realName)}
                      //   v => {
                      //   this.setState({ realName: item.realName });
                      //   this.onAccordionChange();
                      // }}
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
              <div className={styles.search_select_more}>
                <div>级别:</div>
                {level.map((item, index) => (
                  <Button
                    className={styles.search_select_more_btn}
                    key={index}
                    type={item.id === levelId ? 'primary' : ''}
                    inline
                    size="small"
                    onClick={e => this.levelChange(e, item.id)}
                  >
                    {item.title}
                  </Button>
                ))}
                <div>状态:</div>
                {statusList.map((item, index) => (
                  <Button
                    className={styles.search_select_more_btn}
                    key={index}
                    type={item.id === statusId ? 'primary' : ''}
                    inline
                    size="small"
                    onClick={e => this.statusChange(e, item.id)}
                  >
                    {item.title}
                  </Button>
                ))}
                <div>排序:</div>
                <Button
                  className={styles.search_select_more_btn}
                  type={order === 0 ? 'primary' : ''}
                  inline
                  size="small"
                  onClick={e => this.sortChange(e, 0)}
                >
                  高-中-低
                </Button>
                <Button
                  className={styles.search_select_more_btn}
                  type={order === 1 ? 'primary' : ''}
                  inline
                  size="small"
                  onClick={e => this.sortChange(e, 1)}
                >
                  低-中-高
                </Button>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    className={styles.search_select_more_btn}
                    type="primary"
                    inline
                    size="small"
                    onClick={e => {
                      this.onAccordionChange();
                      this.onSearch();
                    }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion>
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
      </div>
    );
  }
}

export default CustomerList;
