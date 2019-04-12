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
class OtherInputs extends React.Component {
  state = {
    expendInfo:{},
    expendInfos: [],
    componentArray: [1],
    num: 1,
    canEdit:[],
    canAdd:false,
    device:'',
    ad:'',
    info:'',
    hasError:false
  };
  // onValueChange(pair) {
  //   const { expendInfo } = this.state;

  //   if(pair.device) {
  //     this.setState({device: pair.device})
  //   }  else if(pair.ad) {
  //     this.setState({ad: pair.ad})
  //   }  else if(pair.info) {
  //     this.setState({info: pair.info})
  //   } 

  //   this.setState({expendInfo:{ ...expendInfo, ...pair } });
  // }
  // 内容改变时触发
  onValueChange(name,value) {
    const { expendInfo } = this.state;
    const reg=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if(name ==='device'||name ==='ad'||name ==='info') {
        if (!reg.test(value)) {
          Toast.fail('只能输入两位小数',1);
          this.setState({hasError:true})
        }else{
          this.setState({hasError:false})
        }
        value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
      } 
        expendInfo[name] =value
      
    this.setState( Object.assign({}, { expendInfo }),
                  () => {console.log(this.state);}
      )
  }
   // 添加到props
   onConditionChange(key, e) {
    const { expendInfo ,expendInfos,canEdit,hasError} = this.state  
    // debugger
    if(hasError){
      Toast.fail('请确保输入项正确后提交', 1);
      return;
    }
    // 每个面板的确认按钮只能点击一次 
    if(canEdit.includes(key)){
      return
    }
    if (!expendInfo.year) {
      Toast.fail('年份是必填项', 1);
      return;
    } else {
      if (
        !(
            expendInfo.device ||
            expendInfo.ad ||
            expendInfo.info ||
            expendInfo.shows ||
            expendInfo.loan ||
            expendInfo.finance
        )
      ) {
        Toast.fail('至少填写一项投入信息', 1);
        return;
      }
    }

    //添加数组并去重
    expendInfos.push(expendInfo)   
    let array = Array.from(new Set(expendInfos));

    this.props.dispatch({
      type: 'home/CONDITION_CHANGE',
      payload:{expendInfos:array} ,
    });
    // 每个面板的确认按钮只能点击一次
    canEdit.push(key)
    this.setState({canEdit,expendInfo:{},canAdd:true})
  }

  addComponent = () => {
    const { num,canAdd,componentArray } = this.state;
      // 每个面板的确认按钮只能点击一次
      if(componentArray.length>0){
        if(canAdd===true){
          let arr = [...this.state.componentArray];
          let newNum = num + 1;
          arr.push(newNum);
          this.setState({
            componentArray: arr,
            num: newNum,
            canAdd:false
          });
        }else {
          Toast.fail('请先确认', 1);
        }
      } else{
        let arr = [...this.state.componentArray];
        let newNum = num + 1;
        arr.push(newNum);
        this.setState({
          componentArray: arr,
          num: newNum,
          canAdd:false
        });
      }  
  };
  deleteComponent(key, e) {
    const { componentArray } = this.state;
    let arr = [];
    if(componentArray&&componentArray.length>0){
      componentArray.map((item, index) => {
        if (key != item) {
          arr.push(item);
        }
      });
      this.setState({ componentArray: arr,canAdd:true });
    }
   
  }

  render() {
    const { componentArray,canEdit } = this.state;
    // debugger;
    return (
      <div>
        {componentArray &&
          componentArray.length > 0 &&
          componentArray.map(item => (
            <div className={styles.tabsCard} key={item}>
              <MyCard>
                <Card.Header
                  title={
                    <div className={styles.tabsCardHeader}>
                      <InputItem
                        type='number'
                        onChange={this.onValueChange.bind(this, 'year')}
                        // onChange={value => this.onValueChange({ year: value })}
                        placeholder="年份"
                        disabled={canEdit.includes(item)?true:false}
                      >
                        年度
                      </InputItem>
                    </div>
                  }
                  extra={
                    <div className={styles.btn_pane}>
                      <span onClick={this.onConditionChange.bind(this, item)} className={canEdit.includes(item)?null:styles.confirm}>确认</span>
                      <span onClick={this.deleteComponent.bind(this, item)} className={styles.delete}>删除</span>
                    </div>
                  }
                />
                <Card.Body>
                  <div className={styles.col}>
                    <div>
                      <div>
                        <InputItem
                          type='digit'
                          // value={this.state.device}
                          placeholder="万元"
                          disabled={canEdit.includes(item)?true:false}
                          onChange={this.onValueChange.bind(this, 'device')}
                          // onChange={value =>{
                          //   value =  value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
                          //    this.onValueChange({ device: value });
                          //  } }
                        >
                          设备投入
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          type='digit'
                          // value={this.state.ad}
                          placeholder="万元"
                          disabled={canEdit.includes(item)?true:false}
                          onChange={this.onValueChange.bind(this, 'ad')}
                          // onChange={value =>{
                          //   value =  value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
                          //    this.onValueChange({ ad: value });
                          //  } }
                        >
                          广告投入
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                          type='digit'
                          // value={this.state.info}
                          placeholder="万元"
                          disabled={canEdit.includes(item)?true:false}
                          onChange={this.onValueChange.bind(this, 'info')}
                          // onChange={value =>{
                          //   value =  value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
                          //    this.onValueChange({ info: value });
                          //  } }
                        >
                          信息投入
                        </InputItem>
                      </div>
                    </div>
                    <div>
                      <div>
                        <InputItem
                        onChange={this.onValueChange.bind(this, 'shows')}
                          // onChange={value => this.onValueChange({ shows: value })}
                          placeholder="万元"
                          disabled={canEdit.includes(item)?true:false}
                        >
                          参展情况
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                        onChange={this.onValueChange.bind(this, 'loan')}
                          // onChange={value => this.onValueChange({ loan: value })}
                          placeholder="万元"
                          disabled={canEdit.includes(item)?true:false}
                        >
                          贷款情况
                        </InputItem>
                      </div>
                      <div>
                        <InputItem
                        onChange={this.onValueChange.bind(this, 'finance')}
                          // onChange={value => this.onValueChange({ finance: value })}
                          placeholder="万元"
                          disabled={canEdit.includes(item)?true:false}
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
        <div className={styles.addOne} onClick={this.addComponent}>
            <img src={ADD}/>
              {/* <Icon onClick={this.addComponent} type="down" size="lg" /> */}
            </div>
      </div>
    );
  }
}

const OtherInputsWrapper = createForm()(OtherInputs);
export default OtherInputsWrapper;
