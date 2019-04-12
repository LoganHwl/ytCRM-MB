import { Icon, Card, DatePicker, InputItem, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import styles from './tabs.less'
import MyCard from "../Card";

import ADD from "../../assets/add.png";

@connect(({ home }) => ({
  ...home,
}))

class Contact_detail extends React.Component {
  state = {
    contactInfos: [],
    canEdit: false,
    canEditIndex: '',
    canAdd: false
  }
  componentWillMount() {
    const { customerDetail } = this.props;
    if (customerDetail) {
      this.setState({ contactInfos: customerDetail.contactInfos, canAdd: true })
    }
  }
  // 每个面板都需要点击编辑才能修改
  toggleEditable = (e, key) => {
    e.preventDefault();
    const { canEditIndex } = this.state;
    if (canEditIndex !== '') {
      Toast.fail('请先确认', 1);
      return
    }
    this.setState({ canEdit: true, canEditIndex: key,canAdd:false })
  };
  // input输入框内容改变事件
  onValueChange(fieldName, key, e) {
    const { contactInfos } = this.state;

    contactInfos.map((item, index) => {
      if (index === key) {
        contactInfos[index][fieldName] = e
      }
    })
    this.setState({ contactInfos });
  }
  // 添加到props
  onConditionChange(key, e) {
    const { contactInfos } = this.state

    const { name, position, phone } = contactInfos[key]
    if (
      name === '' ||
      position === '' ||
      phone === ''
    ) {
      Toast.fail('请填写完整联系人信息。', 1);
      return false;
    }

    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: { contactInfos },
    });
    this.setState({ canEditIndex: '', canAdd: true, canEdit: false })
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
          other: ''
        }
        arr.push(contactInfo);
        this.setState({
          contactInfos: arr,
          canAdd: false,
          canEdit: true,
          canEditIndex: contactInfos.length
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
      return index !== key
    })
    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: { contactInfos: arr },
    });
    this.setState({ contactInfos: arr, canEditIndex: '', canAdd: true, canEdit: false });
  }
  render() {
    const { form: { getFieldDecorator }, operating } = this.props;
    const { contactInfos, canEdit, canEditIndex } = this.state;
    return (
      <div>
        {contactInfos &&
          contactInfos.length > 0 ?
          contactInfos.map((item, index) => (
            <div className={styles.tabsCard} key={index}>
              <MyCard>
                {operating === 0 ? null :
                  <Card.Header
                    style={{ padding: '6px 15px' }}
                    extra={
                      canEdit === false || canEditIndex !== index ?
                        <span onClick={e => this.toggleEditable(e, index)} style={{ fontSize: '14px', color: '#1990FF' }}>编辑</span>
                        :
                        <div className={styles.btn_pane}>
                          <span onClick={this.onConditionChange.bind(this, index)} className={canEdit === false ? null : styles.confirm}>确认</span>
                          <span onClick={this.deleteComponent.bind(this, index)} className={styles.delete}>删除</span>
                        </div>
                    }
                  />
                }
                <Card.Body>
                  <div className={`${styles.col} ${operating === 0 ? styles.contact_col : styles.contact_col_edit}`}>
                    <div>
                      <div>
                        <InputItem
                          value={item.name}
                          onChange={this.onValueChange.bind(this, 'name', index)}
                          placeholder={operating === 0 ? '' : '联系人姓名'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                          ref={el => this.inputRef = el}
                        >
                          姓名:
                        </InputItem>

                      </div>
                      <div>
                        <InputItem
                          value={item.phone}
                          onChange={this.onValueChange.bind(this, 'phone', index)}
                          placeholder={operating === 0 ? '' : '联系电话'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        >
                          电话:
                        </InputItem>
                      </div>
                    </div>
                    <div>
                      <div>
                        <InputItem
                          value={item.position}
                          onChange={this.onValueChange.bind(this, 'position', index)}
                          placeholder={operating === 0 ? '' : '职位'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        >
                          职位:
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          value={item.other}
                          onChange={this.onValueChange.bind(this, 'other', index)}
                          placeholder={operating === 0 ? '' : '其他'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        >
                          其他:
                        </InputItem>
                      </div>

                    </div>
                  </div>
                </Card.Body>
              </MyCard>
            </div>
          ))
          :operating===0?
          <div style={{marginTop:'3em'}}>暂无数据~</div>:null
          }
        {operating === 0 ? null :
          <div className={styles.addOne} onClick={this.addComponent}>
          <img src={ADD}/>
            {/* <Icon onClick={this.addComponent} type="down" size="lg" /> */}
          </div>
        }
      </div>
    );
  }
}

const ContactDetailWrapper = createForm()(Contact_detail);
export default ContactDetailWrapper