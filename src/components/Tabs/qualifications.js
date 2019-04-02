import { List, InputItem, TextareaItem } from 'antd-mobile';
import { Select, Radio } from 'antd';
import { createForm } from 'rc-form';
import { styles } from 'ansi-colors';
import style from './tabs.less'

const Item = List.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Qualifications extends React.Component {
    state = {
        value: 1,
    }
    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                console.log(this.props.form.getFieldsValue());
            } else {
                alert('Validation failed');
            }
        });
    }
    onReset = () => {
        this.props.form.resetFields();
    }
    validateAccount = (rule, value, callback) => {
        if (value && value.length > 4) {
            callback();
        } else {
            callback(new Error('At least four characters for account'));
        }
    }
    render() {
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <form className={style.qual_pane}>
                <List
                    // renderHeader={() => 'Form Validation'}
                    renderFooter={() => getFieldError('account') && getFieldError('account').join(',')}
                >
                    <span className={style.radio_title}> 国家高新资历</span>
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
        </RadioGroup>
        <span className={style.radio_title}> 深圳高新资历</span>
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
        </RadioGroup>
        <span className={style.radio_title}> 双软企业</span>
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
        </RadioGroup>
        <span className={style.radio_title}>创业大赛优胜者</span>
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
        </RadioGroup>
        <span className={style.radio_title}>产学研合作</span>
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
        </RadioGroup>
                    <InputItem
                        {...getFieldProps('account', {
                            // initialValue: 'little ant',
                            rules: [
                                { required: true, message: 'Please input account' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('account')}
                        onErrorClick={() => {
                            alert(getFieldError('account').join('、'));
                        }}
                        placeholder="发明专利总数"
                    >发明专利总数</InputItem>
                    <InputItem {...getFieldProps('password')} placeholder="发明专利总数">
                    发明专利总数
        </InputItem>
                    <InputItem {...getFieldProps('password')} placeholder="发明专利总数">
                    发明专利总数
        </InputItem>
                    <InputItem
                        {...getFieldProps('account', {
                            // initialValue: 'little ant',
                            rules: [
                                { required: true, message: 'Please input account' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        error={!!getFieldError('account')}
                        onErrorClick={() => {
                            alert(getFieldError('account').join('、'));
                        }}
                        placeholder="发明专利总数"
                    >发明专利总数</InputItem>
                    <InputItem {...getFieldProps('password')} placeholder="发明专利总数">
                    发明专利总数
        </InputItem>
                   
                    <TextareaItem
                        title="近两年申报项目"
                        placeholder="近两年申报项目"
                        data-seed="logId"
                        ref={el => this.autoFocusInst = el}
                        rows={3}
                    />

                    <TextareaItem
                        title="计划申报项目"
                        placeholder="计划申报项目"
                        data-seed="logId"
                        ref={el => this.autoFocusInst = el}
                        rows={3}
                    />
                </List>
            </form>);
    }
}

const QualificationsWrapper = createForm()(Qualifications);
export default QualificationsWrapper