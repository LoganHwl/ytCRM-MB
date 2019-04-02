import { Icon, Card,DatePicker } from 'antd-mobile';
import { createForm } from 'rc-form';
// import { styles } from 'ansi-colors';
import styles from './tabs.less'
import MyCard from "../Card";

class OtherInputs extends React.Component {
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
                        title={
                            <div>
                                <span style={{width: '23%',display: 'inline-block',textAlign: 'right'}}>年度</span>
                                <input placeholder='年份' style={{width:'45%',marginLeft:'8px',textAlign: 'right',border:'1px solid grey',borderRadius:'.4em'}}/>
                                </div>
                        }
                        extra={<Icon type="cross-circle" size='md' />}
                    />
                    <Card.Body>
                        <div className={styles.col}>
                            <div className={styles.spec}>
                                <div>
                                    <span>设备投入</span>
                                    <input placeholder='万元'/>
                                </div>
                                <div>
                                    <span>广告投入</span>
                                    <input placeholder='万元' />
                                </div>
                                <div>
                                    <span>信息投入</span>
                                    <input placeholder='万元' />
                                </div>
                            </div>
                            <div className={styles.spec}>
                                <div>
                                    <span>参展情况</span>
                                    <input placeholder='参展情况' />
                                </div>
                                <div>
                                    <span>贷款情况</span>
                                    <input placeholder='贷款情况' />
                                </div>
                                <div>
                                    <span>融资情况</span>
                                    <input placeholder='融资情况' />
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

const OtherInputsWrapper = createForm()(OtherInputs);
export default OtherInputsWrapper