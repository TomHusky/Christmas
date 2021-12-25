export default [
  {
    path: "/",
    component: () => import('@/page/index/index.vue'),
  },
  {
    path: "/headimg",
    component: () => import('@/page/headimg.vue'),
  },
]