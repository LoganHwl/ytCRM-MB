import { Icon, Card } from 'antd-mobile';
import { createForm } from 'rc-form';
// import { styles } from 'ansi-colors';
import styles from './tabs.less'
import MyCard from "../Card";

class Finance extends React.Component {
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
                                    <span>销售收入</span>
                                    <input placeholder='万元'/>
                                </div>
                                <div>
                                    <span>利润</span>
                                    <input placeholder='万元' />
                                </div>
                                <div>
                                    <span>净收入</span>
                                    <input placeholder='万元' />
                                </div>
                            </div>
                            <div className={styles.spec}>
                                <div>
                                    <span>纳税总额</span>
                                    <input placeholder='万元' />
                                </div>
                                <div>
                                    <span>研发投入</span>
                                    <input placeholder='万元' />
                                </div>
                                <div>
                                    <span>固定资产</span>
                                    <input placeholder='万元' />
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

const FinanceWrapper = createForm()(Finance);
export default FinanceWrapper