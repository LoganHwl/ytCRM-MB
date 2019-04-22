import { List, InputItem, TextareaItem, DatePicker, Toast, Picker } from 'antd-mobile';
import zh_CN from 'antd-mobile/lib/date-picker/locale/zh_CN';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import isEqual from 'lodash/isEqual';
import moment from 'moment';

import { Select } from 'antd';
// import { styles } from 'ansi-colors';
import styles from './tabs.less';

const Option = Select.Option;
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

const levelList = [
  {
    label: '高',
    value: 1,
  },
  {
    label: '中',
    value: 2,
  },
  {
    label: '低',
    value: 3,
  },
];
const regionList = [
  {
    label: '罗湖区',
    value: '罗湖区',
  },
  {
    label: '福田区',
    value: '福田区',
  },
  {
    label: '南山区',
    value: '南山区',
  },
  {
    label: '盐田区',
    value: '盐田区',
  },
  {
    label: '宝安区',
    value: '宝安区',
  },
  {
    label: '龙岗区',
    value: '龙岗区',
  },
  {
    label: '光明区',
    value: '光明区',
  },
  {
    label: '坪山区',
    value: '坪山区',
  },
  {
    label: '龙华区',
    value: '龙华区',
  },
  {
    label: '大鹏区',
    value: '大鹏区',
  },
  {
    label: '前海',
    value: '前海',
  },
  {
    label: '其他',
    value: '其他',
  },
];

