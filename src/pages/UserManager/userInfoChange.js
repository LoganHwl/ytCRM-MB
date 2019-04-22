import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Header from '../Base/header';
import { List, InputItem, Button, Toast, Picker } from 'antd-mobile';

import styles from './userManager.less';


@connect(({ home }) => ({
  ...home,
}))
class userInfoChange extends Component {
  state = {
    userId: '',
    realName:'',
    mobile:'',
    roleId: '',
    roleName:'',
    canSubmit: false,
    roleList:[],
    defaultId:''
  };

  rolePickerList(value) {
    let BUlist = [];
    value.map(item => {
      let info = {};
      info.label = item.name;
      info.value = item.id;
      BUlist.push(info);
    });
    this.setState({ roleList: BUlist });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.allRole !== nextProps.allRole) {
      if (nextProps.allRole && nextProps.allRole.code === 0 && nextProps.allRole.data) {
        this.rolePickerList(nextProps.allRole.data);
      }else {
        Toast.fail(nextProps.allRole.msg,1);
        return
      }
    }
  }
  componentWillMount() {}
  async componentDidMount() {
    
    const { dispatch, allRole } = this.props;
    const d = this.props.location.query.detail;
    const detail = JSON.parse(d) 
    let arr =[];
    arr.push(detail.roleId)
    this.setState({ 
      userId: detail.userId,
      realName:detail.realName,
      mobile:detail.mobile,
      roleId: detail.roleId,
      roleName:arr,
      defaultId:arr
    });
    await dispatch({
      type: 'home/getAllRole',
    });
    if (allRole && allRole.code === 0 && allRole.data) {
      this.rolePickerList(allRole.data);
    }else {
      Toast.fail(allRole.msg,1);
      return
    }
  }

  roleNameValueChange(v) {
    const {defaultId} = this.state
    this.setState({
      roleName: v,
      roleId:v[0],
      canSubmit: true,
    });
    if(JSON.stringify(v) === JSON.stringify(defaultId)){
      this.setState({canSubmit: false,})
    }
  }

  realNameValueChange(v) {
    this.setState({
      realName: v,
      canSubmit: true,
    });
    if(v === ''){
      this.setState({canSubmit: false,})
    }
  }
  mobileValueChange(v) {
    this.setState({
      mobile: v,
      canSubmit: true,
    });
    if(v === ''){
      this.setState({canSubmit: false,})
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
  // 提交更改
  async submitChange( e) {
    const { dispatch } = this.props;
    const {
      realName,
      mobile,
      roleId,
      userId,
      defaultId
    } = this.state;
    if (!userId) {
      Toast.fail('缺少用户ID', 1);
      return;
    }
    const params = {
      realName,
      mobile,
      roleId,
      userId,
    };
    await dispatch({
      type: 'home/setRole',
      payload: params,
    });
    Toast.success('修改成功',1);
    // if(defaultId[0] == 1){
    //   setTimeout(()=>{
    //     router.push('/login');
    //   },500)
    // }else {
    //   setTimeout(()=>{
    //     history.go(-1)
    //   },500)
    // }
    setTimeout(()=>{
      history.go(-1)
    },500)
    
  };

  render() {
    const {
      realName,
      mobile,
      roleName,
      roleList,
      canSubmit,
      defaultId
    } = this.state;
    return (
      <div className={styles.page} style={{ background: 'white',height:'100%' }}>
        <Header>修改用户信息</Header>
        <div className={styles.status_panel}>
          <div className={styles.status_title}>
            <Picker
              data={roleList}
              cols={1}
              value={roleName}
              placeholder="选择角色"
              extra={<span></span>}
              onChange={value => {this.roleNameValueChange(value)}}
            >
              <List.Item arrow="horizontal">设置角色:</List.Item>
            </Picker>
          </div>
          <div>
            <div className={styles.status_text}>
              <span>真实姓名:</span>
              <InputItem
                size="small"
                placeholder="真实姓名"
                value={realName}
                onChange={v => this.realNameValueChange(v)}
              />
            </div>
            <div className={styles.status_text}>
              <span>手机号码:</span>
              <InputItem
                placeholder="手机号码"
                value={mobile}
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
              onClick={this.submitChange.bind(this)}
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
