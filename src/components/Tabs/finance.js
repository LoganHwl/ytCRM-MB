import { Icon, Card, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import styles from './tabs.less';
import MyCard from '../Card';

@connect(({ home }) => ({
  ...home,
}))
class Finance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      financialInfos: [],
      financialInfo: {},
      componentArray: [1],
      num: 1,
    };
  }

  onValueChange(pair) {
    const { financialInfo } = this.state;
    this.setState({ ...financialInfo, financialInfo: pair });
  }
  onConditionChange(pair) {
    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: pair,
    });
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
                          onChange={value => this.onValueChange({ salesRevenue: value })}
                          placeholder="万元"
                        >
                          销售收入
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          onChange={value => this.onValueChange({ profit: value })}
                          placeholder="万元"
                        >
                          利润
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          onChange={value => this.onValueChange({ netAssets: value })}
                          placeholder="万元"
                        >
                          净资产
                        </InputItem>
                      </div>
                    </div>
                    <div>
                      <div>
                        <InputItem
                          onChange={value => this.onValueChange({ taxPayment: value })}
                          placeholder="万元"
                        >
                          纳税总额
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          onChange={value => this.onValueChange({ develop: value })}
                          placeholder="万元"
                        >
                          研发投入
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          onChange={value => this.onValueChange({ fixedAssets: value })}
                          placeholder="万元"
                        >
                          固定资产
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

const FinanceWrapper = createForm()(Finance);
export default FinanceWrapper;
