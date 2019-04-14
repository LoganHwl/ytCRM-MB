import {
  getWarningList,
  getCustomerList,
  getCustomerDetail,
  getUserForAssign,
  changeSaleInfo,
  changeStatusInfo,
  changeBelong,
  submitCustomerForm,
  updateCustomerInfo,
  getCustomerName,
} from '@/services/api';
import { message } from 'antd';
import { Toast } from 'antd-mobile';

export default {
  namespace: 'home',

  state: {
    search: {},
    startPage: 1,
    customerList: {},
    customerInfo: {},
    saleInfo: {},
    tabsInfo: {},
    componentArray: [1],
  },

  effects: {
    *getWarningList({ payload }, { call, put }) {
      try {
        const warningList = yield call(getWarningList, payload);
        if (warningList && warningList.data) {
          yield put({
            type: 'GET_WARNING_LIST',
            warningList: warningList.data,
          });
          return warningList.data;
        } else if (warningList) {
          return warningList;
        } else {
          return false;
        }
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *getCustomerList({ payload }, { call, put }) {
      try {
        const customerList = yield call(getCustomerList, payload);
        if (customerList && customerList.data) {
          yield put({
            type: 'GET_CUSTOMER_LIST',
            customerList: customerList.data,
          });
          return customerList.data;
        } else if (customerList) {
          return customerList;
        } else {
          return false;
        }
      } catch (err) {
        // debugger;
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *getCustomerDetail({ payload }, { call, put }) {
      try {
        const customerDetail = yield call(getCustomerDetail, payload);
        if (customerDetail && customerDetail.data) {
          yield put({
            type: 'GET_CUSTOMER_DETAIL',
            customerDetail: customerDetail.data,
          });
          return customerDetail.data;
        } else {
          message.error(customerDetail.msg);
          return false;
        }
      } catch (err) {
        const { msg } = err.response || {};

        console.log('错误信息', msg);
      }
    },
    *getUserForAssign({ payload }, { call, put }) {
      const userForAssign = yield call(getUserForAssign);
      yield put({
        type: 'GET_USERT_FOR_ASSIGN',
        userForAssign: userForAssign.data,
      });
    },
    *changeSaleInfo({ payload }, { call }) {
      const res = yield call(changeSaleInfo, payload);
      return res;
    },
    *changeStatusInfo({ payload }, { call }) {
      const res = yield call(changeStatusInfo, payload);
      return res;
    },

    *changeBelong({ payload }, { call }) {
      const res = yield call(changeBelong, payload);
      return res;
    },
    *submitCustomerForm({ payload }, { call, put }) {
      const res = yield call(submitCustomerForm, payload);
      if (res.code === 0) {
        Toast.success('提交成功', 0.5);
        setTimeout(() => {
          history.go(-1);
        }, 500);
        return res;
      } else {
        Toast.fail(res.msg, 1.5);
        return false;
      }
    },
    *updateCustomerInfo({ payload }, { call, put }) {
      try {
        const customerInfo = yield call(updateCustomerInfo, payload);
        if (customerInfo.code === 0) {
          Toast.success('修改成功', 0.5);
          setTimeout(() => {
            history.go(-1);
          }, 500);
        } else {
          message.error(customerInfo.msg);
          return false;
        }
      } catch (err) {
        const { msg } = err.response || {};
        console.log('错误信息', msg);
      }
    },
    *getCustomerName({ payload }, { call, put }) {
      try {
        const customerName = yield call(getCustomerName, payload);
        if (customerName.code === 0) {
          return customerName;
        } else {
          message.error(customerName.msg);
          return false;
        }
      } catch (err) {
        const { msg } = err.response || {};
        console.log('错误信息', msg);
      }
    },
  },

  reducers: {
    GET_WARNING_LIST(state, { warningList }) {
      return { ...state, warningList };
    },
    GET_CUSTOMER_LIST(state, { customerList }) {
      return { ...state, dataSource: customerList };
    },
    GET_CUSTOMER_DETAIL(state, { customerDetail }) {
      return { ...state, customerDetail };
    },
    CHANGE_PAGENO(state, { startPage }) {
      return { ...state, startPage };
    },
    SEARCH_CONDITION_CHANGE(state, { payload }) {
      return { ...state, search: { ...state.search, ...payload } };
    },
    CONDITION_CHANGE(state, { payload }) {
      return { ...state, tabsInfo: { ...state.tabsInfo, ...payload } };
    },
    GET_USERT_FOR_ASSIGN(state, { userForAssign }) {
      return { ...state, userForAssign };
    },
    CLEAR_ALL(state) {
      return { ...state, search: {}, tabsInfo: {}, customerDetail: null };
    },
  },
};
