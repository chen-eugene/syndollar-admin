const routes = [
    {
        path: '/dishes',
        name: 'dishes',
        component: () => import('../view/dishes')
    }, {
        path: '/dishes/create',
        name: 'dishesCreate',
        component: () => import('../view/dishes/create')
    }, {
        path: '/category/create',
        name: 'categoryCreate',
        component: () => import('../view/category/create')
    }, {
        path: '/category',
        name: 'category',
        component: () => import('../view/category')
    }
]

export default routes
