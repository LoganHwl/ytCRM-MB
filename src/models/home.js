import {
    getWarningList,
    getCustomerDetail,
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
    },
  
    reducers: {
        GET_WARNING_LIST(state, { warningList }) {
            return { ...state, warningList };
          },
      GET_CUSTOMER_DETAIL(state, { customerDetail }) {
        return { ...state, customerDetail };
      },
    },
  };
  