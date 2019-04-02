import React, { Component } from 'react'
import { Card } from 'antd-mobile';
import styles from './index.less'

class DetailCard extends Component {
    state = {}
    componentDidMount() {}
    componentWillReceiveProps(nextProps) {}

    render() {
        return (
            <Card className={styles.detail_card}>
                {this.props.children}
            </Card>
        )
    }
}

export default DetailCard