@connect(({ home }) => ({
  ...home,
}))
class BasicInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      customerDetail: {},
      userRealName: null,
      roleId: '',
      hasError: false,
      userList: [],
      belongUserName: null,
      level: null,
      region: null,
    };
  }
  userPickerList(value) {
    let list = [];
    value.map(item => {
      let info = {};
      (info.label = item.realName), (info.value = item.id), list.push(info);
      if (item.realName === sessionStorage.getItem('userRealName')) {
        let arr = [];
        arr.push(item.id);
        this.setState({ belongUserName: arr });
      }
    });
    this.setState({ userList: list });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.userForAssign !== nextProps.userForAssign) {
      if (nextProps.userForAssign && nextProps.userForAssign.length > 0) {
        this.userPickerList(nextProps.userForAssign);
      }
    }
  }
  async componentDidMount() {
    const { dispatch, userForAssign } = this.props;
    const roleId = sessionStorage.getItem('roleId');
    this.setState({
      roleId,
    });
    await dispatch({
      type: 'home/getUserForAssign',
    });
    if (userForAssign && userForAssign.length > 0) {
      this.userPickerList(userForAssign);
    }
  }
  onErrorClick = () => {
    if (this.state.hasError) {
      Toast.info('只能输入两位小数');
    }
  };
  async onConditionChange(pair) {
    const { dispatch } = this.props;
    const { belongUserName } = this.state;

    if (pair.registeredCapital) {
      const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if (!reg.test(pair.registeredCapital)) {
        Toast.fail('只能输入两位小数', 1);
        this.setState({ hasError: true });
      } else {
        this.setState({ hasError: false });
      }
      pair.registeredCapital = pair.registeredCapital.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    }
    // 客户名称输入框失去焦点时请求后台验证是否重名
    if (pair.name) {
      const res = await dispatch({
        type: 'home/getCustomerName',
        payload: pair.name,
      });
      if (res && res.data === false) {
        Toast.fail('客户名已存在', 1);
        dispatch({
          type: 'home/CONDITION_CHANGE',
          payload: { nameExisted: 1 },
        });
      } else {
        dispatch({
          type: 'home/CONDITION_CHANGE',
          payload: { nameExisted: null },
        });
      }
    }
    pair.belongUserId = belongUserName[0];
    // if(!tabsInfo.belongUserId){
    //   userForAssign.map(item => {
    //     if (userRealName[0] === item.id) {
    //       pair.belongUserId = item.id;
    //     }
    //   });
    // }
    // if(pair.belongUserId){
    //   pair.belongUserId =  pair.belongUserId[0];
    // }
    if (!pair.foundTime) {
      pair.foundTime = null;
    } else {
      pair.foundTime = moment(pair.foundTime).format('YYYY-MM-DD');
    }
    dispatch({
      type: 'home/CONDITION_CHANGE_ADD',
      payload: pair,
    });
  }
  render() {
    const { customerDetail, userForAssign } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { userRealName, roleId, userList, belongUserName, level, region } = this.state;

    return (
      <div style={{ background: 'white' }}>
        <List>
          {getFieldDecorator('name', {
            initialValue: customerDetail && customerDetail.name,
          })(
            <TextareaItem
              title="客户名称"
              placeholder="客户名称"
              autoHeight
              onChange={value => this.onConditionChange({ name: value })}
              style={{ textAlign: 'right' }}
            />
          )}
          <div>
            <Picker
              disabled={roleId != '1' ? true : false}
              data={userList}
              cols={1}
              value={belongUserName}
              extra={<span style={{color:'#bbb'}}>选择负责人</span>}
              onChange={value => {
                this.setState({ belongUserName: value });
              }}
            >
              <List.Item>当前责任人</List.Item>
            </Picker>
          </div>

          <InputItem
            placeholder="客户来源"
            onChange={value => this.onConditionChange({ source: value })}
          >
            客户来源
          </InputItem>
          <div>
            <Picker
              data={levelList}
              cols={1}
              value={level}
              extra={<span style={{color:'#bbb'}}>选择客户等级</span>}
              onChange={value => {
                this.setState({ level: value });
                this.onConditionChange({ level: value[0] });
              }}
            >
              <List.Item>客户等级</List.Item>
            </Picker>
          </div>
          {getFieldDecorator('representative', {
            initialValue: customerDetail && customerDetail.representative,
          })(
            <InputItem
              placeholder="法人代表"
              onChange={value => this.onConditionChange({ representative: value })}
            >
              法人代表
            </InputItem>
          )}
          {getFieldDecorator('registeredCapital', {
            initialValue: customerDetail && customerDetail.registeredCapital,
            rules: [
              //  { required: true, message: 'Please input registeredCapital' },
              { validator: this.validateNumInput },
            ],
          })(
            <InputItem
              type="digit"
              value={this.state.registeredCapital}
              placeholder="注册金额"
              onChange={value => this.onConditionChange({ registeredCapital: value })}
              error={this.state.hasError}
              onErrorClick={this.onErrorClick}
            >
              注册金额(万)
            </InputItem>
          )}
          {getFieldDecorator('foundTime', {
            initialValue:
              customerDetail && customerDetail.foundTime
                ? new Date(customerDetail.foundTime)
                : null,
          })(
            <DatePicker
            extra={<span style={{color:'#bbb'}}>选择成立时间</span>}
              mode="date"
              locale={zh_CN}
              onChange={value => this.onConditionChange({ foundTime: value })}
            >
              <List.Item>成立时间</List.Item>
            </DatePicker>
          )}

          {getFieldDecorator('staffCount', {
            initialValue: customerDetail && customerDetail.staffCount,
          })(
            <InputItem
              type="number"
              placeholder="公司人数"
              onChange={value => this.onConditionChange({ staffCount: value })}
            >
              公司人数
            </InputItem>
          )}
          {getFieldDecorator('insuranceCount', {
            initialValue: customerDetail && customerDetail.insuranceCount,
          })(
            <InputItem
              type="number"
              placeholder="参保人数"
              onChange={value => this.onConditionChange({ insuranceCount: value })}
            >
              参保人数
            </InputItem>
          )}
          {getFieldDecorator('developCount', {
            initialValue: customerDetail && customerDetail.developCount,
          })(
            <InputItem
              type="number"
              placeholder="研发人数"
              onChange={value => this.onConditionChange({ developCount: value })}
            >
              研发人数
            </InputItem>
          )}
          <div>
            <Picker
              data={regionList}
              cols={1}
              value={region}
              extra={<span style={{color:'#bbb'}}>选择所属地区</span>}
              onChange={value => {
                this.setState({ region: value });
                this.onConditionChange({ region: value[0] });
              }}
            >
              <List.Item>所属地区</List.Item>
            </Picker>
          </div>
          <div>
            <div className={styles.status_title}>高端人才情况</div>
            <div className={styles.status_text}>
              {getFieldDecorator('talentInfo', {
                initialValue: customerDetail && customerDetail.talentInfo,
              })(
                <TextareaItem
                  autoHeight
                  placeholder="高端人才情况"
                  onChange={value => this.onConditionChange({ talentInfo: value })}
                />
              )}
            </div>
          </div>

          <div>
            <div className={styles.status_title}>经营地址</div>
            <div className={styles.status_text}>
              {getFieldDecorator('registeredAddr', {
                initialValue: customerDetail && customerDetail.registeredAddr,
              })(
                <TextareaItem
                  placeholder="经营地址"
                  autoHeight
                  onChange={value => this.onConditionChange({ registeredAddr: value })}
                />
              )}
            </div>
          </div>

          <div style={{ background: 'white' }}>
            <div className={styles.status_title}>主营业务</div>
            <div className={styles.status_text}>
              {getFieldDecorator('businessScope', {
                initialValue: customerDetail && customerDetail.businessScope,
              })(
                <TextareaItem
                  placeholder="主营业务"
                  autoHeight
                  onChange={value => this.onConditionChange({ businessScope: value })}
                />
              )}
            </div>
          </div>
        </List>
      </div>
    );
  }
}

const BasicInputWrapper = createForm()(BasicInput);
export default BasicInputWrapper;
