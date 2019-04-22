import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Header from '../Base/header';
import {
  Card,
  SearchBar,
  Button,
  WhiteSpace,
  Toast,
  ListView,
  Accordion,
  List,
} from 'antd-mobile';

import MyCard from '../../components/Card';
import styles from './userManager.less';

const searchTypeList = [
  {
    id: 0,
    title: '姓名',
  },
  {
    id: 1,
    title: '昵称',
  },
  {
    id: 2,
    title: '手机',
  },
];

@connect(({ home }) => ({
  ...home,
}))
class userManager extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    // this.handleSearch = this.handleSearch.bind(this);

    // this.showMoreMsg = this.showMoreMsg.bind(this);
    this.getUserForAssign = this.getUserForAssign.bind(this);
    // this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      realName: '',
      mobile: '',
      modalVisible: false,
      itemData: {},
      startPage: 1,
      pageSize: 10,
      isUserForAssign: false,
      userId: '',
      isLoading: true,
      dataSource: ds,
      noNet: false,
      currentRoleId: '',
      userList: [],
      searchType: 0,
      searchValue: '',
      activeKey: '',
      searchTypeName: '姓名',
      roleId:''
    };
  }

  componentWillReceiveProps(nextState) {
    if (nextState.userList !== this.state.userList) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextState.userList),
      });
    }
  }
  componentWillMount() {
    Toast.loading('正在加载...', 0);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const roleId = sessionStorage.getItem('roleId');
    this.setState({roleId})
    dispatch({
      type: 'home/getAllRole',
    });
    this.handleSearch();
  }

  // 重新刷新页面
  reload = () => {
    location.reload();
  };
  onEndReached = () => {
    const { startPage } = this.state;
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    let p = startPage + 1;
    this.setState({ isLoading: true, startPage: p });
    this.handleSearch(1);
  };

  async handleSearch(v) {
    const { startPage, pageSize, userList, searchType, searchValue } = this.state;
    const params = {
      startPage,
      pageSize,
    };
    switch (searchType) {
      case 0:
        params.realName = searchValue;
        break;
      case 1:
        params.nickName = searchValue;
        break;
      case 2:
        params.mobile = searchValue;
        break;
      default:
        break;
    }
    const res = await this.props.dispatch({
      type: 'home/getUserList',
      payload: params,
    });
    if (res && res.list) {
      if (v === 1) {
        let list = userList.concat(res.list);
        this.setState({ isLoading: false, userList: list });
      } else {
        this.setState({ isLoading: false, userList: res.list });
      }
      Toast.hide();
    } else if (res === 'Failed to fetch') {
      Toast.hide();
      this.setState({ noNet: true, isLoading: false });
    }
  }
  onSearchConditionChange(v) {
    this.setState({ searchValue: v });
  }
  realNameValueChange(v) {
    this.setState({
      realName: v,
    });
  }
  mobileValueChange(v) {
    this.setState({
      mobile: v,
    });
  }
  // 获取人员分配并打开模态框
  getUserForAssign(detail) {
    let params ={
          userId: detail.id,
          roleId: detail.roleId,
          mobile: detail.mobile,
          realName: detail.realName,
    }

    router.push({
      pathname: '/user-change',
      query: { detail:JSON.stringify(params) },
    });
    // this.setState({
    //   isUserForAssign: true,
    //   userId: detail.id,
    //   currentRoleId: detail.roleId,
    //   mobile: detail.mobile,
    //   realName: detail.realName,
    //   modalVisible: true,
    // });
  }
  // 关闭模态框
  closeUserForAssign() {
    this.setState({ isUserForAssign: false, modalVisible: false });
  }
  // 分配角色数据提交
  async handleSubmitBelong(e) {
    e.preventDefault();

    const { dispatch } = this.props;
    const { realName, mobile, currentRoleId, userId } = this.state;

    if (!realName || !mobile || !currentRoleId) {
      Toast.fail('请填写完全再提交', 1);
      return;
    }
    if (!userId) {
      Toast.fail('缺少用户ID', 1);
      return;
    }
    const params = {
      realName,
      mobile,
      roleId: currentRoleId,
      userId,
    };
    await dispatch({
      type: 'home/setRole',
      payload: params,
    });
    this.handleSearch();
    this.closeUserForAssign();
  }
  // 手风琴点击及选择对应筛选条件后回调
  onAccordionChange = e => {
    if (!e) {
      this.setState({ activeKey: '' });
    } else if (e) {
      this.setState({ activeKey: e });
    }
  };
  // 筛选项
  async onStatusChange(e, id, title) {
    this.setState({
      searchType: id,
      searchTypeName: title,
    });
    this.onAccordionChange();
  }
  render() {
    const { allRole } = this.props;
    const {
      modalVisible,
      mobile,
      realName,
      isLoading,
      noNet,
      currentRoleId,
      dataSource,
      userList,
      isUserForAssign,
      activeKey,
      searchTypeName,
      roleId
    } = this.state;
    //获取item进行展示
    const row = item => {
      return (
        <MyCard key={item.id}>
          <Card.Body>
            <div className={styles.col}>
              <div className={styles.left}>
                <div className={styles.img_mask}>
                  <img src={item.headImgUrl} />
                </div>
                <span className={styles.role_name}>
                  {item.roleId && item.roleId === 1
                    ? '管理员'
                    : item.roleId === 2
                      ? '后端人员'
                      : item.roleId === 3
                        ? '销售人员'
                        : item.roleId === 4
                          ? '游客'
                          : null}
                </span>
              </div>
              <div className={styles.center}>
                <div>
                  <b>姓名：</b>
                  <span className={styles.col_span}>{item.realName}</span>
                </div>
                <div>
                  <b>昵称：</b>
                  <span className={styles.col_span}>{item.nickName}</span>
                </div>
                <div>
                  <b>手机：</b>
                  <span className={styles.col_span}>{item.mobile}</span>
                </div>
              </div>
              <div className={styles.right}>
                <div>
                  {roleId == 1 ?<Button
                    className={styles.btn}
                    size="small"
                    data-id={item.id}
                    onClick={() => {
                      this.getUserForAssign(item);
                    }}
                  >
                    修改
                  </Button>:null}
                  
                </div>
              </div>
            </div>
          </Card.Body>
        </MyCard>
      );
    };

    return (
      <div className={styles.page}>
        <Header>用户管理</Header>
        <div className={styles.search_condition}>
          <div className={styles.left}>
            <Accordion
              accordion
              activeKey={activeKey}
              openAnimation={{}}
              className={styles.search_accordion}
              onChange={this.onAccordionChange}
              style={{ width: '', margin: '' }}
            >
              <Accordion.Panel key={'0'} header={searchTypeName}>
                <List className="my-list">
                  {searchTypeList.map((item, index) => (
                    <List.Item
                      key={index}
                      onClick={e => this.onStatusChange(e, item.id, item.title)}
                    >
                      {item.title}
                    </List.Item>
                  ))}
                </List>
              </Accordion.Panel>
            </Accordion>
          </div>
          <div className={styles.center}>
            <SearchBar
              className={styles.search_input}
              placeholder="输入关键字搜索"
              showCancelButton
              onChange={value => {
                this.onSearchConditionChange(value);
              }}
            />
          </div>
          <div className={styles.right}>
            <Button
              className={styles.search_btn}
              type="default"
              size="small"
              inline
              onClick={() => this.handleSearch()}
            >
              搜索
            </Button>
          </div>
        </div>
        <div className={styles.userManager_card_panel} style={{ marginTop: '95px' }}>
          {userList && userList.length > 0 ? (
            <ListView
              dataSource={dataSource.cloneWithRows(userList)}
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
              className="userList"
              initialListSize={10}
              pageSize={10}
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

export default userManager;
