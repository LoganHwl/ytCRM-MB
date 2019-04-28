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
  return request(`/customer/updateSaleInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 修改状态信息
export async function changeStatusInfo(params) {
  return request(`/customer/updateStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 转移负责人
export async function changeBelong(params) {
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

// 验证用户真实姓名是否存在
export async function getUserRealName(params) {
  return request(`/user/existName/${String(params)}`);
}
// 新增客户
export async function submitCustomerForm(params) {
  return request(`/customer/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 修改客户信息
export async function updateCustomerInfo(params) {
  return request(`/customer/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 数据统计页面
// 首页数据---客户统计图表数据
export async function getCountInfo(params) {
  return request(`/home/static?${stringify(params)}`);
}

// 用户管理页面
//用户列表
export async function getUserList(params) {
  return request(`/user/page?${stringify(params)}`);
}
// 获取角色列表
export async function getAllRole() {
  return request(`/user/getAllRole`);
}
// 设置角色
export async function setRole(params) {
  return request(`/user/setRole`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
