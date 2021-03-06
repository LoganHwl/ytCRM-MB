import React, { Component } from 'react'
import { Card } from 'antd-mobile';
import styles from './index.less'

class MyCard extends Component {
    state = {}
    componentDidMount() {}
    componentWillReceiveProps(nextProps) {}

    render() {
        return (
            <Card className={styles.list_card}>
                {this.props.children}
            </Card>
        )
    }
}

export default MyCard