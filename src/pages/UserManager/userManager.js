import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Header from '../Base/header';
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
  InputItem,
  Accordion,
  List,
} from 'antd-mobile';
import { Select, Input } from 'antd';

import MyCard from '../../components/Card';
import styles from './userManager.less';

const Option = Select.Option;
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
    router.push({
      pathname: '/user-change',
      // query: { type, id: ID },
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
    } = this.state;
    //获取item进行展示
    const row = item => {
      return (
        <MyCard key={item.id}>
          <Card.Body>
            <div className={styles.col}>
              <div style={{ width: '24%' }}>
                <div style={{ background: '#000', width: '68px', borderRadius: '5px' }}>
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
              <div style={{ width: '56%' }}>
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
              <div style={{ width: '20%' }}>
                <div>
                  <Button
                    className={styles.btn}
                    size="small"
                    data-id={item.id}
                    onClick={() => {
                      this.getUserForAssign(item);
                    }}
                  >
                    修改
                  </Button>
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
          <div style={{ width: '25%', height: '45px' }}>
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
            {/* <Select
              // value={search.status}
              defaultValue={0}
              placeholder="姓名"
              allowClear={true}
              style={{ width: '6em', margin: '0 10px' }}
              onChange={value => this.setState({ searchType: value })}
            >
              <Option value={0}>姓名</Option>
              <Option value={1}>昵称</Option>
              <Option value={2}>手机</Option>
            </Select> */}
          </div>
          <div style={{ width: '55%', height: '45px' }}>
            <SearchBar
              className={styles.search_input}
              placeholder="输入关键字搜索"
              showCancelButton
              onChange={value => {
                this.onSearchConditionChange(value);
              }}
            />
          </div>
          <div style={{ width: '20%', height: '45px' }}>
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

        {/** 角色分配弹窗 */}
        <Modal
          visible={modalVisible}
          transparent
          maskClosable={true}
          onClose={this.closeUserForAssign.bind(this)}
          title="修改"
        >
          <div>
            <div className={styles.modal_list}>
              <span>真实姓名:</span>
              <InputItem
                size="small"
                placeholder="真实姓名"
                defaultValue={realName}
                onChange={v => this.realNameValueChange(v)}
              />
            </div>
            <div className={styles.modal_list}>
              <span>手机号码:</span>
              <InputItem
                placeholder="手机号码"
                defaultValue={mobile}
                onChange={v => this.mobileValueChange(v)}
              />
            </div>
            <div className={styles.modal_list}>
              <span>设置角色:</span>
              <Select
                onChange={value => this.setState({ currentRoleId: value })}
                value={currentRoleId}
                filterOption={false}
                dropdownMatchSelectWidth={false}
                // dropdownStyle={{width:"40%"}}
              >
                {allRole &&
                  allRole.data.length > 0 &&
                  allRole.data.map((item, index) => (
                    <Option key={index} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </div>
            <div className={styles.modal_btn}>
              <Button onClick={this.closeUserForAssign.bind(this)}>取消</Button>
              <Button
                onClick={this.handleSubmitBelong.bind(this)}
                style={{ marginLeft: '8%' }}
                type="primary"
              >
                确定
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default userManager;
