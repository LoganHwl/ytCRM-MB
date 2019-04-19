import { Icon, Card, DatePicker, InputItem, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import styles from './tabs.less';
import MyCard from '../Card';

import ADD from '../../assets/add.png';

@connect(({ home }) => ({
  ...home,
}))
class Contact_detail extends React.Component {
  state = {
    contactInfos: [],
    canEdit: false,
    canEditIndex: '',
    canAdd: false,
  };

  async componentDidMount() {
    const { dispatch, ID, customerDetail } = this.props;
    const res = await dispatch({
      type: 'home/getCustomerDetail',
      payload: ID,
    });
    if (res && res.contactInfos) {
      this.setState({ contactInfos: res.contactInfos, canAdd: true });
    }
  }
  // 每个面板都需要点击编辑才能修改
  toggleEditable = (e, key) => {
    e.preventDefault();
    const { canEditIndex } = this.state;
    if (canEditIndex !== '') {
      Toast.fail('请先确认', 1);
      return;
    }
    this.setState({ canEdit: true, canEditIndex: key, canAdd: false });
  };
  // input输入框内容改变事件
  onValueChange(fieldName, key, e) {
    const { contactInfos } = this.state;

    contactInfos.map((item, index) => {
      if (index === key) {
        contactInfos[index][fieldName] = e;
      }
    });
    this.setState({ contactInfos });
  }
  // 添加到props
  onConditionChange(key, e) {
    const { contactInfos } = this.state;

    const { name, position, phone } = contactInfos[key];
    if (name === '' || position === '' || phone === '') {
      Toast.fail('请填写完整联系人信息。', 1);
      return false;
    }

    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: { contactInfos },
    });
    this.setState({ canEditIndex: '', canAdd: true, canEdit: false });
  }
  // 新增一个面板
  addComponent = () => {
    const { canAdd, contactInfos } = this.state;
    // 每个面板的确认按钮只能点击一次
    if (contactInfos) {
      if (canAdd === true) {
        let arr = [...contactInfos];
        let contactInfo = {
          name: '',
          position: '',
          phone: '',
          other: '',
        };
        arr.push(contactInfo);
        this.setState({
          contactInfos: arr,
          canAdd: false,
          canEdit: true,
          canEditIndex: contactInfos.length,
        });
      } else {
        Toast.fail('请先确认', 1);
      }
    }
  };
  // 删除一个面板
  deleteComponent(key, e) {
    const { contactInfos } = this.state;
    let arr = contactInfos.filter((item, index) => {
      return index !== key;
    });
    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: { contactInfos: arr },
    });
    this.setState({ contactInfos: arr, canEditIndex: '', canAdd: true, canEdit: false });
  }
  render() {
    const {
      form: { getFieldDecorator },
      operating,
    } = this.props;
    const { contactInfos, canEdit, canEditIndex } = this.state;
    return (
      <div>
        {contactInfos && contactInfos.length > 0 ? (
          contactInfos.map((item, index) => (
            <div className={styles.tabsCard} key={index}>
              <MyCard>
                {operating === 0 ? null : (
                  <Card.Header
                    style={{ padding: '6px 15px' }}
                    extra={
                      operating === 0 ? null : canEdit === false || canEditIndex !== index ? (
                        <span
                          onClick={e => this.toggleEditable(e, index)}
                          style={{ color: '#1990FF' }}
                        >
                          编辑
                        </span>
                      ) : (
                        <div className={styles.btn_pane}>
                          <span
                            onClick={this.onConditionChange.bind(this, index)}
                            className={canEdit === false ? null : styles.confirm}
                          >
                            确认
                          </span>
                          <span
                            onClick={this.deleteComponent.bind(this, index)}
                            className={styles.delete}
                          >
                            删除
                          </span>
                        </div>
                      )
                    }
                  />
                )}
                <Card.Body>
                  <div
                    className={`${styles.col} ${
                      operating === 0 ? styles.contact_col : styles.contact_col_edit
                    }`}
                  >
                    <div>
                      <div>
                        <div className={styles.col_title}>姓名</div>
                        <InputItem
                          value={item.name}
                          onChange={this.onValueChange.bind(this, 'name', index)}
                          placeholder={operating === 0 ? '' : '联系人姓名'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        />
                      </div>
                      <div>
                        <div className={styles.col_title}>电话</div>
                        <InputItem
                          value={item.phone}
                          onChange={this.onValueChange.bind(this, 'phone', index)}
                          placeholder={operating === 0 ? '' : '联系电话'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <div className={styles.col_title}>职位</div>
                        <InputItem
                          value={item.position}
                          onChange={this.onValueChange.bind(this, 'position', index)}
                          placeholder={operating === 0 ? '' : '职位'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        />
                      </div>
                      <div>
                        <div className={styles.col_title}>其他</div>
                        <InputItem
                          value={item.other}
                          onChange={this.onValueChange.bind(this, 'other', index)}
                          placeholder={operating === 0 ? '' : '其他'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        />
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </MyCard>
            </div>
          ))
        ) : operating === 0 ? (
          <div
            style={{ marginTop: '6em', textAlign: 'center', fontSize: '16px', color: '#999999' }}
          >
            暂无数据~
          </div>
        ) : null}
        {operating === 0 ? null : (
          <div>
            {contactInfos.length > 0 ? null : <div style={{ marginTop: '5em' }} />}
            <div className={styles.addOne} onClick={this.addComponent}>
              <img src={ADD} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const ContactDetailWrapper = createForm()(Contact_detail);
export default ContactDetailWrapper;
