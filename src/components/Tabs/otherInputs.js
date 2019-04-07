import { Icon, Card, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import styles from './tabs.less';
import MyCard from '../Card';

@connect(({ home }) => ({
  ...home,
}))
class OtherInputs extends React.Component {
  state = {
    expendInfos: {},
    componentArray: [1],
    num: 1,
  };
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
    const { componentArray } = this.state;
    let arr = [];
    componentArray.map((item, index) => {
      if (key != item) {
        arr.push(item);
      }
    });
    this.setState({ componentArray: arr });
  }

  render() {
    const { componentArray } = this.state;
    // debugger;
    return (
      <div>
        {componentArray &&
          componentArray.length > 0 &&
          componentArray.map((item, index) => (
            <div className={styles.tabsCard} key={item}>
              <MyCard>
                <Card.Header
                  title={
                    <div className={styles.tabsCardHeader}>
                      <InputItem
                        onChange={value => this.onValueChange({ year: value })}
                        placeholder="年份"
                      >
                        年度
                      </InputItem>
                    </div>
                  }
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
                          onChange={value => this.onValueChange({ device: value })}
                          placeholder="万元"
                        >
                          设备投入
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          onChange={value => this.onValueChange({ ad: value })}
                          placeholder="万元"
                        >
                          广告投入
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          onChange={value => this.onValueChange({ info: value })}
                          placeholder="万元"
                        >
                          信息投入
                        </InputItem>
                      </div>
                    </div>
                    <div>
                      <div>
                        <InputItem
                          onChange={value => this.onValueChange({ shows: value })}
                          placeholder="万元"
                        >
                          参展情况
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          onChange={value => this.onValueChange({ loan: value })}
                          placeholder="万元"
                        >
                          贷款情况
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          onChange={value => this.onValueChange({ finance: value })}
                          placeholder="万元"
                        >
                          融资情况
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

const OtherInputsWrapper = createForm()(OtherInputs);
export default OtherInputsWrapper;
