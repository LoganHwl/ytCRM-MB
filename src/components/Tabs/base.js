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

@connect(({ home }) => ({
  ...home,
}))
class BasicInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      customerDetail: {},
      userRealName: '',
      roleId: '',
      hasError: false,
      userList: [],
      belongUserName: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userForAssign !== nextProps.userForAssign) {
      if (nextProps.userForAssign && nextProps.userForAssign.length > 0) {
        let list = [];
        nextProps.userForAssign.map(item => {
          let info = {};
          (info.label = item.realName), (info.value = item.id), list.push(info);
          if (item.realName === sessionStorage.getItem('userRealName')) {
            let arr = [];
            arr.push(item.id);
            this.setState({ userRealName: arr });
          }
        });
        this.setState({ userList: list });
      }
    }
  }
  async componentDidMount() {
    const { dispatch, userForAssign } = this.props;
    const { userRealName } = this.state;
    // const userRealName = sessionStorage.getItem('userRealName');
    const roleId = sessionStorage.getItem('roleId');
    this.setState({
      // userRealName,
      roleId,
    });
    await dispatch({
      type: 'home/getUserForAssign',
    });
    if (userForAssign && userForAssign.length > 0) {
      let list = [];
      userForAssign.map(item => {
        let info = {};
        (info.label = item.realName), (info.value = item.id), list.push(info);
        if (item.realName === sessionStorage.getItem('userRealName')) {
          let arr = [];
          arr.push(item.id);
          this.setState({ userRealName: arr });
        }
      });
      this.setState({ userList: list });
    }
  }
  onErrorClick = () => {
    if (this.state.hasError) {
      Toast.info('只能输入两位小数');
    }
  };
  async onConditionChange(pair) {
    const {
      form: { validateFields, getFieldsValue },
      dispatch,
      userForAssign,
      tabsInfo,
      type,
    } = this.props;
    const { userRealName } = this.state;

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
    pair.belongUserId = userRealName[0];
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
      type: 'home/CONDITION_CHANGE',
      payload: pair,
    });
  }
  render() {
    const { customerDetail, userForAssign } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { userRealName, roleId, userList, belongUserName } = this.state;
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
              data={userList}
              cols={1}
              value={userRealName}
              onChange={value => {
                this.setState({ userRealName: value });
                // this.onConditionChange({ belongUserId: value })
              }}
            >
              <List.Item arrow="horizontal">当前责任人</List.Item>
            </Picker>
            {/* <InputItem  >当前责任人</InputItem>
                         {getFieldDecorator('belongUserId', {
              initialValue: userRealName? userRealName:null,
            })(
                        <Select
                          className={styles.spec_select}
                          placeholder="当前责任人"
                          // allowClear={true}
                          onChange={value => this.onConditionChange({ belongUserId: value })}
                          filterOption={false}
                          disabled={roleId != '1' ? true : false}
                        >
                          {roleId === '1' && userForAssign &&
                            userForAssign.length > 0 &&
                            userForAssign.map((item, index) => (
                              <Option key={index} value={item.id}>
                                {item.realName}
                              </Option>
                            ))}
                        </Select>
            )} */}
          </div>

          <InputItem
            placeholder="客户来源"
            onChange={value => this.onConditionChange({ source: value })}
          >
            客户来源
          </InputItem>
          <div>
            <InputItem>客户等级</InputItem>
            {getFieldDecorator('level', {
              initialValue: customerDetail && customerDetail.level,
            })(
              <Select
                className={styles.spec_select}
                placeholder="客户等级"
                onChange={value => this.onConditionChange({ level: value })}
              >
                <Option value={1}>高</Option>
                <Option value={2}>中</Option>
                <Option value={3}>低</Option>
              </Select>
            )}
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
              注册金额
            </InputItem>
          )}
          {getFieldDecorator('foundTime', {
            initialValue:
              customerDetail && customerDetail.foundTime
                ? new Date(customerDetail.foundTime)
                : null,
          })(
            <DatePicker
              mode="date"
              locale={zh_CN}
              extra={null}
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
            <InputItem>所属地区</InputItem>
            {getFieldDecorator('region', {
              initialValue: customerDetail && customerDetail.region ? customerDetail.region : null,
            })(
              <Select
                placeholder="所属地区"
                onChange={value => this.onConditionChange({ region: value })}
                className={styles.spec_select}
              >
                <Option value="罗湖区">罗湖区</Option>
                <Option value="福田区">福田区</Option>
                <Option value="南山区">南山区</Option>
                <Option value="盐田区">盐田区</Option>
                <Option value="宝安区">宝安区</Option>
                <Option value="龙岗区">龙岗区</Option>
                <Option value="光明区">光明区</Option>
                <Option value="坪山区">坪山区</Option>
                <Option value="龙华区">龙华区</Option>
                <Option value="大鹏区">大鹏区</Option>
                <Option value="前海">前海</Option>
                <Option value="其他">其他</Option>
              </Select>
            )}
          </div>

          {/* {getFieldDecorator('talentInfo', {
          initialValue: customerDetail && customerDetail.talentInfo,
        })(
          <TextareaItem
            title="高端人才"
            placeholder="高端人才情况"
            data-seed="talentInfo"
            ref={el => (this.autoFocusInst = el)}
            autoHeight
            onChange={value => this.onConditionChange({ talentInfo: value })}
          />
        )} */}
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
