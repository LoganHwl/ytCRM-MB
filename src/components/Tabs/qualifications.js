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
  componentDidMount() {}
  onConditionChange(pair) {
    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: pair,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { customerDetail, operating } = this.props;
    return (
      <div className={style.page}>
        <List>
          <div className={style.radio_pane}>
            <span className={style.radio_title}> 国家高新资历</span>
            {getFieldDecorator('nationalHighTech', {
              initialValue: customerDetail && customerDetail.nationalHighTech,
            })(
              <RadioGroup
                disabled={operating === 0 ? true : false}
                onChange={e => this.onConditionChange({ nationalHighTech: e.target.value })}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </div>
          <div className={style.radio_pane}>
            <span className={style.radio_title}> 深圳高新资历</span>
            {getFieldDecorator('shenzhenHighTech', {
              initialValue: customerDetail && customerDetail.shenzhenHighTech,
            })(
              <RadioGroup
                disabled={operating === 0 ? true : false}
                onChange={e => this.onConditionChange({ shenzhenHighTech: e.target.value })}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </div>
          <div className={style.radio_pane}>
            <span className={style.radio_title}> 双软企业</span>
            {getFieldDecorator('doubleSoft', {
              initialValue: customerDetail && customerDetail.doubleSoft,
            })(
              <RadioGroup
                disabled={operating === 0 ? true : false}
                onChange={e => this.onConditionChange({ doubleSoft: e.target.value })}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </div>
          <div className={style.radio_pane}>
            <span className={style.radio_title}>创业大赛优胜者</span>
            {getFieldDecorator('planWinner', {
              initialValue: customerDetail && customerDetail.planWinner,
            })(
              <RadioGroup
                disabled={operating === 0 ? true : false}
                onChange={e => this.onConditionChange({ planWinner: e.target.value })}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </div>
          <div className={style.radio_pane}>
            <span className={style.radio_title}>产学研合作</span>
            {getFieldDecorator('iurCooperation', {
              initialValue: customerDetail && customerDetail.iurCooperation,
            })(
              <RadioGroup
                disabled={operating === 0 ? true : false}
                onChange={e => this.onConditionChange({ iurCooperation: e.target.value })}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </div>
          {getFieldDecorator('patentDis', {
            initialValue: customerDetail && customerDetail.patentDis,
          })(
            <InputItem
              type="number"
              disabled={operating === 0 ? true : false}
              onChange={value => this.onConditionChange({ patentDis: value })}
              placeholder={!customerDetail ? '发明专利总数' : null}
            >
              发明专利总数
            </InputItem>
          )}
          {getFieldDecorator('patentUse', {
            initialValue: customerDetail && customerDetail.patentUse,
          })(
            <InputItem
              type="number"
              disabled={operating === 0 ? true : false}
              onChange={value => this.onConditionChange({ patentUse: value })}
              placeholder={!customerDetail ? '实用专利总数' : null}
            >
              实用专利总数
            </InputItem>
          )}
          {getFieldDecorator('patentShow', {
            initialValue: customerDetail && customerDetail.patentShow,
          })(
            <InputItem
              type="number"
              disabled={operating === 0 ? true : false}
              onChange={value => this.onConditionChange({ patentShow: value })}
              placeholder={!customerDetail ? '外观专利总数' : null}
            >
              外观专利总数
            </InputItem>
          )}
          {getFieldDecorator('softCount', {
            initialValue: customerDetail && customerDetail.softCount,
          })(
            <InputItem
              type="number"
              disabled={operating === 0 ? true : false}
              onChange={value => this.onConditionChange({ softCount: value })}
              placeholder={!customerDetail ? '软著总数' : null}
            >
              软著总数
            </InputItem>
          )}
          {getFieldDecorator('brandCount', {
            initialValue: customerDetail && customerDetail.brandCount,
          })(
            <InputItem
              type="number"
              disabled={operating === 0 ? true : false}
              onChange={value => this.onConditionChange({ brandCount: value })}
              placeholder={!customerDetail ? '商标总数' : null}
            >
              商标总数
            </InputItem>
          )}

          <div>
            <div className={style.status_title}>近两年申报项目</div>
            <div className={style.status_text}>
              {getFieldDecorator('lastTwoProject', {
                initialValue: customerDetail && customerDetail.lastTwoProject,
              })(
                <TextareaItem
                  editable={operating === 0 ? false : true}
                  placeholder={!customerDetail ? '近两年申报项目' : null}
                  autoHeight
                  onChange={value => this.onConditionChange({ lastTwoProject: value })}
                />
              )}
            </div>
          </div>

          <div>
            <div className={style.status_title}>计划申报项目</div>
            <div className={style.status_text}>
              {getFieldDecorator('planProject', {
                initialValue: customerDetail && customerDetail.planProject,
              })(
                <TextareaItem
                  editable={operating === 0 ? false : true}
                  placeholder={!customerDetail ? '计划申报项目' : null}
                  autoHeight
                  onChange={value => this.onConditionChange({ planProject: value })}
                />
              )}
            </div>
          </div>
        </List>
      </div>
    );
  }
}

const QualificationsWrapper = createForm()(Qualifications);
export default QualificationsWrapper;
