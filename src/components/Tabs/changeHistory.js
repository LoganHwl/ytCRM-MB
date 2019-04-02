import { Icon, Card, InputItem, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';
// import { styles } from 'ansi-colors';
import styles from './tabs.less'
import MyCard from "../Card";

class ChangeHistory extends React.Component {
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
            <MyCard>
                <Card.Body>
                    <div className={styles.history_pane}>
                        <div>
                            <InputItem
                             autoHeight
                             disabled
                             value='23435r454356343434634634634634634643634634634634634634'
                             >
                                变更日期：
                            </InputItem>
                        </div>
                        <div>
                            <InputItem>
                            变更项：
                            </InputItem>
                        </div>
                        <div>
                            <TextareaItem
                                title="变更前信息："
                                data-seed="logId"
                                ref={el => this.autoFocusInst = el}
                                autoHeight
                                disabled
                                value='23435r454356343434634634634634634643634634634634634634'
                            />
                        </div>
                        <div>
                            <TextareaItem
                                title="变更后信息"
                                data-seed="logId"
                                ref={el => this.autoFocusInst = el}
                                autoHeight
                            />
                        </div>
                        <div>
                            <InputItem>
                            变更人：
                            </InputItem>
                        </div>
                    </div>
                </Card.Body>
            </MyCard>
        );
    }
}

const ChangeHistoryWrapper = createForm()(ChangeHistory);
export default ChangeHistoryWrapper