import React, { Component } from 'react';
import { connect } from 'dva';
import Header from '../Base/header';
import { List, Toast, Calendar, Accordion,Icon } from 'antd-mobile';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';

import styles from './static.less';
//引入图片路径
import Background from '../../assets/dataStatic/Combined.svg';
import rili from '../../assets/dataStatic/Group.svg';

import '../../styles/iconfont.less'

const statusList = [
  {
    id: 0,
    title: '全部',
  },
  {
    id: 1,
    title: '正常',
  },
  {
    id: 2,
    title: '超时',
  },
  {
    id: 3,
    title: '关闭',
  },
  {
    id: 4,
    title: '回收',
  },
  {
    id: 5,
    title: '正常+超时',
  },
];

//定义背景样式
const sectionStyle = {
  width: '1em',
  height: '1em',
  // minWidth: '37px',
  minHeight: '35px',
  margin: '0 0 .1em 2.65em',
  verticalAlign: 'bottom',
  textAlign: 'center',
  backgroundImage: `url(${Background})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  backgroundSize: 'contain',
  display: 'inline-block',
};
const riliStyle = {
  width: '1em',
  height: '1em',
  verticalAlign: 'bottom',
  backgroundImage: `url(${rili})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  backgroundSize: 'contain',
  display: 'inline-block',
  position: 'absolute',
  top: '.53em',
  right: '.2em'
};

// 默认选择时间为最近一个月
const getNowFormatDate = type => {
  let date = new Date();
  let seperator1 = '-';
  let month = type === 1 ? date.getMonth() + 1 : date.getMonth();
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  let currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate 
  return currentdate;
};

@connect(({ home }) => ({
  ...home,
}))
class dataStatistics extends Component {
  originbodyScrollY = document.getElementsByTagName('body')[0].style.overflowY;
  state = {
    noNet: false,
    startPage: 1,
    pageSize: 5,
    status: 0,
    startTime: '',
    endTime: '',
    roleId: 1,
    list: [],
    show: false,
    config: {},
    activeKey: '',
    statusName: '全部',
    status:0
  };
  async componentWillMount() {
    Toast.loading('正在加载...', 0);
    const { dispatch } = this.props;
    const startTime = getNowFormatDate(0);
    const endTime = getNowFormatDate(1);
    console.log(startTime);
    console.log(endTime);
    this.setState({
      startTime,
      endTime,
    });
    const params_count = {
      status: 0,
      startTime:startTime +' 00:00:00',
      endTime:endTime+' 23:59:59',
    };
    const countInfo = await dispatch({
      type: 'home/getCountInfo',
      payload: params_count,
    });
    if (countInfo) {
      this.resetList(countInfo);
      Toast.hide();
    }
  }

  componentDidMount() {}

  // 重新刷新页面
  reload = () => {
    location.reload();
  };

  //   客户统计数据处理
  resetList(countInfo) {
    if (countInfo && countInfo != false && countInfo.allCount) {
      let clue_count =
        countInfo.clueCount +
        countInfo.commCount +
        countInfo.interviewCount +
        countInfo.signCount +
        countInfo.coorCount;
      let comm_count =
        countInfo.commCount + countInfo.interviewCount + countInfo.signCount + countInfo.coorCount;
      let interview_count = countInfo.interviewCount + countInfo.signCount + countInfo.coorCount;
      let sign_count = countInfo.signCount + countInfo.coorCount;
      let list = [
        {
          title: '全体',
          count: countInfo.allCount,
          percent: `${
            countInfo.allCount === 0 ? '0.0' : ((clue_count / countInfo.allCount) * 100).toFixed(1)
          }%`,
          width: `${countInfo.allCount === 0 ? 3 : 100}%`,
          color: '#00AC17',
        },
        {
          title: '线索',
          count: clue_count,
          percent: `${clue_count === 0 ? '0.0' : ((comm_count / clue_count) * 100).toFixed(1)}%`,
          width: `${clue_count === 0 ? 3 : (clue_count / countInfo.allCount) * 100}%`,
          color: '#B96907',
        },
        {
          title: '沟通',
          count: comm_count,
          percent: `${
            comm_count === 0 ? '0.0' : ((interview_count / comm_count) * 100).toFixed(1)
          }%`,
          width: `${comm_count === 0 ? 3 : (comm_count / countInfo.allCount) * 100}%`,
          color: '#1B7BB0',
        },
        {
          title: '面谈',
          count: interview_count,
          percent: `${
            interview_count === 0 ? '0.0' : ((sign_count / interview_count) * 100).toFixed(1)
          }%`,
          width: `${interview_count === 0 ? 3 : (interview_count / countInfo.allCount) * 100}%`,
          color: '#CE9817',
        },
        {
          title: '签约',
          count: sign_count,
          percent: `${
            sign_count === 0 ? '0.0' : ((countInfo.coorCount / sign_count) * 100).toFixed(1)
          }%`,
          width: `${sign_count === 0 ? 3 : (sign_count / countInfo.allCount) * 100}%`,
          color: '#9FC404',
        },
        {
          title: '合作',
          count: countInfo.coorCount,
          percent: null,
          width: `${
            countInfo.coorCount === 0 ? 3 : (countInfo.coorCount / countInfo.allCount) * 100
          }%`,
          color: '#DF0000',
        },
      ];

      this.setState({ list });
    }
  }


