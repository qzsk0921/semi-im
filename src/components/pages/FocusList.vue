<template>
    <div id="focus-list-div">
		<div class="my-focus" v-if="!empty">我关注的</div>
        <div class="wrapper" ref="wrapper" v-if="!empty">
			<div class="content" ref="list">
				<a @click="goLiveRoom(item)" class="live-item" v-for="(item, key) in otherList" :key="key" :style="{background: 'url('+ item.user_avatar +'!S2) no-repeat center'}">
					<img v-if="item.status == 1" class="live-status" src="../../../static/images/common/pic_zhibozhong@2x.png" alt="直播中">
					<div class="live-item-bottom">
						<span class="user-name">{{item.nickname}}</span>
						<span class="online-num">{{item.on_line_num}}</span>
					</div>
				</a>
			</div>
		</div>
		<div class="empty-div" v-else>
			<p>还没有关注的主播哦, <router-link  :to="{name: 'live-list'}" class="go-live-list">去首页逛逛吧</router-link></p>
		</div>

		<!-- 打开合拍 -->
        <open-app-dailog
            @close="showOpenAppDailog=false"
            @cancelFocus="cancelFocus()"
            @focus="focusAnchor()"
            v-if="showOpenAppDailog"
            :options="openAppDailogOptiions">
        </open-app-dailog>

		<loading v-if="loading"></loading>
    </div>
</template>
<script>
const loading = () => import ('@/components/components/Loading')
const openAppDailog = () => import ('@/components/components/OpenAppDailog')
import BScroll from "better-scroll"

export default {
  name: "focusList",
  props: ["listData"],
  components: { loading, openAppDailog},
  data: function() {
    return {
		otherList: [],
		isPullUp: false,
		page: 0,
		canFeach: true,
		empty: false,
		loading: true,
		showOpenAppDailog: false,
		openAppDailogOptiions: '',
		liveUserId: null,
		userId: null
    }
  },
  watch: {
	  otherList(o, n){
		  if (n.length > 0) {
			  this.$nextTick(() => {
				  this.scroll.refresh()
			  })
		  }
	  }
  },
  created: function () {
	this.fetchData()

  },
  mounted: function () {

  },
  methods: {
	// 取消关注
	cancelFocus: function () {
		this.$http({
			url: '/live/live/cancel-focus-user',
			method: 'post',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'focus_user_id=' + this.userId + '&by_user_id=' + this.liveUserId
		})
		.then(res => {
			if (res.data.result == 1) {
				this.openAppDailogOptiions.has_attend = 0;
			}

		})
	},
	// showOpenAppDailog
	showOpenAppDailogFn: function (liveLoomId, targetUserId) {
		this.$http({
				url: '/live/live/user-info?',
				method: 'post',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: 'source=0' + '&live_room_id=' + liveLoomId + '&target_user_id=' + targetUserId
			})
			.then(res => {
				if (res.data.result == 1) {
					this.openAppDailogOptiions = res.data.data;
					this.showOpenAppDailog = true;
				}

			})
	},
	// 关注主播
	focusAnchor: function () {
		let byUserId = this.liveUserId;     // 被关注者ID
		let focusUserId = this.userId;                   // 关注者ID
		if (!byUserId || !focusUserId) {
			return;
		}
		this.$http({
			url: '/live/live/focus-user',
			method: 'post',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'focus_user_id=' + focusUserId + '&by_user_id=' + byUserId
		})
		.then((res) => {
			if (res.data.result == 1) {
				this.openAppDailogOptiions.has_attend = 1;
			}
		})
	},
	goLiveRoom: function (v) {
		if (v.status == 1) {
			this.$router.push({name: 'live', query: {u: v.user_id, l: v.live_room_id, ch: this.$common.getCh() }})
		} else {
			// console.log(v)
			this.liveUserId = v.user_id;
			this.userId = this.$common.getLocalStorage('user_id');
			this.showOpenAppDailogFn(v.live_room_id, v.user_id);
			return;
		}
	},
    initScroll () {    // 初始化 betterscroll
		if (!this.$refs.wrapper) {
			return;
		}

		this.scroll = new BScroll(this.$refs.wrapper, {
			click: true,
			// tap: true,
			pullUpLoad: {
				threshold: -10
			},
			// pullDownRefresh: {
			// 	threshold: 40,
			// 	stop: 80
			// }
		})

		// 监听 上拉事件
		this.scroll.on('pullingUp', () => {
			this.isPullUp = true;
			this.fetchData()
		})

    },
	fetchData () {  // 获取直播列表
		// if (!this.canFeach) {
		// 	return;
	    // }
	  this.page = this.page + 1;
	//   /live/live/focus?page
      this.$http.get('/live/live/focus-list?page=' + this.page)
        .then((res) => {
			// console.log(res.data.data)
			let data = res.data.data
			if (res.data.result != 0) {
				if (data['list'].length != 0) {
					this.otherList = this.otherList.concat(data['list'])
					if (!this.scroll ) {
						this.$nextTick(() => {
							this.initScroll()
						})
					} else {
						this.isPullUp = false;
					//   this.canFeach = false;
						this.scroll.finishPullUp();
					}

				}

			} else {
				this.empty = true;

			}

			this.loading = false;

        })
	}
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/scss/function";

@mixin live-item ($itemW, $itemH, $headerH, $aW) {
  width: $itemW;
  height: $itemH;

  .header-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $headerH;

    .header-left {
      display: flex;
      justify-content: center;
      align-items: center;

      .avatar-icon {
        @include eqWH($aW);
        border-radius: 50%;
      }
    }
  }
}

#focus-list-div{
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 100vw;
	overflow: hidden;
	background-color: #f5f5f5;

	// .loading{
	// 	height: 10vh;
	// 	width: 100%;
	// 	background-color: #000;
	// 	margin-bottom: 10vh;
	// 	transition: all;
	// }

	.empty-div{
		text-align: center;
		font-size: torem(34px);
		margin: torem(300px) auto 0;
		p{
			color: #989898;
		}

		.go-live-list{
			color: #4a88cc;
			text-decoration: none;
		}
	}

	.my-focus{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: torem(70px);
		padding-left: torem(20px);
		font-size: torem(26px);
		color: #858585;
		background-color: #f5f5f5;
	}
	.wrapper {
  		height: 100vh;
			background-color: #fff;
			box-sizing: border-box;
			padding-top: torem(10px);
		.content{
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;

			.live-item{
				position: relative;
				@include eqWH(torem(237px));
				border-radius: torem(10px);
				margin-bottom: torem(10px);
				background-size: cover !important;
				margin-left: torem(10px);

				.live-status{
						$top: torem(20px);
						position: absolute;
						top: $top;
						right: $top;
						width: torem(116px);
						height: torem(42px);
				}

				.live-item-bottom{
					box-sizing: border-box;
					display:flex;
					justify-content: space-between;
					align-items: center;
					position: absolute;
					left: 0;
					bottom: 0;
					width: 100%;
					padding: torem(13px) torem(20px) ;
					// background: -webkit-gradient(linear,50% 50%,100% 50%,from(#ace),to(#f96));///linear-gradient( top,rgba($color: #fff, .2),#ccc);
					background: linear-gradient(top, rgba(255, 255, 255, 0),rgba(45, 45, 45, .5));
					text-shadow: 0 0 torem(10px) rgba(0, 0, 0, 1);

					.user-name{
						font-size: torem(22px);
						color: #fff;
					}

					.online-num{
						@extend .user-name;
					}
				}
			}
		}


	}
}
</style>
