<template>
	<div id="live-list-div">
		<top-nav class="nav-list-div" @select="navSelect"></top-nav>
		<div class="list-main">
			<keep-alive>
				<router-view v-if="navDate" :options="navDate"></router-view>
			</keep-alive>
		</div>

		<login-dailog v-if="showLoginDailog" style="position: fixed; top:0; left: 0;width: 100%; height: 100%;"  @close="showLoginDailog = false" @confirm="loginDailogcConfirm"></login-dailog>

	</div>
</template>
<script>
const loading = () => import('@/components/components/Loading')
const topNav = () => import('@/components/components/TopNav')
const loginDailog = () => import('@/components/components/LoginDailog')

const scroll = () => import('@/components/components/Scroll')
// import scroll from '@/components/components/Scroll'
export default {
	name: "liveList",
	// props: ["listData"],
	components: { loading, topNav, scroll, loginDailog},
	data: function() {
		return {
			loading: true,
			listData: [],
			concatList: [],
			canFetch: true,
			navDate: null,
			liveRoomClassName: null,
			showLoginDailog: false,
         	// guestLogin: ,
		}
	},
    beforeRouteEnter (to, from, next) {
        console.log(to)
        next(vm => {
			vm.$router.replace({name: (to.name == 'live-list' ) ? 'live-focus' : to.name , query: {ch: vm.$common.getCh()}})
        })
    },
	beforeRouteLeave (to, from, next) {
		if (this.$common.isGuestLogin()) {
			if (this.$common.getLocalStorage('guestLogin') == 'true' && (to.name == 'my-zone' || to.name == 'focus-list')) {
				this.showLoginDailog = true;
				return false;
			}
		} else {
			next()
		}

		next();
	},
	created: function () {
		// console.log(this.$route)
		this.navSelect(this.$route.name)
	},
	watch: {
		'$route': function (n, o) {
			this.navSelect(n.name)
		}
	},
	methods: {
		// 登录提示框
        loginDailogcConfirm: function () {
            let url = encodeURIComponent('https://mapp.quhepai.com/?#/?ch=' + this.$common.getLocalStorage('ch'));
            window.location.href = 'https://quhepai.com/sso/login?appid=hp29e0943260f1e28b&redirect_uri=' + url;
        },
		navSelect: function (v) {
			let liveRoomClassName,
			requestUri = '/live/live/hot';
			switch (v) {
				case 'live-hot' :
					liveRoomClassName = 0;
					break;
				case 'live-focus' :
					liveRoomClassName = -2;
					requestUri = '/live/live/focus'
					break;
				case 'live-nearby' :
					liveRoomClassName = -1;
					requestUri = '/live/live/nearby'
					break;
				case 'live-blonde' :
					liveRoomClassName = 10016;
					break;
				case 'live-song-dance' :
					liveRoomClassName = 10018;
					break;
				case 'live-talk-show' :
					liveRoomClassName = 10034;
					break;

			}

			this.navDate = {
				live_room_class: liveRoomClassName,
				request_uri: requestUri
			};
			// console.log(this.navDate)
		}
	}
};
</script>

<style lang="scss" scoped>
 	@import "../../assets/scss/function";

	#live-list-div{
		position: absolute;
		top: 0;
		left: 0;
		bottom: torem(98px);
		width: 100%;
		height: 100%;

		.nav-list-div{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 1;
			border-bottom: 1px solid #eee;
        	box-shadow: 0 torem(5px) torem(20px) #eee;
			background-color: #fff;
		}

		.list-main{
			position: absolute;
			top: torem(98px);
			left: 0;
			bottom: torem(98px);
			width: 100%;
			height: 100%;
			// margin-top: torem(10px);
		}

		.loading-div{
			height: 100vh;
		}

	}

</style>
