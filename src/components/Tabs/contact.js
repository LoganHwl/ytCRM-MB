import { Icon, Card,DatePicker,InputItem,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import styles from './tabs.less'
import MyCard from "../Card";

import ADD from "../../assets/add.png";

@connect(({ home }) => ({
    ...home,
  }))

class Contact extends React.Component {
    state = {
        contactInfo: {},
        contactInfos:[],
        componentArray: [1],
        num: 1,
        canEdit:[],
        canAdd:false
    }
    
  onValueChange(pair) {
    const { contactInfo } = this.state;
    this.setState({contactInfo:{ ...contactInfo, ...pair } });
  }
     // 添加到props
     onConditionChange(key, e) {
      const { contactInfo ,contactInfos,canEdit} = this.state  
      // 每个面板的确认按钮只能点击一次 
      if(canEdit.includes(key)){
        return
      }
      if (
              !contactInfo.name ||
              !contactInfo.position ||
              !contactInfo.phone           
        ) {
          Toast.fail('请填写完整联系人信息。', 1);
          return;
        }
      
  
      //添加数组并去重
      contactInfos.push(contactInfo)   
      let array = Array.from(new Set(contactInfos));
  
      this.props.dispatch({
        type: 'home/CONDITION_CHANGE',
        payload:{contactInfos:array} ,
      });
      // 每个面板的确认按钮只能点击一次
      canEdit.push(key)
      this.setState({canEdit,contactInfo:{},canAdd:true})
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
      componentArray.map(item => {
        if (key != item) {
          arr.push(item);
        }
      });
      this.setState({ componentArray: arr, canAdd: true });
    }
   
  }
    render() {
        const { componentArray,canEdit } = this.state;
        return (
          <div>
            {componentArray &&
              componentArray.length > 0 &&
              componentArray.map(item => (
                <div className={styles.tabsCard} key={item}>
                  <MyCard>
                    <Card.Header
                      style={{padding:'6px 15px'}}
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
                              onChange={value => this.onValueChange({ name: value })}
                              placeholder="联系人姓名"
                              disabled={canEdit.includes(item)?true:false}
                            >
                              姓名
                            </InputItem>
                          </div>
                          <div>
                            <InputItem
                              onChange={value => this.onValueChange({ phone: value })}
                              placeholder="联系电话"
                              disabled={canEdit.includes(item)?true:false}
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
                              disabled={canEdit.includes(item)?true:false}
                            >
                              职位
                            </InputItem>
                          </div>
                          <div>
                            <InputItem
                              onChange={value => this.onValueChange({ shows: value })}
                              placeholder="其他"
                              disabled={canEdit.includes(item)?true:false}
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
            <div className={styles.addOne} onClick={this.addComponent}>
            <img src={ADD}/>
              {/* <Icon onClick={this.addComponent} type="down" size="lg" /> */}
            </div>
          </div>
        );
    }
}

const ContactWrapper = createForm()(Contact);
export default ContactWrapper