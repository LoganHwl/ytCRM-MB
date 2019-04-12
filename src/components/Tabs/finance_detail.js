import { Icon, Card, InputItem,Toast, } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import styles from './tabs.less';
import MyCard from '../Card';

import ADD from "../../assets/add.png";

@connect(({ home }) => ({
  ...home,
}))
class Finance_detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      financialInfos: [],
      canEdit:false,
      canEditIndex: '',
      canAdd:false,
      hasError:false
    };
  }
  componentWillMount() {
    const { customerDetail } = this.props;
    if (customerDetail) {
      this.setState({ financialInfos: customerDetail.financialInfos, canAdd: true })
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
    const { financialInfos } = this.state;
    const reg=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    if(fieldName != 'year') {
      if (!reg.test(e)) {
        Toast.fail('只能输入两位小数',1);
        // this.setState({hasError:true})
      }else{
        this.setState({hasError:false})
      }
     e = e.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
    } 
    financialInfos.map((item, index) => {
      if (index === key) {
        financialInfos[index][fieldName] = e
      }
    })
    this.setState({ financialInfos });
  }
  // 添加到props
  onConditionChange(key, e) {
    const { financialInfos} = this.state

    const { 
      year,
      salesRevenue,
      taxPayment,
      profit,
      netAssets,
      develop,
      fixedAssets
    } = financialInfos[key]
    if (!year) {
      Toast.fail('年份是必填项', 1);
      return false;
    }
    if (!(salesRevenue||taxPayment||profit||netAssets||develop||fixedAssets)) {
      Toast.fail('至少填写一项财务信息', 1);
      return false;
    }

    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: { financialInfos },
    });
    this.setState({ canEditIndex: '', canAdd: true, canEdit: false })
  }
  // 新增一个面板
  addComponent = () => {
    const { canAdd, financialInfos } = this.state;
    // 每个面板的确认按钮只能点击一次
    if (financialInfos) {
      if (canAdd === true) {
        let arr = [...financialInfos];
        let contactInfo = {
          year: '',
          salesRevenue: '',
          taxPayment: '',
          profit: '',
          netAssets: '',
          develop: '',
          fixedAssets: ''
        }
        arr.push(contactInfo);
        this.setState({
          financialInfos: arr,
          canAdd: false,
          canEdit: true,
          canEditIndex: financialInfos.length
        });
      } else {
        Toast.fail('请先确认', 1);
      }
    }
  };
  // 删除一个面板
  deleteComponent(key, e) {
    const { financialInfos } = this.state;
    let arr = financialInfos.filter((item, index) => {
      return index !== key
    })
    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload: { financialInfos: arr },
    });
    this.setState({ financialInfos: arr, canEditIndex: '', canAdd: true, canEdit: false });
  }

  render() {
    const { operating } = this.props;
    const { financialInfos,canEdit, canEditIndex } = this.state;
    return (
      <div>
        {financialInfos &&
          financialInfos.length > 0 ?
          financialInfos.map((item, index) => (
            <div className={styles.tabsCard} key={index}>
              <MyCard>
                <Card.Header
                  title={
                    <div className={`${styles.tabsCardHeader} ${operating===0?styles.detail_header:null}`}>                    
                      <InputItem
                          type='number'
                          value={item.year}
                          onChange={this.onValueChange.bind(this, 'year', index)}
                          placeholder={operating === 0 ? '' : '年份'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                    >
                      年度:
                    </InputItem>    
                    </div>
                  }
                  
                  extra={
                    operating === 0 ? null :
                    canEdit === false || canEditIndex !== index ?
                      <span onClick={e => this.toggleEditable(e, index)} style={{ fontSize: '14px', color: '#1990FF' }}>编辑</span>
                      :
                      <div className={styles.btn_pane}>
                        <span onClick={this.onConditionChange.bind(this, index)} className={canEdit === false ? null : styles.confirm}>确认</span>
                        <span onClick={this.deleteComponent.bind(this, index)} className={styles.delete}>删除</span>
                      </div>
                  }
                />
                <Card.Body>
                  <div className={`${styles.col} ${operating===0?styles.finance_col:styles.finance_col_edit}`}>
                    <div>
                      <div>
                      <InputItem
                          value={item.salesRevenue}
                          onChange={this.onValueChange.bind(this, 'salesRevenue', index)}
                          placeholder={operating === 0 ? '' : '万元'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                          type='digit'
                          error={this.state.hasError}
                        >
                          销售收入:
                        </InputItem>
                      </div>
                      <div>
                      <InputItem
                          value={item.profit}
                          onChange={this.onValueChange.bind(this, 'profit', index)}
                          placeholder={operating === 0 ? '' : '万元'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        >
                          利润:
                        </InputItem>
                      </div>
                      <div>
                      <InputItem
                          value={item.netAssets}
                          onChange={this.onValueChange.bind(this, 'netAssets', index)}
                          placeholder={operating === 0 ? '' : '万元'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        >
                          净资产:
                        </InputItem>
                      </div>
                    </div>
                    <div>
                      <div>
                      <InputItem
                      value={item.taxPayment}
                      onChange={this.onValueChange.bind(this, 'taxPayment', index)}
                      placeholder={operating === 0 ? '' : '万元'}
                      disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                    >
                      纳税总额:
                    </InputItem>
                      </div>
                      <div>
                      <InputItem
                          value={item.develop}
                          onChange={this.onValueChange.bind(this, 'develop', index)}
                          placeholder={operating === 0 ? '' : '万元'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                    >
                      研发投入:
                    </InputItem>
                      </div>
                      <div>
                      <InputItem
                          value={item.fixedAssets}
                          onChange={this.onValueChange.bind(this, 'fixedAssets', index)}
                          placeholder={operating === 0 ? '' : '万元'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        >
                          固定资产:
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
          {operating===0?null:
          <div className={styles.addOne} onClick={this.addComponent}>
          <img src={ADD}/>
            {/* <Icon onClick={this.addComponent} type="down" size="lg" /> */}
          </div>
      }
        
      </div>
    );
  }
}

const FinanceDetailWrapper = createForm()(Finance_detail);
export default FinanceDetailWrapper;
