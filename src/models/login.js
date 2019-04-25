import { getUserInfo } from '@/services/api';
import { Toast } from 'antd-mobile';

export default {
  namespace: 'login',

  state: {
    menuData: [],
  },

  effects: {
    *getUserInfo(_, { call, put }) {
      try {
        const response = yield call(getUserInfo);
        if (response && response.data && response.data != null ) {
          localStorage.setItem('userName', response.data.userInfo.nickName);
          sessionStorage.setItem('roleId', response.data.roleInfo.id);
          sessionStorage.setItem('userRealName', response.data.userInfo.realName);
        }
        return response
      } catch (err) {
        console.log('getUserInfo-error', err);
      }
    },
  },

  reducers: {
  },
};
