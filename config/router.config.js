let getTimestamp = new Date().getTime();
export default [
   
  // user
  {
    path: '/',
    component: './index',
    // redirect: '/home',
    routes: [
      // 登录
      { path: `/login`, component: './User/Login' },
      {
        path: '/',
        component: './Base',
        routes: [
          {
            path: '/',
            redirect: `/home?timestamp=${getTimestamp}`,
          },
          {
            path: '/home',
            name: 'home',
            component: './Home',
          },
          {
            path: '/customer-list',
            name: 'customer-list',
            component: './Customer/CustomerList',
          },
          {
            path: '/change-status',
            name: 'change-status',
            component: './Customer/ChangeStatus',
          },
          {
            path: '/customer-add',
            name: 'customer-add',
            component: './Customer/AddCustomer',
          },
          {
            path: '/customer-detail',
            name: 'customer-detail',
            component: './Customer/CustomerDetail',
          },
          {
            path: '/detail-classification',
            name: 'detail-classification',
            component: './Customer/CustomerDetailClassification',
          },
          {
            path: '/status-detail',
            name: 'status-detail',
            component: './Customer/StatusDetail',
          },
          {
            path: '/static',
            name: 'static',
            component: './DataStatistics/dataStatistics',
          },
          {
            path: '/user-list',
            name: 'user-list',
            component: './UserManager/userManager',
          },
          {
            path: '/user-change',
            name: 'user-change',
            component: './UserManager/userInfoChange',
          },
        ],
      },
    ],
  },
];
