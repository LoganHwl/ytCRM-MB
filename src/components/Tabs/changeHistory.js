import { Icon, Card, InputItem, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './tabs.less';
import MyCard from '../Card';

class ChangeHistory extends React.Component {
  state = {
    value: 1,
    date: 2019,
  };
  render() {
    const {
      customerDetail,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.history_pane}>
        {customerDetail &&
        customerDetail.historyUpdate &&
        customerDetail.historyUpdate.length > 0 ? (
          customerDetail.historyUpdate.map((item, index) => (
            <MyCard key={index}>
              <Card.Body>
                <div>
                  <div className={styles.history_col}>
                    <span className={styles.col_title}>变更日期：</span>
                    <InputItem value={item.createTime} disabled />
                  </div>
                  <div className={styles.history_col}>
                    <span className={styles.col_title}>变更项：</span>
                    <InputItem value={item.item} disabled />
                  </div>

                  <div className={styles.history_col}>
                    <span className={styles.col_title}>变更前信息：</span>
                    <TextareaItem autoHeight value={item.befores} disabled />
                  </div>

                  <div className={styles.history_col}>
                    <span className={styles.col_title}>变更后信息：</span>
                    <TextareaItem autoHeight value={item.afters} disabled />
                  </div>

                  <div className={styles.history_col}>
                    <span className={styles.col_title}>变更人：</span>
                    <InputItem value={item.userName} disabled />
                  </div>
                </div>
                <div style={{ height: '10px' }} />
              </Card.Body>
            </MyCard>
          ))
        ) : (
          <div
            style={{ marginTop: '6em', textAlign: 'center', fontSize: '16px', color: '#999999' }}
          >
            暂无数据~
          </div>
        )}
      </div>
    );
  }
}

const ChangeHistoryWrapper = createForm()(ChangeHistory);
export default ChangeHistoryWrapper;
