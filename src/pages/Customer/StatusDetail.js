import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, WhiteSpace, Icon } from 'antd-mobile';
import Header from '../Base/header';
import MyCard from '../../components/Card';

import styles from './style.less';

@connect(({ home, loading }) => ({
  ...home,
  loading: loading.effects['home/getCustomerDetail'],
}))
class StatusDetail extends Component {
  state = {
    saleInfos: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const ID = this.props.location.query.id;
    dispatch({
      type: 'home/getCustomerDetail',
      payload: ID,
    }).then(res => {
      this.setState({ saleInfos: res.saleInfos });
    });
  }
  // shouldComponentUpdate(nextProps) {
  //   if (this.props.customerDetail != nextProps.customerDetail) {
  //     return true;
  //   }
  // }
  render() {
    const { customerDetail } = this.props;
    // const { saleInfos } = this.state
    return (
      <div className={styles.page}>
        <Header>销售详情</Header>
        <div className={styles.statusDetail_pane}>
          <div>
            <span>客户名称：</span>
            <b>{customerDetail && customerDetail.name}</b>
          </div>
          <div>
            <span>等级：</span>
            <b>{customerDetail && customerDetail.level}</b>
          </div>
          <div>
            <span>责任人：</span>
            <b>{customerDetail && customerDetail.belongUserName}</b>
          </div>
          <div>
            <span>销售阶段：</span>
            <b>{customerDetail && customerDetail.saleStatus}</b>
          </div>
          <div>
            <span>状态：</span>
            <b>{customerDetail && customerDetail.status}</b>
          </div>
          <div>
            <span>来源：</span>
            <b>{customerDetail && customerDetail.source}</b>
          </div>
          <div>
            <span>创建日期：</span>
            <b>{customerDetail && customerDetail.createTime}</b>
          </div>
          <div>
            <span style={{ width: 'auto' }}>当前状态已停留：</span>
            <b>{customerDetail && customerDetail.saleDays}</b>
          </div>
        </div>
        <div className={styles.change_title}>变更信息</div>
        {customerDetail && customerDetail.saleInfos && customerDetail.saleInfos.length > 0 ? 
          customerDetail.saleInfos.map(item => (
            <div className={styles.status_card}  key={item.id}>
            <MyCard key={item.id}>
              <Card.Body>
                <div>
                  <div>
                    <div>
                      <span>日期:</span>
                      <b>{item.createTime}</b>
                      <b className={
                    item.customerStatus && item.customerStatus === 2
                      ? `${styles.spec_color} ${styles.normal}`
                      : styles.normal
                  } style={{float:'right'}}>
                  {item.customerStatus&&item.customerStatus === 1
                        ? '正常'
                        : item.customerStatus === 2
                          ? '超时'
                          : item.customerStatus === 3
                            ? '关闭'
                            : item.customerStatus === 4
                              ? '回收'
                              : item.customerStatus === 5
                                ? '删除'
                                : null
                                }</b>
                      <b className={styles.normal
                  } style={{float:'right'}}>
                  {item.saleStatus && customerDetail.saleStatus === 1
                        ? '线索'
                        : customerDetail.saleStatus === 2
                          ? '沟通'
                          : customerDetail.saleStatus === 3
                            ? '面谈'
                            : customerDetail.saleStatus === 4
                              ? '签约'
                              : customerDetail.saleStatus === 5
                                ? '合作'
                                : null}</b>
                    </div>
                    <div>
                      <span>备注:</span>
                      <b>{item.remark}</b>
                    </div>
                  </div>
                  <div>
                    <div>
                      <span>备注人:</span>
                      <b>{item.userNmae}</b>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </MyCard>
            </div>
          )
          )
         :
         <div style={{    paddingTop: '2em', width: '100%', height: '5em',textAlign: 'center',color:'#999999'}}>暂无数据</div>
        }
      </div>
    );
  }
}

export default StatusDetail;
