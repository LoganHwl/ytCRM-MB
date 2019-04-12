import { Icon, Card, InputItem,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import styles from './tabs.less';
import MyCard from '../Card';

//引入图片路径
import ADD from "../../assets/add.png";

@connect(({ home }) => ({
  ...home,
}))
class OtherInputs_detail extends React.Component {
  state = {
    expendInfos: [],
    canEdit:false,
    canEditIndex: '',
    canAdd:false
  };
  componentWillMount() {
    const { customerDetail } = this.props;
    if (customerDetail) {
      this.setState({ expendInfos: customerDetail.expendInfos, canAdd: true })
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
      const { expendInfos } = this.state;
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
  
      expendInfos.map((item, index) => {
        if (index === key) {
          expendInfos[index][fieldName] = e
        }
      })
      this.setState({ expendInfos });
    }
    // 添加到props
    onConditionChange(key, e) {
      const { expendInfos } = this.state
  
      const { 
        year,
        device,
        ad,
        info,
        shows,
        loan,
        finance,
      } = expendInfos[key]
      if (!year) {
        Toast.fail('年份是必填项', 1);
        return false;
      }
      if (!(device||ad||info||shows||loan||finance)) {
        Toast.fail('至少填写一项投入信息', 1);
        return false;
      }
  
      this.props.dispatch({
        type: 'home/CONDITION_CHANGE',
        payload: { expendInfos },
      });
      this.setState({ canEditIndex: '', canAdd: true, canEdit: false })
    }
    // 新增一个面板
    addComponent = () => {
      const { canAdd, expendInfos } = this.state;
      // 每个面板的确认按钮只能点击一次
      if (expendInfos) {
        if (canAdd === true) {
          let arr = [...expendInfos];
          let contactInfo = {
            year: '',
            device: '',
            ad: '',
            info: '',
            shows: '',
            loan: '',
            finance: ''
          }
          arr.push(contactInfo);
          this.setState({
            expendInfos: arr,
            canAdd: false,
            canEdit: true,
            canEditIndex: expendInfos.length
          });
        } else {
          Toast.fail('请先确认', 1);
        }
      }
    };
    // 删除一个面板
    deleteComponent(key, e) {
      const { expendInfos } = this.state;
      let arr = expendInfos.filter((item, index) => {
        return index !== key
      })
      this.props.dispatch({
        type: 'home/CONDITION_CHANGE',
        payload: { expendInfos: arr },
      });
      this.setState({ expendInfos: arr, canEditIndex: '', canAdd: true, canEdit: false });
    }

  render() {
    const { operating } = this.props;
    const { expendInfos,canEdit,canEditIndex } = this.state;
    return (
      <div>
        {expendInfos &&
          expendInfos.length > 0 ?
          expendInfos.map((item ,index)=> (
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
                    operating === 0 ? null:
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
                          value={item.device}
                          onChange={this.onValueChange.bind(this, 'device', index)}
                          placeholder={operating === 0 ? '' : '万元'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                    >
                      设备投入:
                    </InputItem>
                      </div>
                      <div>
                      <InputItem
                          value={item.ad}
                          onChange={this.onValueChange.bind(this, 'ad', index)}
                          placeholder={operating === 0 ? '' : '万元'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        >
                          广告投入:
                        </InputItem>
                      </div>
                      <div>
                      <InputItem
                          value={item.info}
                          onChange={this.onValueChange.bind(this, 'info', index)}
                          placeholder={operating === 0 ? '' : '万元'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        >
                          信息投入:
                        </InputItem>
                      </div>
                    </div>
                    <div>
                      <div>
                      <InputItem
                          value={item.shows}
                          onChange={this.onValueChange.bind(this, 'shows', index)}
                          placeholder={operating === 0 ? '' : '参展情况'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        >
                          参展情况:
                        </InputItem>
                      </div>
                      <div>
                      <InputItem
                          value={item.loan}
                          onChange={this.onValueChange.bind(this, 'loan', index)}
                          placeholder={operating === 0 ? '' : '贷款情况'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                    >
                      贷款情况:
                    </InputItem>
                      </div>
                      <div>
                      <InputItem
                          value={item.finance}
                          onChange={this.onValueChange.bind(this, 'finance', index)}
                          placeholder={operating === 0 ? '' : '融资情况'}
                          disabled={operating === 0 ? true : canEditIndex === index ? false : true}
                        >
                          融资情况:
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
    )
  }
}

const OtherInputsDetailWrapper = createForm()(OtherInputs_detail);
export default OtherInputsDetailWrapper;
