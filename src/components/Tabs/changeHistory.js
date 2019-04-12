import { Icon, Card, InputItem, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './tabs.less';
import MyCard from '../Card';

class ChangeHistory extends React.Component {
  state = {
    value: 1,
    date: 2019,
  };
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
  validateAccount = (rule, value, callback) => {
    if (value && value.length > 4) {
      callback();
    } else {
      callback(new Error('At least four characters for account'));
    }
  };
  render() {
    const { customerDetail,form:{getFieldDecorator} } = this.props;
    return (
      customerDetail &&
        customerDetail.historyUpdate.length > 0 &&
        customerDetail.historyUpdate.map((item ,index)=> (
          <MyCard key={index}>
          <Card.Body>
            <div className={styles.history_pane}>
              <div>
              {getFieldDecorator('createTime', {
                        initialValue: item.createTime,
                    })(
                      <InputItem
                  autoheight="true"
                  disabled
                >
                  变更日期：
                </InputItem>
          )}
               
              </div>
              <div>
              {getFieldDecorator('item', {
                        initialValue: item.item,
                    })(
                      <InputItem
                  autoheight="true"
                  disabled
                >
                  变更项：
                </InputItem>
          )}
              </div>
              <div>
              {getFieldDecorator('befores', {
                        initialValue: item.befores,
                    })(
                      <TextareaItem
                  title="变更前信息:"
                  rows={2}
                  disabled
                />
          )}
                
              </div>
              <div>
              {getFieldDecorator('afters', {
                        initialValue: item.afters,
                    })(
                      <TextareaItem
                      title="变更后信息:"
                      rows={2}
                      disabled
                    />
          )}
              
              </div>
              <div>
              {getFieldDecorator('userName', {
                        initialValue: item.userName,
                    })(
                      <InputItem
                  autoheight="true"
                  disabled
                >
                  变更人：
                </InputItem>
          )}
              </div>
            </div>
          </Card.Body>
        </MyCard>
        )
        ))
  }
}

const ChangeHistoryWrapper = createForm()(ChangeHistory);
export default ChangeHistoryWrapper;
