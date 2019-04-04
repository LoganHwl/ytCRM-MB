import {
  getWarningList,
  getCustomerList,
  getCustomerDetail,
  getUserForAssign,
  changeSaleInfo,
  changeStatusInfo,
  changeBelong,
} from '@/services/api';
import { message } from 'antd';

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
        } else {
          message.error(warningList.msg);
          return;
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
        } else {
          message.error(customerList.msg);
          return;
        }
      } catch (err) {
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
  },

  reducers: {
    GET_WARNING_LIST(state, { warningList }) {
      return { ...state, warningList };
    },
    GET_CUSTOMER_LIST(state, { customerList }) {
      return { ...state, customerList };
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
    // COMPONENT_ARRAY_CHANGE(state, { componentArray }) {
    //   return { ...state, componentArray};
    // },
    GET_USERT_FOR_ASSIGN(state, { userForAssign }) {
      return { ...state, userForAssign };
    },
    CLEAR_ALL(state) {
      return { ...state, search: {}, customerList: {}, customerInfo: {} };
    },
  },
};
