import { List, InputItem, TextareaItem } from 'antd-mobile';
import { connect } from 'dva';
import { Radio } from 'antd';
import { createForm } from 'rc-form';
import style from './tabs.less';

const RadioGroup = Radio.Group;

@connect(({ home }) => ({
  ...home,
}))
class Qualifications extends React.Component {
  state = {};
  onConditionChange(pair) {
    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: pair,
    });
  }
  render() {
    const { getFieldProps, getFieldError, getFieldDecorator } = this.props.form;
    const { customerDetail } = this.props;
    return (
      <form className={style.qual_pane}>
        <List
          // renderHeader={() => 'Form Validation'}
          renderFooter={() => getFieldError('account') && getFieldError('account').join(',')}
        >
          <span className={style.radio_title}> 国家高新资历</span>
          <RadioGroup
            // {...getFieldProps('nationalHighTech', {
            //     initialValue: customerDetail&&customerDetail.nationalHighTech,
            // })}
            onChange={e => this.onConditionChange({ nationalHighTech: e.target.value })}
          >
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
          <span className={style.radio_title}> 深圳高新资历</span>

          <RadioGroup onChange={e => this.onConditionChange({ shenzhenHighTech: e.target.value })}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
          <span className={style.radio_title}> 双软企业</span>
          <RadioGroup onChange={e => this.onConditionChange({ doubleSoft: e.target.value })}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
          <span className={style.radio_title}>创业大赛优胜者</span>
          <RadioGroup onChange={e => this.onConditionChange({ planWinner: e.target.value })}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
          <span className={style.radio_title}>产学研合作</span>
          <RadioGroup onChange={e => this.onConditionChange({ iurCooperation: e.target.value })}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
          <InputItem
            onChange={value => this.onConditionChange({ patentDis: value })}
            placeholder="发明专利总数"
          >
            发明专利总数
          </InputItem>
          <InputItem
            onChange={value => this.onConditionChange({ patentUse: value })}
            placeholder="实用专利总数"
          >
            实用专利总数
          </InputItem>
          <InputItem
            onChange={value => this.onConditionChange({ patentShow: value })}
            placeholder="外观专利总数"
          >
            外观专利总数
          </InputItem>
          <InputItem
            onChange={value => this.onConditionChange({ softCount: value })}
            placeholder="软著总数"
          >
            软著总数
          </InputItem>
          <InputItem
            onChange={value => this.onConditionChange({ brandCount: value })}
            placeholder="商标总数"
          >
            商标总数
          </InputItem>

          <TextareaItem
            title="近两年申报项目"
            placeholder="近两年申报项目"
            rows={3}
            onChange={value => this.onConditionChange({ lastTwoProject: value })}
          />

          <TextareaItem
            title="计划申报项目"
            placeholder="计划申报项目"
            rows={3}
            onChange={value => this.onConditionChange({ planProject: value })}
          />
        </List>
      </form>
    );
  }
}

const QualificationsWrapper = createForm()(Qualifications);
export default QualificationsWrapper;
