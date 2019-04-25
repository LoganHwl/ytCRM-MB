import fetch from 'dva/fetch';
import { notification } from 'antd';
import { Toast } from 'antd-mobile';
import router from 'umi/router';
import hash from 'hash.js';
import cookie from 'react-cookies';
import { isAntdPro } from './utils';
import { HOST } from './config';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(
  url,
  options = {
    expirys: isAntdPro(),
  }
) {
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = HOST + url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    // credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  const userToken = sessionStorage.getItem('userToken');
  // const userToken = cookie.load('userToken'); //44dc3445e2fb3f57ff9f877ea2a2256a
 
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        token: userToken,
        // 'Content-Type': 'application/json; charset=utf-8; application/x-www-form-urlencoded;multipart/form-data',
        'Content-Type': 'application/json',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      
      // newOptions.body is FormData
      newOptions.headers = {
        // Accept: 'application/json',
        token: userToken,
        ...newOptions.headers,
      };
    }
  }

  const expirys = options.expirys || 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  //请求之前加入token
  if (!url.includes('/login') && !url.includes('/logout')) {
    const setToken = {
      // token: '250b26274c51c1e1fe182efb24db3733',
      token: userToken,
    };
    newOptions.headers = {
      ...newOptions.headers,
      ...setToken,

      test: 1,
    };
  }
  console.log('url', url);
  console.log('newOptions', newOptions);
  return (
    fetch(HOST + url, newOptions)
      .then(checkStatus)
      //.then(response => cachedSave(response, hashcode))
      .then(response => {
        // DELETE and 204 do not return data by default
        // using .json will report an error.
        if (newOptions.method === 'DELETE' || response.status === 204) {
          return response.text();
        } else if (newOptions.body instanceof FormData) {
          // 上传文件时，返回的不是json
          return response.text();
        }
        return response.json();
      })
      .then(response => {
        // token 失败跳转登录页
        console.log(response);
        if (response.code == '10003') {
          router.push('/login');
          Toast.fail(response.msg,1)
          return response;
        } else {
          return response;
        }
      })
      .catch(e => {
        const status = e.name;
        if (status === 'TypeError') {
          return e.message;
        }
        if (status === 401) {
          // @HACK
          /* eslint-disable no-underscore-dangle */
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
          return;
        }
        // environment should not be used
        if (status === 403) {
          router.push('/exception/403');
          return;
        }
        if (status <= 504 && status >= 500) {
          router.push('/exception/500');
          return;
        }
        if (status >= 404 && status < 422) {
          router.push('/exception/404');
        }
      })
  );
}
