import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import Index from '@/components/Index'

const Index = () => import('@/components/pages/Index')
const LiveRoom = () => import('@/components/pages/LiveRoom')
const Recharge = () => import('@/components/components/Recharge')
// const Auth = () => import('@/components/pages/Auth')
const LiveList = () => import('@/components/pages/LiveList')
const FocusList = () => import('@/components/pages/FocusList')
const MyZone = () => import('@/components/pages/MyZone')
const Hot = () => import('@/components/pages/Hot')
const Focus = () => import('@/components/pages/Focus')
const NearBy = () => import('@/components/pages/NearBy')

Vue.use(Router)

export default new Router({
	// mode: 'history',
	mode: 'hash',  
	routes: [
		// index
		{
			path: '/',    
			name: 'index',
			component: Index,
			redirect: {name: 'live-focus'},
			meta: { requiresAuth: true },
			children: [
				{
					path: '/live-list',
					name: 'live-list',
                    component: LiveList,
					meta: { requiresAuth: true },

					children:[
						{
							path: '/live-list/live-hot',
							name: 'live-hot',
							component: Hot,
							props: true,
							meta: { requiresAuth: true }
						},
						{
							path: '/live-list/live-focus',
							name: 'live-focus',
							component: Focus,
							props: true,
							meta: { requiresAuth: true },
						},
						{
							path: '/live-list/live-nearby',
							name: 'live-nearby',
							component: NearBy,
							props: true,
							meta: { requiresAuth: true },
						},
						{
							path: '/live-list/live-blonde',
							name: 'live-blonde',
							component: Hot,
							props: true,
							meta: { requiresAuth: true },
						},
						{
							path: '/live-list/live-song-dance',
							name: 'live-song-dance',
							component: Hot,
							props: true,
							meta: { requiresAuth: true },
						},
						{
							path: '/live-list/live-talk-show',
							name: 'live-talk-show',
							component: Hot,
							props: true,
							meta: { requiresAuth: true },
						}
					]
					
				},
				{
					path: '/focus-list',
					name: 'focus-list',
					meta: { requiresAuth: true },
					component: FocusList
				},
				{
					path: '/my-zone',
					name: 'my-zone',
					meta: { requiresAuth: true },
					component: MyZone
				}
			]
		},
		// 直播间
		{
			path: '/live',
			name: 'live',
			component: LiveRoom,
			props: true,
			meta: { requiresAuth: true }
		},
		// 充值
		{
			path: '/recharge',
			name: 'recharge',
			component: Recharge,
			title: '播币充值',
			meta: { requiresAuth: true }
		},
		// 授权
		// {
		// 	path: '/auth',
		// 	name: 'auth',
		// 	component: Auth
		// }
	],
		// scrollBehavior (to, from, savedPosition) {
		//   console.log(savedPosition)
		//     return { x: 0, y: 500 }
    //
    // }
})
