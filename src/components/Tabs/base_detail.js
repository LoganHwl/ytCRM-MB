import { List, InputItem, TextareaItem, DatePicker, Toast } from 'antd-mobile';
import zh_CN from 'antd-mobile/lib/date-picker/locale/zh_CN';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import moment from 'moment';

import { Select } from 'antd';
// import { styles } from 'ansi-colors';
import styles from './tabs.less';

const Option = Select.Option;

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
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    // dispatch({
    //     type: 'home/CLEAR_ALL'
    //   });
    const userRealName = sessionStorage.getItem('userRealName');
    const roleId = sessionStorage.getItem('roleId');
    this.setState({
      userRealName,
      roleId,
    });
    dispatch({
      type: 'home/getUserForAssign',
    });
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
    const { roleId } = this.state;
    return (
      <div style={{ background: 'white' }}>
        <List>
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
              <InputItem>当前责任人</InputItem>
              {getFieldDecorator('belongUserId', {
                initialValue: customerDetail ? customerDetail.belongUserName : null,
              })(
                <Select
                  className={styles.spec_select}
                  placeholder={!customerDetail ? '当前责任人' : null}
                  // allowClear={true}
                  onChange={value => this.onConditionChange({ belongUserId: value })}
                  filterOption={false}
                  disabled={roleId != '1' ? true : operating === 0 ? true : false}
                >
                  {roleId === '1' &&
                    userForAssign &&
                    userForAssign.length > 0 &&
                    userForAssign.map((item, index) => (
                      <Option key={index} value={item.id}>
                        {item.realName}
                      </Option>
                    ))}
                </Select>
              )}
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
              <InputItem>客户等级</InputItem>
              {getFieldDecorator('level', {
                initialValue: customerDetail && customerDetail.level,
              })(
                <Select
                  disabled={operating === 0 ? true : false}
                  className={styles.spec_select}
                  placeholder={!customerDetail ? '客户等级' : null}
                  onChange={value => this.onConditionChange({ level: value })}
                >
                  <Option value={1}>高</Option>
                  <Option value={2}>中</Option>
                  <Option value={3}>低</Option>
                </Select>
              )}
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
              <InputItem>所属地区</InputItem>
              {getFieldDecorator('region', {
                initialValue: customerDetail && customerDetail.region,
              })(
                <Select
                  disabled={operating === 0 ? true : false}
                  placeholder={operating === 1 ? '所属地区' : null}
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
          )}

          <div>
            <div className={styles.status_title}>高端人才情况</div>
            <div className={styles.status_text}>
              {getFieldDecorator('talentInfo', {
                initialValue: customerDetail && customerDetail.talentInfo,
              })(
                <TextareaItem
                  disabled={operating === 0 ? true : false}
                  autoHeight
                  // placeholder={!customerDetail ? "高端人才情况" : null}
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
                  disabled={operating === 0 ? true : false}
                  autoHeight
                  placeholder={!customerDetail ? '经营地址' : null}
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
                  disabled={operating === 0 ? true : false}
                  autoHeight
                  placeholder={!customerDetail ? '主营业务' : null}
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
