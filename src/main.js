// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// require("babel-polyfill");
import Vue from 'vue'
import App from './App'
import router from './router'   // 路由对象
import axios from '@/assets/js/axios'       // 网络请求
import '@/assets/flexible'  // flexible.js
import common from '@/assets/js/common'
import FastClick from 'fastclick'



// swiper
require('swiper/dist/css/swiper.css')
import VueAwesomeSwiper from 'vue-awesome-swiper'

Vue.config.productionTip = false
Vue.use(VueAwesomeSwiper)
Vue.prototype.$http = axios

Vue.prototype.$common = common;

FastClick.attach(document.body);

// 全局导航钩子
router.beforeEach((to, from, next) => {
  // 判断该路由是否需要登录权限
  	if (to.meta.requiresAuth) {

		if (!common.chekLogin() || (common.chekLogin() && to.query.user_id && to.query.token)) {
			if (to.query.user_id && to.query.token) {
				localStorage.clear()
				// console.log(to.query.user_id , to.query.token)
				for (let k in to.query) {
					// console.log(to['query'][k])
					common.setLocalStorage(k, to['query'][k])
				}

				let inviteUserId = to.query.invite_user_id ? '&invite_user_id' + to.query.invite_user_id : ''

				axios.get('/user/token?user_id=' + to.query.user_id + '&token=' + to.query.token + '&ch=' + to.query.ch + inviteUserId)
					.then((res) => {
						if (res.data.result == 1) {
							let val,data = res.data.data;
							for (let k in data) {
								val = data[k];
								if (val != null) {
									if ('object' == typeof(val)) {
									    val = JSON.stringify(val)
									}
									common.setLocalStorage(k, val)
								}
							}
							common.setLocalStorage('isLogin', true);
							common.setLocalStorage('guestLogin', false);
							axios.get('/user/get-im-token')
							.then(res => {
								if (res.data.result == 1) {
									common.setLocalStorage('rongcloud_token', res.data.data.rongcloud_token)
									// console.log(res.data)
								} else {
									console.log(res.data.msg)
								}
							})

                            let queryParmsString = '';
                            for (let k in to.query) {
                                if ((k != 'token' && k != 'return_url' && k != '')) {
                                    queryParmsString += k + '=' + to.query[k] + '&'
                                }

                            }

                            next({
								path:  to.path + '?' + queryParmsString
                            })

						}
					})
			} else {
				if (common.getLocalStorage('guestLogin')  == 'true') {
					next()
				} else {
					axios.get('/user/guest-get-im-token?user_id=100001')
					.then(res => {
						if (res.data.result == 1) {
							let data = res.data.data
							common.setLocalStorage('guest_id', data.guest_id);
							common.setLocalStorage('netease_token', data.netease_token);
							common.setLocalStorage('rongcloud_token', data.rongcloud_token);
							common.setLocalStorage('guestLogin', true);
                            common.setLocalStorage('ch', to.query.ch);
							next({
                                name: to.name,  // 登录成功后跳转到该路由
                                query: to.query
							})
						} else {
							console.log(res.data.msg)
						}
					})
				}
			}
		} else {
			next()
		}

	} else {
		next();
	}
})


// 添加请求拦截
Vue.prototype.$http.interceptors.request.use(function (config) {
	let guestLogin = common.getLocalStorage('guestLogin'),
	ch = common.getLocalStorage('ch')

	if (guestLogin == 'true') {
		config.params['user_id'] = '100001';
		config.params['guest_id'] = common.getLocalStorage('guest_id');
	} else {
		// if (!config.params.token && !config.params.user_id) {
            config.params['token'] = common.getLocalStorage('token')
            config.params['user_id'] = common.getLocalStorage('user_id');
		// }

	}
	config.params['area_id'] = common.getLocalStorage('area_id');
	config.params['ch'] = (ch == null || ch == undefined || ch == 'null' || ch == 'undefined') ? 'H5_s_000' : ch;

	if (common.getLocalStorage('invite_user_id')) {
		config.params['invite_user_id'] = common.getLocalStorage('invite_user_id');
	}

	// console.log(config)
	return config;
}, function (error) {
  return Promise.reject(error);
})

// Vue.prototype.$http.interceptors.request.eject(myInterceptor);


// 响应拦截
Vue.prototype.$http.interceptors.response.use(function (response) {
	// console.log(response.data.result)
	// console.log((response.data.result == 10002) && common.getLocalStorage('token'));return false;
	if ((response.data.result == 10002)) {

		let url = encodeURIComponent('https://mapp.quhepai.com/?#/?ch=' + common.getLocalStorage('ch'));
        localStorage.clear()
		window.location.href = 'https://quhepai.com/sso/login?appid=hp29e0943260f1e28b&redirect_uri=' + url;
	}

    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
