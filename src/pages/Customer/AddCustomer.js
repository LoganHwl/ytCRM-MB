import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, WhiteSpace } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import Header from '../Base/header';

import BasicInputWrapper from '../../components/Tabs/base';
import QualificationsWrapper from '../../components/Tabs/qualifications';
import FinanceWrapper from '../../components/Tabs/finance';
import OtherInputsWrapper from '../../components/Tabs/otherInputs';
import ContactWrapper from '../../components/Tabs/contact';
import ChangeHistoryWrapper from '../../components/Tabs/changeHistory';

import styles from './style.less'
import { Select, Radio } from 'antd';

@connect(({ home, loading }) => ({
    ...home,
    loading: loading.effects['home/getWarningList'],
}))




class AddCustomer extends Component {
    state = {
    };
    tabs = [
        { title: '基本' },
        { title: '资质' },
        { title: '财务' },
        { title: '其他投入' },
        { title: '联系人' },
        { title: '变更历史' },
    ];
    renderTabBar(props) {
    return (<Sticky>
        {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
    componentDidMount() {
        const { dispatch } = this.props;
        // dispatch({
        //   type: 'home/getWarningList',
        //   payload: {
        //     startPage: 1,
        //     pageSize: 100
        //   }
        // });
    }
    render() {
        const {
        } = this.props
        // const { key } = this.state
        return (
            <div className={styles.add_page}>
            <Header>
                新增客户
            </Header>
                <StickyContainer>
                    <Tabs tabs={this.tabs}
                        initalPage={'t2'}
                        renderTabBar={this.renderTabBar}
                    >
                        <div className={styles.tab_pane}>
                            <BasicInputWrapper/>
                        </div>
                        <div className={styles.tab_pane}>
                            <QualificationsWrapper/>
                        </div>
                        <div className={styles.tab_pane}>
                        <FinanceWrapper/>
                        </div>
                        
                        <div className={styles.tab_pane}>
                        <OtherInputsWrapper/>
                        </div>
                        
                        <div className={styles.tab_pane}>
                        <ContactWrapper/>
                        </div>
                        <div>
                        <ChangeHistoryWrapper/>
                        </div>
                    </Tabs>
                </StickyContainer>
                <WhiteSpace />
            </div>
        );
    }
}

export default AddCustomer;
