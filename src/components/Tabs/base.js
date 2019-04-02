import { List, InputItem, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';

const Item = List.Item;

class BasicInput extends React.Component {
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
            <form style={{ width: '97%' }}>
                <List
                    // renderHeader={() => 'Form Validation'}
                    renderFooter={() => getFieldError('account') && getFieldError('account').join(',')}
                >
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
                        placeholder="当前责任人"
                    >当前责任人</InputItem>
                    <InputItem {...getFieldProps('password')} placeholder="客户名称">
                        客户名称
        </InputItem>
                    <InputItem {...getFieldProps('password')} placeholder="客户来源">
                        客户来源
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
                        placeholder="客户等级"
                    >客户等级</InputItem>
                    <InputItem {...getFieldProps('password')} placeholder="法人代表">
                        法人代表
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
                        placeholder="注册金额"
                    >注册金额</InputItem>
                    <InputItem {...getFieldProps('password')} placeholder="成立时间">
                        成立时间
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
                        placeholder="公司人数"
                    >公司人数</InputItem>
                    <InputItem {...getFieldProps('password')} placeholder="参保人数">
                        参保人数
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
                        placeholder="研发人数"
                    >研发人数</InputItem>
                    <InputItem {...getFieldProps('password')} placeholder="所属地区">
                        所属地区
        </InputItem>
                    <TextareaItem
                        title="高端人才"
                        placeholder="高端人才情况"
                        data-seed="logId"
                        ref={el => this.autoFocusInst = el}
                        rows={3}
                    />

                    <TextareaItem
                        title="经营地址"
                        placeholder="经营地址"
                        data-seed="logId"
                        ref={el => this.autoFocusInst = el}
                        rows={3}
                    />
                    <TextareaItem
                        title="主营业务"
                        placeholder="主营业务"
                        data-seed="logId"
                        ref={el => this.autoFocusInst = el}
                        rows={3}
                    />
                </List>
            </form>);
    }
}

const BasicInputWrapper = createForm()(BasicInput);
export default BasicInputWrapper