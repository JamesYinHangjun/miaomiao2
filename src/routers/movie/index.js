export default {
    path: '/movie',
    component: () => import('@/views/Movie'),
    children: [
        {
            path: 'city',
            component: () => import('@/components/City')
        },
        {
            path: 'nowPlaying',
            component: () => import('@/components/NowPlaying')
        },
        {
            path: 'comingSoon',
            component: () => import('@/components/ComingSoon')
        },
        {
            path: 'search',
            component: () => import('@/components/Search')
        },
        {
            path: 'detail/1/:movieId',
            components: {
                default: () => import('@/components/NowPlaying'),
                detail: () => import('@/views/Movie/detail')
            },
            props: {
                detail : true
            }
        },
        {
            path: 'detail/2/:movieId',
            components: {
                default: () => import('@/components/ComingSoon'),
                detail: () => import('@/views/Movie/detail')
            },
            props: {      //路由组件传参 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
                detail : true
            }
        },
        {
            path: '/movie',
            redirect: '/movie/nowPlaying'
        }
    ]
}
