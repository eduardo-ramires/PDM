const routes = [
   {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Página inicial
      { path: '', component: () => import('pages/IndexPage.vue') },
    ]
  },{
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
