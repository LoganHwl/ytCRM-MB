export default [
  // user
  {
    path: '/',
    component: './index',
    // redirect: '/home',
    routes: [
      // { path: '/', redirect: '/login' },
      { path: '/login', component: './User/Login' },
      {
        path: '/',
        component: './Base',
        routes: [
          {
            path: '/',
            redirect: '/home',
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
            path: '/customer-add',
            name: 'customer-add',
            component: './Customer/AddCustomer',
          },
          {
            path: '/status-detail',
            name: 'status-detail',
            component: './Customer/StatusDetail',
          },
        ],
      },
    ],
  },
];
