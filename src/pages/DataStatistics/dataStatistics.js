import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Header from '../Base/header';
import { List, Toast, Calendar, Accordion } from 'antd-mobile';
import enUS from 'antd-mobile/lib/calendar/locale/en_US';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import { Select, DatePicker } from 'antd';

import moment from 'moment';

import styles from './static.less';

//引入图片路径
import Background from '../../assets/home/combined-shape.svg';

const { RangePicker } = DatePicker;
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
  minWidth: '37px',
  minHeight: '32px',
  margin: '0 .5em 0 2em',
  verticalAlign: 'bottom',
  textAlign: 'center',
  backgroundImage: `url(${Background})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  backgroundSize: 'contain',
  display: 'inline-block',
};

// 默认选择时间为最近一个月
const defaultSelectDate = {
  startDate: moment().subtract(1, 'month'),
  endDate: moment().endOf('day'),
};
const getNowFormatDate = type => {
  let date = new Date();
  let seperator1 = '-';
  let seperator2 = ':';
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
    strDate +
    ' ' +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds();
  return currentdate;
};
const extra = {
  '2017/07/15': { info: 'Disable', disable: true },
};

const now = new Date();
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5)] = {
  info: 'Disable',
  disable: true,
};
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6)] = {
  info: 'Disable',
  disable: true,
};
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)] = {
  info: 'Disable',
  disable: true,
};
extra[+new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8)] = {
  info: 'Disable',
  disable: true,
};

Object.keys(extra).forEach(key => {
  const info = extra[key];
  const date = new Date(key);
  if (!Number.isNaN(+date) && !extra[+date]) {
    extra[+date] = info;
  }
});
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
    status: '全部',
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
      startTime,
      endTime,
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

  onSelectHasDisableDate = dates => {
    console.warn('onSelectHasDisableDate', dates);
  };

  async onConfirm(startTime, endTime) {
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
    const { dispatch } = this.props;
    this.setState({
      show: false,
      startTime,
      endTime,
    });
    const params = {
      startTime,
      endTime,
      status: this.state.status,
    };
    const countInfo = await dispatch({
      type: 'home/getCountInfo',
      payload: params,
    });
    if (countInfo) {
      this.resetList(countInfo);
    }
  }

  onCancel = () => {
    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
    this.setState({
      show: false,
      startTime: undefined,
      endTime: undefined,
    });
  };
  renderBtn(zh, config = {}) {
    // debugger
    config.locale = zhCN;

    return (
      <List.Item
        arrow={<span>*</span>}
        onClick={() => {
          document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
          this.setState({
            show: true,
            config,
          });
        }}
        style={{ minHeight: '38px' }}
      >
        {zh}
      </List.Item>
    );
  }
  getDateExtra = date => extra[+date];

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
      status: title,
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
    const { roleId, list, config, activeKey, status } = this.state;
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
            <Accordion.Panel key={'0'} header={status}>
              <List className="my-list">
                {statusList.map((item, index) => (
                  <List.Item key={index} onClick={e => this.onStatusChange(e, item.id, item.title)}>
                    {item.title}
                  </List.Item>
                ))}
              </List>
            </Accordion.Panel>
          </Accordion>

          <List className={styles.calendar_list}>{this.renderBtn('选择日期区间')}</List>
          <Calendar
            {...this.state.config}
            visible={this.state.show}
            onCancel={this.onCancel}
            onConfirm={this.onConfirm.bind(this)}
            onSelectHasDisableDate={this.onSelectHasDisableDate}
            getDateExtra={this.getDateExtra}
            // defaultValue={[defaultSelectDate.startDate, defaultSelectDate.endDate]}
            // defaultDate={now}
            minDate={new Date(+now - 5184000000)}
            maxDate={new Date(+now + 31536000000)}
          />

          {/* <RangePicker
              style={{ width: '16em' }}
              defaultValue={[defaultSelectDate.startDate, defaultSelectDate.endDate]}
              onChange={value => this.onDateChange(value)}
              disabledDate={current => {
                return (
                  // current.isBefore(moment(Date.now()).add(-30, 'days')) ||
                  current.isAfter(moment(Date.now()).add(0, 'days'))
                );
              }}
            /> */}
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
                      width: parseFloat(item.width) <= parseFloat('3.0%') ? '3.0%' : item.width,
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
            <div className={styles.no_info}>暂无数据</div>
          )}
        </div>
      </div>
    );
  }
}

export default dataStatistics;