  onConfirm= async(s, e)=> {
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
    const { dispatch} = this.props;
    const startTime = s.toLocaleString().replace(/\//g,'-');
    const sub_startTime = startTime.substring(0, startTime.indexOf(' '));
    const endTime = e.toLocaleString().replace(/\//g,'-');
    const sub_endTime = endTime.substring(0, endTime.indexOf(' '));
    this.setState({
      show: false,
      startTime:sub_startTime,
      endTime:sub_endTime,
    });
    const params = {
      startTime:sub_startTime +' 00:00:00',
      endTime:sub_endTime +' 23:59:59',
      status: this.state.status,
    };
   const res = await dispatch({
      type: 'home/getCountInfo',
      payload: params,
    });
    if (res) {
      this.resetList(res);
    }
  }
  onCancel = () => {
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
    this.setState({show: false});
  };
  renderBtn(zh, config = {}) {
    // debugger
    config.locale = zhCN;

    return (
      <div>
      <List.Item
        onClick={() => {
          document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
          this.setState({
            show: true,
            config,
            activeKey:''
          });
        }}
        style={{ minHeight: '38px' }}
      >
        {zh}
      </List.Item>
      <span style={riliStyle} className={styles.riliImg}></span>
      </div>
    );
  }
  getDateExtra = date =>{
    extra[+date];
  } 

  // 手风琴点击及选择对应筛选条件后回调
  onAccordionChange = e => {
    if (!e) {
      this.setState({ activeKey: '' });
    } else if (e) {
      this.setState({ activeKey: e });
    }
  };
  // 筛选项---状态
  async onStatusChange(e, id, title) {
    const { dispatch } = this.props;
    const { startTime, endTime } = this.state;
    this.setState({
      statusName: title,
      status:id
    });
    const params = {
      startTime,
      endTime,
      status: id,
    };
    this.onAccordionChange();
    const countInfo = await dispatch({
      type: 'home/getCountInfo',
      payload: params,
    });
    if (countInfo) {
      this.resetList(countInfo);
    }
  }
  render() {
    const { countInfo } = this.props;
    const { roleId, list, config, activeKey, statusName } = this.state;
    return (
      <div className={styles.page}>
        <Header>客户统计</Header>
        <div className={styles.search_condition}>        
          <Accordion
            accordion
            activeKey={activeKey}
            openAnimation={{}}
            className={styles.search_accordion}
            onChange={this.onAccordionChange}
          >
            <Accordion.Panel key={'0'} header={statusName}>
              <List className="my-list">
                {statusList.map((item, index) => (
                  <List.Item key={index} onClick={e => this.onStatusChange(e, item.id, item.title)}>
                    {item.title}
                  </List.Item>
                ))}
              </List>
            </Accordion.Panel>
          </Accordion>

          <List className={styles.calendar_list}>
          {this.renderBtn(`${this.state.startTime}~${this.state.endTime}`)}
          
          </List>
          <Calendar
            {...this.state.config}
            visible={this.state.show}
            onCancel={this.onCancel}
            onConfirm={this.onConfirm}
            // getDateExtra={this.getDateExtra}
          />
        </div>

        <div className={styles.stage}>
          {countInfo && countInfo.allCount > 0 ? (
            list.map((item, index) => (
              <div key={index}>
                <div className={styles.progress_pane}>
                  <span className={styles.progress_title}>{item.title}</span>
                  <span
                    className={styles.count}
                    style={{
                      width: parseFloat(item.width) <= parseFloat('5.0%') ? '5.0%' : item.width,
                      background: item.color,
                    }}
                  >
                    {item.count}
                  </span>
                </div>
                {item.percent != null ? (
                  <div style={{ lineHeight: '37px' }}>
                    <div style={sectionStyle} />
                    <span className={styles.percent}>{item.percent}</span>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className={styles.no_info}>暂无数据~</div>
          )}
        </div>
      </div>
    );
  }
}

export default dataStatistics;
