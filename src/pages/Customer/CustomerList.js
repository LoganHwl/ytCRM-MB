import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, SearchBar, Button, WhiteSpace, Toast, ListView,PullToRefresh, Accordion, List,NavBar,Icon } from 'antd-mobile';
import Header from '../Base/header';

import styles from './style.less';

import triangle from '../../assets/Triangle.svg';
import triangleActive from '../../assets/Triangle-active.svg';


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
      activeArr: [],
      statusId: '',
      levelId: '',
      order: '',
      hasChoice: false,
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
    document.body.style.position = 'static';
    Toast.loading('正在加载...', 0);
  }
  componentWillUnmount() {
    this.setState({ activeKey: '' });
    // 清除状态
    this.props.dispatch({
      type: 'home/CLEAR_ALL',
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // debugger
    dispatch({
      type: 'home/getUserForAssign',
    });
    this.onSearch();
  }

  // 下拉
  // onRefresh = () => {
  //    const {startPage}=this.props
  //   const { page } = this.state;
  //   let p = startPage - 1;
  //   if(p <=0){
  //     return
  //   }
  //   debugger
  //   this.setState({ page: p });
  //   this.onSearch();
  // };
  // 上拉加载
  onEndReached = () => {
    const {startPage}=this.props
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    let p = startPage + 1;
    this.setState({ isLoading: true, page: p });
    this.onSearch(1);
  };

  // 分页&过滤查询客户列表数据
  async onSearch(v) {
    const { dispatch, search } = this.props;
    const { pageSize, page, customerList } = this.state;
      dispatch({
        type: 'home/CHANGE_PAGENO',
        startPage: v === 1 ? page : 1,
      });
    const params = {
      startPage:v === 1 ? page : 1,
      pageSize,
    };
    for (const [key, value] of Object.entries(search)) {
      if (value) {
        params[key] = value;
      }
    };
   
    // debugger
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
    // e.preventDefault();
    let getTimestamp = new Date().getTime();
    router.push({
      pathname: '/customer-detail',
      query: { type: 'detail', id },
    });
    this.props.dispatch({
      type: 'home/CANONREFRESH_CHANGE'
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
    this.props.dispatch({
      type: 'home/CANONREFRESH_CHANGE'
    });
  }
  // 电话一栏点击禁止进入详情页面
  stopDefaultEvent(e){
    e.stopPropagation();
  }

  // 重新刷新页面
  reload = () => {
    location.reload();
  };
  hideMask = () => {
    document.body.style.position = 'static';
    const { dispatch } = this.props;
    const { activeArr, activeKey, realName, saleStatus, statusId, levelId, order } = this.state;
    this.setState({ activeKey: '' });

    if (
      (realName === '不限责任人' && activeArr.includes(0)) ||
      (saleStatus === '不限阶段' && activeArr.includes(1)) ||
      (statusId === '' && levelId === '' && order === '' && activeArr.includes(2))
    ) {
      activeArr.splice(activeArr.findIndex(item => item === activeKey), 1);
      
      dispatch({
        type: 'home/ACTIVEARR_CHANGE',
        payload: activeArr,
      });
      this.setState({ activeArr });
    }
  };
  // 手风琴点击及选择对应筛选条件后回调
  showFilterPanel(v) {
    const {activeArr,search}=this.props
    const { activeKey, realName, saleStatus, statusId, levelId, order } = this.state;
    
    switch (v) {
      case 0:
        if (activeKey === 0) {
          document.body.style.position = 'static';
          this.setState({ activeKey: '' });
          if (search.realName === '不限责任人') {
            activeArr.splice(activeArr.findIndex(item => item === activeKey), 1);
            this.props.dispatch({
              type: 'home/ACTIVEARR_CHANGE',
              payload: activeArr,
            });
            this.setState({ activeArr });
          }
        } else {
          document.body.style.position = 'fixed';         
          activeArr.push(0);
          let arr = Array.from(new Set(activeArr));
          this.setState({ activeKey: 0, activeArr: arr });
          this.props.dispatch({
            type: 'home/ACTIVEARR_CHANGE',
            payload: arr,
          });
          if (
            (search.saleStatus === '不限阶段' && activeArr.includes(1)) ||
            (search.statusId === '' && search.levelId === '' && search.order === '' && activeArr.includes(2))
          ) {
            activeArr.splice(activeArr.findIndex(item => item === 1 || item === 2), 1);
            this.props.dispatch({
              type: 'home/ACTIVEARR_CHANGE',
              payload: activeArr,
            });
            this.setState({ activeArr });
          }
        }
        break;
      case 1:
        if (activeKey === 1) {
          document.body.style.position = 'static';
          this.setState({ activeKey: '' });
          if (search.saleStatus === '不限阶段') {
            activeArr.splice(activeArr.findIndex(item => item === activeKey), 1);
            this.props.dispatch({
              type: 'home/ACTIVEARR_CHANGE',
              payload: activeArr,
            });
            this.setState({ activeArr });
          }

          // debugger
        } else {
          document.body.style.position = 'fixed';
          activeArr.push(1);
          let arr = Array.from(new Set(activeArr));
          this.setState({ activeKey: 1, activeArr: arr });
          this.props.dispatch({
            type: 'home/ACTIVEARR_CHANGE',
            payload: arr,
          });

          if (
            (search.realName === '不限责任人' && activeArr.includes(0)) ||
            (search.statusId === '' && search.levelId === '' && search.order === '' && activeArr.includes(2))
          ) {
            activeArr.splice(activeArr.findIndex(item => item === 0 || item === 2), 1);
            this.props.dispatch({
              type: 'home/ACTIVEARR_CHANGE',
              payload: activeArr,
            });
            this.setState({ activeArr });
          }
          // debugger
        }
        break;
      case 2:
        if (activeKey === 2) {
          document.body.style.position = 'static';
          this.setState({ activeKey: '' });
          if (search.statusId === '' && search.levelId === '' && search.order === '') {
            activeArr.splice(activeArr.findIndex(item => item === activeKey), 1);
            this.props.dispatch({
              type: 'home/ACTIVEARR_CHANGE',
              payload: activeArr,
            });
            this.setState({ activeArr });
          }
          // debugger
        } else {
          document.body.style.position = 'fixed';
          activeArr.push(2);
          let arr = Array.from(new Set(activeArr));
          this.setState({ activeKey: 2, activeArr: arr });
          this.props.dispatch({
            type: 'home/ACTIVEARR_CHANGE',
            payload: arr,
          });
          if (
            (search.realName === '不限责任人' && activeArr.includes(0)) ||
            (search.saleStatus === '不限阶段' && activeArr.includes(1))
          ) {
            activeArr.splice(activeArr.findIndex(item => item === 0 || item === 1), 1);
            this.props.dispatch({
              type: 'home/ACTIVEARR_CHANGE',
              payload: activeArr,
            });
            this.setState({ activeArr });
          }
          // debugger
        }
        break;

      default:
        break;
    }
  }
  // 筛选项---责任人姓名
  belongeNameChange(e, title) {
    this.setState({ realName: title }, () => {
      this.showFilterPanel(0);
    });
    if (title === '不限责任人') {
      this.onSearchConditionChange({ belongUserName: '' });
    } else {
      this.onSearchConditionChange({ belongUserName: title });
    }
  }
  // 筛选项---销售阶段
  saleStatusChange(e, title) {
    document.body.style.position = 'static';
    this.setState({ saleStatus: title, activeKey: '' });
    if (title === '不限阶段') {
      this.onSearchConditionChange({ saleStatus: '' });
    } else {
      saleStatusList.map(item => {
        if (item.title === title) {
          this.onSearchConditionChange({ saleStatus: item.id });
        }
      });
    }
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
  searchInputFocus = () => {
    document.body.style.position = 'static';
    const { activeArr, activeKey, realName, saleStatus, statusId, levelId, order } = this.state;
    this.setState({ activeKey: '' });
   
    if (
      (realName === '不限责任人' && activeArr.includes(0)) ||
      (saleStatus === '不限阶段' && activeArr.includes(1)) ||
      (statusId === '' && levelId === '' && order === '' && activeArr.includes(2))
    ) {
      activeArr.splice(activeArr.findIndex(item => item === activeKey), 1);
      this.props.dispatch({
        type: 'home/ACTIVEARR_CHANGE',
        payload: activeArr,
      });
      this.setState({ activeArr });
    }
  };
  listScroll(){
    // console.log(window.scrollY);
    if(window.scrollY < 200){
      console.log('window.scrollY < 200')
    }

  }
  render() {
    const {
      // customerList,
      userForAssign,
      search,
      activeArr,
      canOnRefresh
    } = this.props;
    const {
      customer_value,
      dataSource,
      customerList,
      isLoading,
      noNet,
      realName,
      saleStatus,
      moreCondition,
      activeKey,
      // activeArr,
      statusId,
      levelId,
      order,
    } = this.state;
    //获取item进行展示
    const row = item => {
      return (
        <div className={styles.customerList_card}>
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
                      <a  onClick={this.stopDefaultEvent.bind(this)}
                        href={`tel:${item.contactInfos &&
                          item.contactInfos.length > 0 &&
                          item.contactInfos[0].phone}#mp.weixin.qq.com`}>
                        {item.contactInfos &&
                          item.contactInfos.length > 0 &&
                          item.contactInfos[0].phone
                        }
                      </a>
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
        {/* {activeKey !=='' ?<div className={styles.search_more_mask} onClick={this.hideMask}></div>:null}      */}
        <div>
        <NavBar
          style={{ background: '#002140' }}
          mode="dark"
          leftContent={<Icon type="left" size="lg" />}
          onLeftClick={() => {
            history.back(-1);
            this.props.dispatch({
              type: 'home/CLEAR_SEARCH',
            });
          }}
        >
          客户列表
        </NavBar>
          {/* <Header>客户列表</Header> */}
        </div>
        <div className={styles.search}>
          <div className={styles.search_top}>
            <SearchBar
              className={styles.search_input}
              value={customer_value}
              placeholder="搜索客户名"
              showCancelButton
              onFocus={this.searchInputFocus}
              onSubmit={() => this.onSearch()}
              onChange={value => {
                this.setState({ customer_value: value });
                this.onSearchConditionChange({ name: value });
              }}
            />
            {/* <Button
              className={styles.search_btn}
              type="default"
              size="small"
              inline
              onClick={() => this.onSearch()}
            >
              搜索
            </Button> */}
          </div>
          <div className={styles.search_bottom}>
            <div
              className={styles.search_select}
              style={{ textAlign: 'left' }}
              onClick={this.showFilterPanel.bind(this, 0)}
            >
              <span
                className={styles.title}
                style={activeArr && activeArr.includes(0) ? { color: 'rgba(25, 144, 255, 1)' } : {}}
              >
                {search && search.belongUserName?search.belongUserName:realName}
              </span>
              <img src={activeKey === 0 ? triangleActive : triangle} alt="" />
            </div>
            <div className={styles.search_select} onClick={this.showFilterPanel.bind(this, 1)}>
              <span style={activeArr && activeArr.includes(1) ? { color: 'rgba(25, 144, 255, 1)' } : {}}>
              {search && search.saleStatus?search.saleStatus === 1 ?'线索':
              search.saleStatus === 2 ?'沟通':
              search.saleStatus === 3 ?'面谈':
              search.saleStatus === 4 ?'签约':
              search.saleStatus === 5 ?'合作':'不限阶段':saleStatus}
              </span>
              <img src={activeKey === 1 ? triangleActive : triangle} />
            </div>
            <div
              className={styles.search_select}
              style={{ textAlign: 'right' }}
              onClick={this.showFilterPanel.bind(this, 2)}
            >
              <span style={activeArr && activeArr.includes(2) ? { color: 'rgba(25, 144, 255, 1)' } : {}}>
                更多筛选
              </span>
              <img src={activeKey === 2 ? triangleActive : triangle} />
            </div>
          </div>

          {activeKey === 0 ? (
            <div className={styles.wrap}>
              <div className={styles.filterList} ref="filterList">
                <List>
                  <List.Item
                    onClick={e => {
                      this.belongeNameChange(e, '不限责任人');
                      // activeArr.splice(activeArr.findIndex(item => item === 0), 1);
                      // this.props.dispatch({
                      //   type: 'home/ACTIVEARR_CHANGE',
                      //   payload: activeArr,
                      // });
                      // this.setState({ activeArr });
                    }}
                  >
                    不限责任人
                  </List.Item>
                  {userForAssign &&
                    userForAssign.length > 0 &&
                    userForAssign.map((item, index) => (
                      <List.Item
                        key={index}
                        onClick={e => this.belongeNameChange(e, item.realName)}
                      >
                        {item.realName}
                      </List.Item>
                    ))}
                  {/* <WhiteSpace size="xs" style={{background:'white'}}/> */}
                </List>
                <div className={styles.search_more_mask} onClick={this.hideMask} />
              </div>
            </div>
          ) : activeKey === 1 ? (
            <div className={styles.wrap}>
              <div className={styles.filterList}>
                <List>
                  <List.Item
                    onClick={e => {
                      this.saleStatusChange(e, '不限阶段');
                      // activeArr.splice(activeArr.findIndex(item => item === 1), 1);
                      // this.props.dispatch({
                      //   type: 'home/ACTIVEARR_CHANGE',
                      //   payload: activeArr,
                      // });
                      // this.setState({ activeArr });
                    }}
                  >
                    不限阶段
                  </List.Item>
                  {saleStatusList.map((item, index) => (
                    <List.Item key={index} onClick={e => this.saleStatusChange(e, item.title)}>
                      {item.title}
                    </List.Item>
                  ))}
                </List>
                <div className={styles.search_more_mask} onClick={this.hideMask} />
              </div>
            </div>
          ) : activeKey === 2 ? (
            <div className={styles.wrap}>
              <div className={`${styles.filterList} ${styles.search_select_more}`}>
                <div className={styles.search_select_more_position}>
                  <div>级别:</div>
                  {level.map((item, index) => (
                    <Button
                      className={styles.search_select_more_btn}
                      key={index}
                      type={item.id === search.level ? 'primary' : ''}
                      style={
                        item.id === search.level
                        // levelId
                          ? null
                          : { background: 'rgba(247,247,247,1)', color: '#BCBCBC' }
                      }
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
                      style={
                        item.id === statusId
                          ? null
                          : { background: 'rgba(247,247,247,1)', color: '#BCBCBC' }
                      }
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
                    style={
                      order === 0 ? {} : { background: 'rgba(247,247,247,1)', color: '#BCBCBC' }
                    }
                    inline
                    size="small"
                    onClick={e => this.sortChange(e, 0)}
                  >
                    高-中-低
                  </Button>
                  <Button
                    className={styles.search_select_more_btn}
                    type={order === 1 ? 'primary' : ''}
                    style={
                      order === 1 ? {} : { background: 'rgba(247,247,247,1)', color: '#BCBCBC' }
                    }
                    inline
                    size="small"
                    onClick={e => this.sortChange(e, 1)}
                  >
                    低-中-高
                  </Button>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      className={styles.search_select_more_btn}
                      // style={{border:'none'}}
                      type="primary"
                      inline
                      size="small"
                      onClick={e => {
                        document.body.style.position = 'static';
                        this.setState({ activeKey: '' });
                        this.onSearch();
                      }}
                    >
                      确定
                    </Button>
                  </div>
                </div>
                <div className={styles.search_more_mask} onClick={this.hideMask} />
              </div>
            </div>
          ) : null}
        </div>

        <WhiteSpace size="md" />
        <div style={{ marginTop: '115px' }} className="list_view_panel" ref="list_view_panel">
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
                        点击重试
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
              onScroll={this.listScroll.bind(this)}
              scrollRenderAheadDistance={500}
              onEndReached={this.onEndReached}
              // pullToRefresh={
              //   canOnRefresh === true && <PullToRefresh
              //   // refreshing={this.state.refreshing}
              //   onRefresh={this.onRefresh}
              // />}
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
                    点击重试
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
