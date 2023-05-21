export default [
  {
    path: '/',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/editor',
    component: () => import('@/pages/editor/index.vue'),
  },
  {
    path: 'shi',
    component: () => import('@/pages/shi/index.vue'),
  },
];
