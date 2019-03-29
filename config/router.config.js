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
        path: '/user',
        component: './User',
        hideInMenu: true,
      },
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
        ],
      },
    ],
  },
];
