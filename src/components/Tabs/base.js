import { List, InputItem, TextareaItem } from 'antd-mobile';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import isEqual from 'lodash/isEqual';
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
    };
  }

  // static getDerivedStateFromProps(nextProps, preState) {
  //     if (isEqual(nextProps.value, preState.value)) {
  //       return null;
  //     }
  //     return {
  //       customerDetail: nextProps.value,
  //       value: nextProps.value,
  //     };
  //   }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getUserForAssign',
    });
  }
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, error => {
      if (!error) {
        console.log(this.props.form.getFieldsValue());
      } else {
        alert('Validation failed');
      }
    });
  };
  onReset = () => {
    this.props.form.resetFields();
  };
  // validateAccount = (rule, value, callback) => {}
  onConditionChange(pair) {
    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: pair,
    });
  }
  render() {
    const { customerDetail, userForAssign } = this.props;
    const { getFieldProps, getFieldError, getFieldDecorator } = this.props.form;
    // debugger;
    return (
      <form style={{ width: '97%' }}>
        <List>
          <InputItem>当前责任人</InputItem>
          <Select
            className={styles.spec_select}
            placeholder={`${!customerDetail && '当前责任人'}`}
            allowClear={true}
            onChange={value => this.onConditionChange({ belongUserId: value })}
            value={customerDetail ? customerDetail.belongUserName : null}
          >
            {userForAssign &&
              userForAssign.length > 0 &&
              userForAssign.map((item, index) => (
                <Option key={index} value={item.id}>
                  {item.realName ? item.realName : null}
                </Option>
              ))}
          </Select>

          {/* {getFieldDecorator('name', {
                        initialValue: customerDetail&&customerDetail.name,
                    })(<InputItem placeholder={!customerDetail&&"客户名称"}>客户名称</InputItem>)} */}

          <InputItem
            // {...getFieldProps('name', {
            //         initialValue: customerDetail&&customerDetail.name,
            //     })}
            placeholder={!customerDetail && '客户名称'}
            onChange={value => this.onConditionChange({ name: value })}
          >
            客户名称
          </InputItem>
          <InputItem
            placeholder={!customerDetail && '客户来源'}
            onChange={value => this.onConditionChange({ source: value })}
          >
            客户来源
          </InputItem>
          <InputItem>客户等级</InputItem>
          <Select
            className={styles.spec_select}
            placeholder={!customerDetail && '客户等级'}
            onChange={value => this.onConditionChange({ level: value })}
          >
            <Option value={1}>高</Option>
            <Option value={2}>中</Option>
            <Option value={3}>低</Option>
          </Select>
          <InputItem
            placeholder={!customerDetail && '法人代表'}
            onChange={value => this.onConditionChange({ representative: value })}
          >
            法人代表
          </InputItem>
          <InputItem
            //     {...getFieldProps('registeredCapital', {
            //         initialValue: customerDetail&&customerDetail.registeredCapital
            //   ? customerDetail.registeredCapital
            //   : '',
            //     })}
            placeholder={!customerDetail && '注册金额'}
            onChange={value => this.onConditionChange({ registeredCapital: value })}
          >
            注册金额
          </InputItem>
          <InputItem
            //     {...getFieldProps('foundTime', {
            //     initialValue:
            //     customerDetail&&customerDetail.foundTime && moment(customerDetail.foundTime, 'YYYY-MM-DD'),
            //   })}
            placeholder={!customerDetail && '成立时间'}
            onChange={value => this.onConditionChange({ foundTime: value })}
          >
            成立时间
          </InputItem>
          <InputItem
            placeholder={!customerDetail && '公司人数'}
            onChange={value => this.onConditionChange({ staffCount: value })}
          >
            公司人数
          </InputItem>

          <InputItem
            // {...getFieldProps('insuranceCount', {
            //     rules: [
            //       {
            //         pattern: new RegExp(/^[0-9]\d*$/, 'g'),
            //         whitespace: true,
            //         message: '请输入正确的参保人数',
            //       },
            //     ],
            //     getValueFromEvent: event => {
            //       return event.target.value.replace(/\D/g, '');
            //     },
            //     initialValue: customerDetail&&customerDetail.insuranceCount,
            //   })}
            placeholder={!customerDetail && '参保人数'}
            onChange={value => this.onConditionChange({ insuranceCount: value })}
          >
            参保人数
          </InputItem>
          <InputItem
            placeholder={!customerDetail && '研发人数'}
            onChange={value => this.onConditionChange({ developCount: value })}
          >
            研发人数
          </InputItem>
          <InputItem>所属地区</InputItem>
          <Select
            placeholder={!customerDetail && '所属地区'}
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

          <TextareaItem
            title="高端人才"
            placeholder={!customerDetail && '高端人才情况'}
            data-seed="talentInfo"
            ref={el => (this.autoFocusInst = el)}
            rows={3}
            onChange={value => this.onConditionChange({ talentInfo: value })}
          />

          <TextareaItem
            title="经营地址"
            placeholder={!customerDetail && '经营地址'}
            rows={3}
            onChange={value => this.onConditionChange({ registeredAddr: value })}
          />
          <TextareaItem
            title="主营业务"
            placeholder={!customerDetail && '主营业务'}
            rows={3}
            onChange={value => this.onConditionChange({ businessScope: value })}
          />
        </List>
      </form>
    );
  }
}

const BasicInputWrapper = createForm()(BasicInput);
export default BasicInputWrapper;
