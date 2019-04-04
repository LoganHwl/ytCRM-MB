import React, { Component } from 'react';
import PropTypes from 'prop-types';
import router from 'umi/router';
import style from './index.less';

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
        router.push({
          pathname: '/customer-add',
          query: { type: 'add' },
        });
        break;
      case 2:
        router.push({
          pathname: '/customer-list',
        });
        break;
      case 3:
        router.push({
          pathname: '/login',
          //  query: { type: 'detail.id' },
        });
        break;
      case 4:
        router.push('/login');
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
            <div className="card-img">
              <img src={item.src} alt="" />
            </div>
            <div className="title">{item.title}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default app;
