import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Header from '../Base/header';
import { InputItem, TextareaItem, Button, Toast } from 'antd-mobile';
import { Select } from 'antd';

import styles from './style.less';

const Option = Select.Option;

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
class dataStatistics extends Component {
  state = {
    detail: {},
    selectedId: '',
    userId: '',
    remark: '',
    type: '',
    defaultStatus: null,
    list: [],
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    const type = this.props.location.query.type;
    const id = this.props.location.query.id;
    this.setState({ type });
    dispatch({
      type: 'home/getUserForAssign',
    });
    const res = await dispatch({
      type: 'home/getCustomerDetail',
      payload: id,
    });
    if (res && res !== false) {
      if (type == 0) {
        this.setState({ defaultStatus: res.saleStatus, detail: res, list: saleStatusList });
      } else if (type == 1) {
        this.setState({ defaultStatus: res.status, detail: res, list: statusList });
      } else if (type == 2) {
        this.setState({ detail: res });
      }
    }
  }

  // 重新刷新页面
  reload = () => {
    location.reload();
  };
  // 点击选中的list
  statusChange(e, id) {
    if (this.state.selectedId === id) {
      this.setState({ selectedId: '' });
    } else {
      this.setState({ selectedId: id });
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
    } else if (key === 1) {
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
    } else if (key === 2) {
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
    this.setState(value);
  }
  // 备注信息
  remarkTextChange(v) {
    this.setState({ remark: v });
  }
  render() {
    const { userForAssign } = this.props;
    const { selectedId, type, defaultStatus, list } = this.state;
    return (
      <div className={styles.page} style={{ background: 'white' }}>
        <Header>
          {type == 0
            ? '更新阶段信息'
            : type == 1
              ? '更新状态信息'
              : type == 2
                ? '责任人转移'
                : null}
        </Header>
        <div className={styles.status_panel}>
          {type == 2 ? (
            <div className={styles.status_title}>
              <InputItem>转给:</InputItem>
              <Select
                className={styles.spec_select}
                placeholder="选择负责人"
                allowClear={true}
                dropdownMatchSelectWidth={false}
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
          ) : (
            <div>
              <div className={styles.status_title}>
                {type == 0 ? '阶段变更:' : type == 1 ? '状态变更:' : null}
              </div>
              {list.map((item, index) => (
                <div
                  key={item.id}
                  className={
                    defaultStatus && defaultStatus <= item.id
                      ? selectedId === '' && defaultStatus === item.id
                        ? `${styles.status_list} ${styles.status_list_active}`
                        : selectedId === item.id
                          ? `${styles.status_list} ${styles.status_list_active}`
                          : styles.status_list
                      : styles.status_list
                  }
                  onClick={
                    defaultStatus && defaultStatus <= item.id
                      ? e => this.statusChange(e, item.id)
                      : () => Toast.fail('不能往回修改！', 1)
                  }
                >
                  {item.title}
                </div>
              ))}
            </div>
          )}
          {type == 2 ? (
            <div>
              <div className={styles.status_title}>销售阶段:</div>
              {resetOrKeep.map((item, index) => (
                <div
                  key={item.id}
                  className={
                    selectedId === item.id
                      ? `${styles.status_list} ${styles.status_list_active}`
                      : styles.status_list
                  }
                  onClick={e => this.statusChange(e, item.id)}
                >
                  {item.title}
                </div>
              ))}
              <div style={{ height: '13em' }} />
            </div>
          ) : (
            <div>
              <div className={styles.status_title}>
                {type == 0 ? '阶段备注:' : type == 1 ? '状态备注:' : null}
              </div>
              <div className={styles.status_text}>
                <TextareaItem
                  rows={4}
                  placeholder="添加备注信息"
                  onChange={v => this.remarkTextChange(v)}
                />
              </div>
            </div>
          )}

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
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default dataStatistics;
