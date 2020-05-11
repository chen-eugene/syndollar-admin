const routes = [
  {
    path: '/dishes',
    name: 'dishes',
    component: () => import('../view/dishes')
  }, {
    path: '/dishes/create',
    name: 'dishesCreate',
    component: () => import('../view/dishes/create')
  }
]

export default routes