import { stringify } from 'qs';
import request from '@/utils/request';

// 登陆
// 获取登陆者信息
export async function getUserInfo() {
  return request('/user/info');
}
// 首页
//超时预警列表数据
export async function getWarningList(params) {
  return request(`/home/page?${stringify(params)}`);
}
//客户列表数据
export async function getCustomerList(params) {
  return request(`/customer/page?${stringify(params)}`);
}
// 获取责任人列表
export async function getUserForAssign() {
  return request(`/user/getUserForAssign`, { method: 'POST' });
}
// 修改阶段信息
export async function changeSaleInfo(params) {
  // debugger;
  return request(`/customer/updateSaleInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 修改状态信息
export async function changeStatusInfo(params) {
  // debugger;
  return request(`/customer/updateStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 转移负责人
export async function changeBelong(params) {
  // debugger;
  return request(`/customer/change`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 客户详情
export async function getCustomerDetail(params) {
  return request(`/customer/detail/${params}`);
}

// 验证客户名是否存在
export async function getCustomerName(params) {
  return request(`/customer/getName/${String(params)}`);
}
// 新增客户
export async function submitCustomerForm(params) {
  // debugger;
  return request(`/customer/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 修改客户信息
export async function updateCustomerInfo(params) {
  // debugger;
  return request(`/customer/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// export async function queryProjectNotice() {
//   return request('/api/project/notice');
// }

// export async function queryActivities() {
//   return request('/api/activities');
// }

// export async function queryRule(params) {
//   return request(`/api/rule?${stringify(params)}`);
// }

// export async function removeRule(params) {
//   return request('/api/rule', {
//     method: 'POST',
//     body: {
//       ...params,
//       method: 'delete',
//     },
//   });
// }

// export async function addRule(params) {
//   return request('/api/rule', {
//     method: 'POST',
//     body: {
//       ...params,
//       method: 'post',
//     },
//   });
// }

// export async function updateRule(params) {
//   return request('/api/rule', {
//     method: 'POST',
//     body: {
//       ...params,
//       method: 'update',
//     },
//   });
// }

// export async function fakeSubmitForm(params) {
//   return request('/api/forms', {
//     method: 'POST',
//     body: params,
//   });
// }

// export async function fakeChartData() {
//   return request('/api/fake_chart_data');
// }

// export async function queryTags() {
//   return request('/api/tags');
// }

// export async function queryBasicProfile() {
//   return request('/api/profile/basic');
// }

// export async function queryAdvancedProfile() {
//   return request('/api/profile/advanced');
// }

// export async function queryFakeList(params) {
//   return request(`/api/fake_list?${stringify(params)}`);
// }

// export async function removeFakeList(params) {
//   const { count = 5, ...restParams } = params;
//   return request(`/api/fake_list?count=${count}`, {
//     method: 'POST',
//     body: {
//       ...restParams,
//       method: 'delete',
//     },
//   });
// }

// export async function addFakeList(params) {
//   const { count = 5, ...restParams } = params;
//   return request(`/api/fake_list?count=${count}`, {
//     method: 'POST',
//     body: {
//       ...restParams,
//       method: 'post',
//     },
//   });
// }

// export async function updateFakeList(params) {
//   const { count = 5, ...restParams } = params;
//   return request(`/api/fake_list?count=${count}`, {
//     method: 'POST',
//     body: {
//       ...restParams,
//       method: 'update',
//     },
//   });
// }

// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     body: params,
//   });
// }

// export async function fakeRegister(params) {
//   return request('/api/register', {
//     method: 'POST',
//     body: params,
//   });
// }

// export async function queryNotices() {
//   return request('/api/notices');
// }

// export async function getFakeCaptcha(mobile) {
//   return request(`/api/captcha?mobile=${mobile}`);
// }
