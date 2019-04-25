import { List, InputItem, TextareaItem, DatePicker, Toast, Picker } from 'antd-mobile';
import zh_CN from 'antd-mobile/lib/date-picker/locale/zh_CN';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import moment from 'moment';

import { Select } from 'antd';
// import { styles } from 'ansi-colors';
import styles from './tabs.less';

const Option = Select.Option;

// 如果不是使用 List.Item 作为 children
const CustomChildren = props => (
  <div onClick={props.onClick} style={{ backgroundColor: '#fff', paddingLeft: 15 }}>
    <div className="test" style={{ display: 'flex', height: '45px', lineHeight: '45px' }}>
      <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {props.children}
      </div>
      <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</div>
    </div>
  </div>
);

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
      userRealName: '',
      roleId: '',
      hasError: false,
      userList: [],
      level: null,
      region: null,
      belongUserName: null,
    };
  }

  userPickerList(value) {
    let list = [];
    value.map(item => {
      let info = {};
      (info.label = item.realName), (info.value = item.id), list.push(info);
    });
    this.setState({ userList: list });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userForAssign !== nextProps.userForAssign) {
      if (nextProps.userForAssign && nextProps.userForAssign.length > 0) {
        this.userPickerList(nextProps.userForAssign);
      }
    }
    if (this.props.customerDetail !== nextProps.customerDetail) {
      if (nextProps.customerDetail) {
        let arr = [];
        let arr_region = [];
        let arr_BUN = [];
        arr.push(nextProps.customerDetail.level);
        arr_region.push(nextProps.customerDetail.region);
        arr_BUN.push(nextProps.customerDetail.belongUserId);
        this.setState({ level: arr, region: arr_region, belongUserName: arr_BUN });
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
    const {
      customerDetail,
      form: { validateFields },
      dispatch,
    } = this.props;
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
      if (res && res.data === false && customerDetail.name != pair.name) {
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
    const { customerDetail, userForAssign, operating } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { roleId, level, region, belongUserName, userList } = this.state;

    return (
      <div style={{ background: 'white' }}>
        <List>
          <div>
          {operating === 0 ? 
          <div className={styles.name_panel}>
            <span className={styles.title} >客户名称</span>
            <span className={styles.info}>{customerDetail && customerDetail.name}</span>
          </div>
         
          :
          <div style={{marginLeft:'16px',borderBottom:'1px solid rgba(218, 218, 218, 0.5)'}}>
          {getFieldDecorator('name', {
            initialValue: customerDetail && customerDetail.name,
          })(
            <TextareaItem
              disabled={operating === 0 ? true : false}
              title="客户名称"
              placeholder={!customerDetail ? '客户名称' : null}
              autoHeight
              style={{ textAlign: 'right' }}
              onChange={value => this.onConditionChange({ name: value })}
            />
          )}
          </div>
            }  
            
          </div>
          {/* {getFieldDecorator('name', {
            initialValue: customerDetail && customerDetail.name,
          })(
            <TextareaItem
              disabled={operating === 0 ? true : false}
              title="客户名称"
              placeholder={!customerDetail ? '客户名称' : null}
              autoHeight
              style={{ textAlign: 'right' }}
              onChange={value => this.onConditionChange({ name: value })}
            />
          )} */}
          {operating === 0 ? (
            <InputItem
              disabled={true}
              value={customerDetail ? customerDetail.belongUserName : null}
            >
              当前责任人
            </InputItem>
          ) : (
            // )
            <div>
              <Picker
                disabled={roleId != '1' ? true : false}
                data={userList}
                cols={1}
                value={belongUserName}
                extra={<span />}
                onChange={value => {
                  this.setState({ belongUserName: value });
                  this.onConditionChange({ belongUserId: value[0] });
                }}
              >
                <List.Item>当前责任人</List.Item>
              </Picker>
            </div>
          )}

          <InputItem
            disabled={operating === 0 ? true : false}
            placeholder={!customerDetail ? '客户来源' : null}
            onChange={value => this.onConditionChange({ source: value })}
          >
            客户来源
          </InputItem>
          {operating === 0 ? (
            getFieldDecorator('level', {
              initialValue: customerDetail
                ? customerDetail.level === 1
                  ? '高'
                  : customerDetail.level === 2
                    ? '中'
                    : customerDetail.level === 3
                      ? '低'
                      : ''
                : null,
            })(<InputItem disabled={true}>客户等级</InputItem>)
          ) : (
            <div>
              <Picker
                data={levelList}
                cols={1}
                value={level}
                extra={<span />}
                onChange={value => {
                  this.setState({ level: value });
                  this.onConditionChange({ level: value[0] });
                }}
              >
                <List.Item style={{ color: 'black' }}>客户等级</List.Item>
              </Picker>
            </div>
          )}
          {getFieldDecorator('representative', {
            initialValue: customerDetail && customerDetail.representative,
          })(
            <InputItem
              disabled={operating === 0 ? true : false}
              placeholder={!customerDetail ? '法人代表' : null}
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
              disabled={operating === 0 ? true : false}
              placeholder={!customerDetail ? '注册金额' : null}
              onChange={value => this.onConditionChange({ registeredCapital: value })}
              error={this.state.hasError}
              onErrorClick={this.onErrorClick}
            >
              注册金额
            </InputItem>
          )}
          {operating === 0
            ? getFieldDecorator('foundTime', {
                initialValue: customerDetail && customerDetail.foundTime,
              })(<InputItem disabled={true}>成立时间</InputItem>)
            : getFieldDecorator('foundTime', {
                initialValue:
                  customerDetail && customerDetail.foundTime
                    ? new Date(customerDetail.foundTime)
                    : null,
              })(
                <DatePicker
                  disabled={operating === 0 ? true : false}
                  mode="date"
                  locale={zh_CN}
                  extra={<span />}
                  onChange={value => this.onConditionChange({ foundTime: value })}
                >
                  {/* <div
               style={{ backgroundColor: '#fff', height: '45px', lineHeight: '45px', margin: '0 0 0 15px',borderBottom: '1PX solid rgba(243, 243, 243, .75)' }}
              >
                成立时间
                <span style={{ float: 'right', color: '#888' }}>{region}</span>
              </div> */}
                  <List.Item>成立时间</List.Item>
                </DatePicker>
              )}

          {getFieldDecorator('staffCount', {
            initialValue: customerDetail && customerDetail.staffCount,
          })(
            <InputItem
              type="number"
              disabled={operating === 0 ? true : false}
              placeholder={!customerDetail ? '公司人数' : null}
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
              disabled={operating === 0 ? true : false}
              placeholder={!customerDetail ? '参保人数' : null}
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
              disabled={operating === 0 ? true : false}
              placeholder={!customerDetail ? '研发人数' : null}
              onChange={value => this.onConditionChange({ developCount: value })}
            >
              研发人数
            </InputItem>
          )}
          {operating === 0 ? (
            getFieldDecorator('region', {
              initialValue: customerDetail && customerDetail.region,
            })(<InputItem disabled={true}>所属地区</InputItem>)
          ) : (
            <div>
              <Picker
                data={regionList}
                cols={1}
                value={region}
                extra={<span />}
                onChange={value => {
                  this.setState({ region: value });
                  this.onConditionChange({ region: value[0] });
                }}
              >
                {/* <div
               style={{ backgroundColor: '#fff', height: '45px', lineHeight: '45px', margin: '0 0 0 15px',borderBottom: '1PX solid rgba(243, 243, 243, .75)' }}
              >
                所属地区
                <span style={{ float: 'right', color: '#888' }}>{region}</span>
              </div> */}
                <List.Item>所属地区</List.Item>
              </Picker>
            </div>
          )}

          <div>
            <div className={styles.status_title}>高端人才情况</div>
            <div className={styles.status_text}>
            {operating === 0 ? <div style={{minHeight:'32px',height:'auto',color:'#bbb',lineHeight:'20px',wordWrap:'break-word',width:'100%',paddingTop:'5px'}}>
              {customerDetail && customerDetail.talentInfo}
            </div> :
               getFieldDecorator('talentInfo', {
                initialValue: customerDetail && customerDetail.talentInfo,
              })(
                <TextareaItem
                  disabled={operating === 0 ? true : false}
                  autoHeight
                  placeholder={!customerDetail ? '高端人才情况' : null}
                  onChange={value => this.onConditionChange({ talentInfo: value })}
                  style={{ textAlign: 'left' }}
                />
              )
            }           
            </div>
          </div>

          <div>
            <div className={styles.status_title}>经营地址</div>
            <div className={styles.status_text}>
            {operating === 0 ? <div style={{minHeight:'32px',height:'auto',color:'#bbb',lineHeight:'20px',wordWrap:'break-word',width:'100%',paddingTop:'5px'}}>
              {customerDetail && customerDetail.registeredAddr}
            </div> :
              getFieldDecorator('registeredAddr', {
                initialValue: customerDetail && customerDetail.registeredAddr,
              })(
                <TextareaItem
                  disabled={operating === 0 ? true : false}
                  autoHeight
                  placeholder={!customerDetail ? '经营地址' : null}
                  onChange={value => this.onConditionChange({ registeredAddr: value })}
                  style={{ textAlign: 'left' }}
                />
              )
            }           
            </div>
          </div>

          <div style={{ background: 'white' }}>
            <div className={styles.status_title}>主营业务</div>
            <div className={styles.status_text}>
            {operating === 0 ? <div style={{minHeight:'32px',height:'auto',color:'#bbb',lineHeight:'20px',wordWrap:'break-word',width:'100%',paddingTop:'5px'}}>
              {customerDetail && customerDetail.businessScope}
            </div> :
                getFieldDecorator('businessScope', {
                  initialValue: customerDetail && customerDetail.businessScope,
                })(
                  <TextareaItem
                    disabled={operating === 0 ? true : false}
                    autoHeight
                    placeholder={!customerDetail ? '主营业务' : null}
                    onChange={value => this.onConditionChange({ businessScope: value })}
                    style={{ textAlign: 'left' }}
                  />
                )
            }              
            </div>
          </div>
        </List>
      </div>
    );
  }
}

const BasicInputWrapper = createForm()(BasicInput);
export default BasicInputWrapper;
