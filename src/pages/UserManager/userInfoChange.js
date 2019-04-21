import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Header from '../Base/header';
import { List, InputItem, Button, Toast, Picker } from 'antd-mobile';

import styles from './userManager.less';

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
const resetOrKeep = [
  {
    id: 0,
    title: '保留当前阶段',
  },
  {
    id: 1,
    title: '重置为线索',
  },
];

@connect(({ home }) => ({
  ...home,
}))
class userInfoChange extends Component {
  state = {
    detail: {},
    selectedId: '',
    userId: '',
    remark: '',
    type: '',
    defaultStatus: null,
    list: [],
    belongUserName: null,
    userList: [],
    canSubmit: false,
  };

  userPickerList(value) {
    let BUlist = [];
    value.map(item => {
      let info = {};
      info.label = item.realName;
      info.value = item.id;
      BUlist.push(info);
    });
    this.setState({ userList: BUlist });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.userForAssign !== nextProps.userForAssign) {
      if (nextProps.userForAssign && nextProps.userForAssign.length > 0) {
        this.userPickerList(nextProps.userForAssign);
      }
    }
  }
  async componentWillMount() {
    const { dispatch, userForAssign } = this.props;
    await dispatch({
      type: 'home/getUserForAssign',
    });
    if (userForAssign && userForAssign.length > 0) {
      this.userPickerList(userForAssign);
    }
  }
  async componentDidMount() {
    const { dispatch, userForAssign } = this.props;
    await dispatch({
      type: 'home/getUserForAssign',
    });
    if (userForAssign && userForAssign.length > 0) {
      this.userPickerList(userForAssign);
    }
  }

  // 重新刷新页面
  reload = () => {
    location.reload();
  };
  // 点击选中的list
  statusChange(e, id) {
    if (this.state.selectedId === id) {
      this.setState({ selectedId: '', canSubmit: false });
    } else {
      this.setState({ selectedId: id, canSubmit: true });
    }
  }
  // 取消
  onCancel() {
    history.go(-1);
  }
  // 提交阶段&状态&负责人的更改
  submitChange(key, e) {
    const { dispatch } = this.props;
    const { detail, remark, selectedId, userId, defaultStatus } = this.state;
    if (key == 0) {
      const params = {
        remark,
        customerId: detail.id,
        status: selectedId === '' ? defaultStatus : selectedId,
      };
      dispatch({
        type: 'home/changeSaleInfo',
        payload: params,
      }).then(res => {
        if (res.code === 0) {
          Toast.success('修改成功', 1);
          setTimeout(() => {
            this.onCancel();
          }, 600);
        } else {
          Toast.fail(res.msg, 1);
          return;
        }
      });
    } else if (key == 1) {
      const params = {
        remark,
        customerId: detail.id,
        status: selectedId === '' ? defaultStatus : selectedId,
      };
      dispatch({
        type: 'home/changeStatusInfo',
        payload: params,
      }).then(res => {
        if (res.code === 0) {
          Toast.success('修改成功', 1);
          setTimeout(() => {
            this.onCancel();
          }, 600);
        } else {
          Toast.fail(res.msg, 1);
          return;
        }
      });
    } else if (key == 2) {
      const params = {
        userId,
        customerId: detail.id,
        flush: selectedId == 1 ? true : false,
      };
      dispatch({
        type: 'home/changeBelong',
        payload: params,
      }).then(res => {
        if (res.code === 0) {
          Toast.success('修改成功', 1);
          setTimeout(() => {
            this.onCancel();
          }, 600);
        } else {
          Toast.fail(res.msg, 1);
          return;
        }
      });
    }
  }
  // 负责人变更
  principalChange(value) {
    this.setState({ canSubmit: true, value });
  }
  // 备注信息
  remarkTextChange(v) {
    this.setState({ remark: v });
  }
  render() {
    const {
      selectedId,
      type,
      defaultStatus,
      list,
      belongUserName,
      userList,
      canSubmit,
    } = this.state;
    return (
      <div className={styles.page} style={{ background: 'white' }}>
        <Header>修改用户信息</Header>
        <div className={styles.status_panel}>
          <div className={styles.status_title}>
            <Picker
              data={userList}
              cols={1}
              value={belongUserName}
              placeholder="选择负责人"
              onChange={value => {
                this.setState({ belongUserName: value, userId: value[0], canSubmit: true });
              }}
            >
              <List.Item arrow="horizontal">转给:</List.Item>
            </Picker>
          </div>
          <div>
            <div className={styles.modal_list}>
              <span>真实姓名:</span>
              <InputItem
                size="small"
                placeholder="真实姓名"
                // defaultValue={realName}
                onChange={v => this.realNameValueChange(v)}
              />
            </div>
            <div className={styles.modal_list}>
              <span>手机号码:</span>
              <InputItem
                placeholder="手机号码"
                // defaultValue={mobile}
                onChange={v => this.mobileValueChange(v)}
              />
            </div>
          </div>
          <div className={styles.btn_panel}>
            <Button
              className={styles.btn}
              type="default"
              size="small"
              inline
              onClick={this.onCancel.bind(this)}
            >
              取消
            </Button>
            <Button
              className={styles.btn}
              type="primary"
              size="small"
              inline
              onClick={this.submitChange.bind(this, type)}
              disabled={canSubmit ? false : true}
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default userInfoChange;
