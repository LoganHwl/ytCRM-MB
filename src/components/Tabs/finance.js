import { Icon, Card, InputItem, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import styles from './tabs.less';
import MyCard from '../Card';

import ADD from '../../assets/add.png';

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
      canEdit: [],
      canAdd: false,
      salesRevenue: '',
      taxPayment: '',
      profit: '',
      develop: '',
      netAssets: '',
      fixedAssets: '',
      hasError: false,
    };
  }
  // 内容改变时触发
  onValueChange(name, value) {
    const { financialInfo } = this.state;
    const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if (name != 'year') {
      if (!reg.test(value)) {
        Toast.fail('只能输入两位小数', 1);
        this.setState({ hasError: true });
      } else {
        this.setState({ hasError: false });
      }
      financialInfo[name] = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    } else {
      financialInfo[name] = value;
    }

    this.setState(Object.assign({}, { financialInfo }), () => {
      console.log(this.state);
    });
  }
  // 添加到props
  onConditionChange(key, e) {
    const { financialInfo, financialInfos, canEdit, num, hasError } = this.state;
    if (hasError) {
      Toast.fail('请确保输入项正确后提交', 1);
      return;
    }
    if (!financialInfo.year) {
      Toast.fail('年份是必填项', 1);
      return;
    } else {
      if (
        !(
          financialInfo.salesRevenue ||
          financialInfo.taxPayment ||
          financialInfo.profit ||
          financialInfo.netAssets ||
          financialInfo.develop ||
          financialInfo.fixedAssets
        )
      ) {
        Toast.fail('至少填写一项投入信息', 1);
        return;
      }
    }
    // 每个面板的确认按钮只能点击一次
    if (canEdit.includes(key)) {
      return;
    }
    financialInfo.key = num;
    //添加数组并去重
    financialInfos.push(financialInfo);
    let array = Array.from(new Set(financialInfos));

    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: { financialInfos: array },
    });
    // 每个面板的确认按钮只能点击一次
    canEdit.push(key);
    this.setState({ canEdit, financialInfo: {}, canAdd: true });
  }
  // 新增一个面板
  addComponent = () => {
    const { num, canAdd, componentArray } = this.state;
    // 每个面板的确认按钮只能点击一次
    if (componentArray.length > 0) {
      if (canAdd === true) {
        let arr = [...this.state.componentArray];
        let newNum = num + 1;
        arr.push(newNum);
        this.setState({
          componentArray: arr,
          num: newNum,
          canAdd: false,
        });
      } else {
        Toast.fail('请先确认', 1);
      }
    } else {
      let arr = [...this.state.componentArray];
      let newNum = num + 1;
      arr.push(newNum);
      this.setState({
        componentArray: arr,
        num: newNum,
        canAdd: false,
      });
    }
  };
  deleteComponent(key, e) {
    const { componentArray } = this.state;
    let arr = [];
    if (componentArray && componentArray.length > 0) {
      componentArray.map(item => {
        if (key != item) {
          arr.push(item);
        }
      });
      this.setState({ componentArray: arr, canAdd: true });
    }

    // const { tabsInfo } = this.props;
    // const { componentArray } = this.state;
    // if(tabsInfo.financialInfos&&tabsInfo.financialInfos.length>0){
    //   tabsInfo.financialInfos.map((item,index)=>{
    //     if(item.key===key){
    //       tabsInfo.financialInfos.splice(index,1)
    //     }
    //   })
    // }
    // let arr = [];
    // if(componentArray&&componentArray.length>0){
    //   componentArray.map((item, index) => {
    //     if (key != item) {
    //       arr.push(item);
    //     }
    //   });
    //   this.setState({ componentArray: arr,canAdd:true });
    // }
  }
  render() {
    const { componentArray, canEdit } = this.state;
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
                        type="number"
                        onChange={this.onValueChange.bind(this, 'year')}
                        // onChange={value => this.onValueChange({ year: value })}
                        placeholder="年份"
                        disabled={canEdit.includes(item) ? true : false}
                      >
                        年度
                      </InputItem>
                    </div>
                  }
                  extra={
                    <div className={styles.btn_pane}>
                      <span
                        onClick={this.onConditionChange.bind(this, item)}
                        className={canEdit.includes(item) ? null : styles.confirm}
                      >
                        确认
                      </span>
                      <span
                        onClick={this.deleteComponent.bind(this, item)}
                        className={styles.delete}
                      >
                        删除
                      </span>
                    </div>
                    // <Icon
                    //   onClick={this.deleteComponent.bind(this, item)}
                    //   type="cross-circle"
                    //   size="md"
                    // />
                  }
                />
                <Card.Body>
                  <div className={styles.col}>
                    <div>
                      <div>
                        <InputItem
                          type="digit"
                          // value={this.state.salesRevenue}
                          placeholder="万元"
                          disabled={canEdit.includes(item) ? true : false}
                          onChange={this.onValueChange.bind(this, 'salesRevenue')}
                          // onChange={value =>this.onValueChange({ salesRevenue: value },value,'salesRevenue') }
                          error={this.state.hasError}
                        >
                          销售收入
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          type="digit"
                          // value={this.state.profit}
                          placeholder="万元"
                          disabled={canEdit.includes(item) ? true : false}
                          // onChange={value => this.onValueChange({ profit: value },value,'profit') }
                          onChange={this.onValueChange.bind(this, 'profit')}
                        >
                          利润
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          type="digit"
                          // value={this.state.netAssets}
                          placeholder="万元"
                          disabled={canEdit.includes(item) ? true : false}
                          // onChange={value =>this.onValueChange({ netAssets: value },value,'netAssets')}
                          onChange={this.onValueChange.bind(this, 'netAssets')}
                        >
                          净资产
                        </InputItem>
                      </div>
                    </div>
                    <div>
                      <div>
                        <InputItem
                          type="digit"
                          // value={this.state.taxPayment}
                          placeholder="万元"
                          disabled={canEdit.includes(item) ? true : false}
                          // onChange={value =>this.onValueChange({ taxPayment: value },value,'taxPayment')}
                          onChange={this.onValueChange.bind(this, 'taxPayment')}
                        >
                          纳税总额
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          type="digit"
                          // value={this.state.develop}
                          placeholder="万元"
                          disabled={canEdit.includes(item) ? true : false}
                          // onChange={value =>this.onValueChange({ develop: value },value,'develop')}
                          onChange={this.onValueChange.bind(this, 'develop')}
                        >
                          研发投入
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          type="digit"
                          // value={this.state.fixedAssets}
                          placeholder="万元"
                          disabled={canEdit.includes(item) ? true : false}
                          // onChange={value =>this.onValueChange({ fixedAssets: value },value,'fixedAssets')}
                          onChange={this.onValueChange.bind(this, 'fixedAssets')}
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
        <div className={styles.addOne} onClick={this.addComponent}>
          <img src={ADD} />
          {/* <Icon onClick={this.addComponent} type="down" size="lg" /> */}
        </div>
      </div>
    );
  }
}

const FinanceWrapper = createForm()(Finance);
export default FinanceWrapper;
