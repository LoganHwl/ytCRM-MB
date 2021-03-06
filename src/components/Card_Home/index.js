import React, { Component } from 'react';
import PropTypes from 'prop-types';
import router from 'umi/router';
import style from './index.less';
// import { styles } from '_ansi-colors@3.2.4@ansi-colors';

class app extends Component {
  PropTypes = {
    list: PropTypes.array,
    className: PropTypes.string,
  };
  static defaultProps = {
    list: [],
  };

  state = {};
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  goto(id) {
    switch (id) {
      case 1:
        let getTimestamp = new Date().getTime();
        router.push({
          pathname: '/customer-add',
          query: { type: 'add', timestamp: getTimestamp },
        });
        break;
      case 2:
      router.push({
        pathname: '/customer-list',
         query: { timestamp: getTimestamp },
      });
        break;
      case 3:
        router.push({
          pathname: '/static',
           query: { timestamp: getTimestamp },
        });
        break;
      case 4:
      router.push({
        pathname: '/user-list',
         query: { timestamp: getTimestamp },
      });
        break;

      default:
        break;
    }
  }
  close = () => {
    this.setState({ open: false });
    this.props.onClose();
  };

  render() {
    const { list, className } = this.props;
    return (
      <div className={`${style['card-wrap']} ${className}`}>
        {list.map(item => (
          <div className={style.card} key={item.id} onClick={this.goto.bind(this, item.id)}>
            <div>
              <img src={item.src} alt="" />
            </div>
            <div>{item.title}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default app;
