import { Icon, Card,DatePicker,InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import styles from './tabs.less'
import MyCard from "../Card";

@connect(({ home }) => ({
    ...home,
  }))

class Contact extends React.Component {
    state = {
        contactInfos: {},
        componentArray: [1],
        num: 1,
    }
    
  onValueChange(pair) {
    const { expendInfos } = this.state;
    this.setState({ ...expendInfos, expendInfos: pair });
  }
  addComponent = () => {
    const { num } = this.state;
    let arr = [...this.state.componentArray];
    let newNum = num + 1;
    arr.push(newNum);
    this.setState({
      componentArray: arr,
      num: newNum,
    });
  };
  deleteComponent(key, e) {
    let arr = [...this.state.componentArray];
    arr = arr.filter((item, index) => {
      return item !== key;
    });
    debugger;
    this.setState({ componentArray: arr });
  }
    render() {
        const { componentArray } = this.state;
        return (
          <div>
            {componentArray &&
              componentArray.length > 0 &&
              componentArray.map((item, index) => (
                <div className={styles.tabsCard} key={index}>
                  <MyCard>
                    <Card.Header
                      extra={
                        <Icon
                          onClick={this.deleteComponent.bind(this, item)}
                          type="cross-circle"
                          size="md"
                        />
                      }
                    />
                    <Card.Body>
                      <div className={styles.col}>
                        <div>
                          <div>
                            <InputItem
                              onChange={value => this.onValueChange({ name: value })}
                              placeholder="联系人姓名"
                            >
                              姓名
                            </InputItem>
                          </div>
                          <div>
                            <InputItem
                              onChange={value => this.onValueChange({ phone: value })}
                              placeholder="联系电话"
                            >
                              电话
                            </InputItem>
                          </div>
                          </div>
                          <div>
                          <div>
                            <InputItem
                              onChange={value => this.onValueChange({ position: value })}
                              placeholder="职位"
                            >
                              职位
                            </InputItem>
                          </div>
                          <div>
                            <InputItem
                              onChange={value => this.onValueChange({ shows: value })}
                              placeholder="其他"
                            >
                              其他
                            </InputItem>
                          </div>
                         
                        </div>
                      </div>
                    </Card.Body>
                  </MyCard>
                </div>
              ))}
            <div className={styles.addOne}>
              <Icon onClick={this.addComponent} type="down" size="lg" />
            </div>
          </div>
        );
    }
}

const ContactWrapper = createForm()(Contact);
export default ContactWrapper