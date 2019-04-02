import { Icon, Card,DatePicker } from 'antd-mobile';
import { createForm } from 'rc-form';
// import { styles } from 'ansi-colors';
import styles from './tabs.less'
import MyCard from "../Card";

class Contact extends React.Component {
    state = {
        value: 1,
        date: 2019,
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
        return (
            <div>
                <MyCard>
                    <Card.Header
                        extra={<Icon type="cross-circle" size='md' />}
                    />
                    <Card.Body>
                        <div className={styles.col}>
                            <div className={styles.spec}>
                                <div>
                                    <span>姓名</span>
                                    <input placeholder='联系人姓名'/>
                                </div>
                                <div>
                                    <span>电话</span>
                                    <input placeholder='联系电话' />
                                </div>
                            </div>
                            <div className={styles.spec}>
                                <div>
                                    <span>职位</span>
                                    <input placeholder='职位' />
                                </div>
                                <div>
                                    <span>其他</span>
                                    <input placeholder='其他' />
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </MyCard>
                <div className={styles.addOne}><Icon type="down" size='lg' /></div>
                </div>
        );
    }
}

const ContactWrapper = createForm()(Contact);
export default ContactWrapper