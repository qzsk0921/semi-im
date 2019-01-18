<template>
	<div id="live-list">
		<!-- <top-nav class="nav-list-div" @select="navSelect"></top-nav> -->
		<scroll class="scroll-div"
			:options="scrollOptions"
			@pullingUp="scrollPullingUp"
			@pullingDown="scrollPullingDown"
			>
			<router-link class="live-item-wrap"  :to="{name: 'live', query: {u: item.user_id, l: item.id, ch: ch}}"  v-for="(item, key) in listData" :key="key" >
				<!-- <img v-if="item.status == 1" class="live-status" src="../../../static/images/common/pic_zhibozhong@2x.png" alt="直播中"> -->
				<!-- <div class="live-item-top" v-if="item.recommendText">
					<div class="tag hot">{{item.recommendText}}</div>
				</div> -->
				<div class="live-item" :style="{background: 'url('+ item.cover_path +'!S2) no-repeat center'}">
					<div class="live-item-bottom">
						<img class="zbLevel" :src="'../../../static/images/zhubo_level/pic_zhubo_lv'+ item.zbLevel +'@2x.png'" alt="">
						<span class="user-name">{{item.live_room_theme}}</span>
						<!-- <span class="online-num">{{item.on_line_num}}</span> -->
					</div>
				</div>
				<div class="footer-div">
					<span class="distance">{{item.distance}} · {{item.on_line_num}}人</span>
				</div>

			</router-link>
		</scroll>
		<loading v-if="loading" class="loading-div"></loading>
	</div>
</template>
<script>
const loading = () => import('@/components/components/Loading')
const topNav = () => import('@/components/components/TopNav')
// const scroll = () => import('@/components/components/Scroll')
import scroll from '@/components/components/Scroll'
export default {
	name: "liveList",
	props: ["options"],
	components: { loading, topNav, scroll},
	data: function() {
		return {
			loading: true,
			listData: [],
			concatList: [],
			scrollOptions: {
				refresh: false
			},
			page: 1,
			pageSize: 10,
			canFetch: true,
			requestUri: '',
            liveRoomClass: '',
            ch: this.$common.getCh()
		}
	},
	created: function () {
        this.navSelect(this.options)
	},
    watch: {
        '$route' (to, from) {
            this.navSelect(this.options)
        }
    },
	methods: {
		navSelect: function (v) {
			this.liveRoomClass = v.live_room_class_name
			this.requestUri =  v.request_uri;
			this.liveRoomClass = (v.request_uri.split('/')[3] == 'nearby') ? '' : '&live_room_class=' + v.live_room_class
			this.loading = true;
			this.scrollPullingDown();
		},
		scrollPullingUp: function () {
			this.page = this.page + 1;
			this.fetchData(this.page , 'pullingUp')
		},
		scrollPullingDown: function () {
			this.page = 1;
			this.fetchData(this.page, 'pullingDown')
		},
		fetchData (page, pullingType) {
			if (!this.canFetch) {
				return;
			}
			this.canFetch = false;

			this.$http.get(this.requestUri + '?page=' + page + '&pageSize=' + this.pageSize + this.liveRoomClass)
				.then((res) => {
					let data = res.data.data
					if (res.data.result != 0) {
						this.listData = (pullingType == 'pullingUp') ? this.listData.concat(data['list']) : this.listData = data['list'];
						this.loading = false
					}
					this.canFetch = true;
					this.scrollOptions.refresh = true;

				})
		}
	}
};
</script>

<style lang="scss" scoped>
 	@import "../../assets/scss/function";

	#live-list{
		position: absolute;
		top: 0;
		left: 0;
		bottom: torem(98px);
		width: 100%;

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

		.scroll-div{
			position: absolute;
			// top: torem(98px);
			left: 0;
			box-sizing: border-box;
			padding: 0 torem(10px);
			// margin-top: torem(10px);
		}

		.loading-div{
			height: 100vh;
		}

		.live-item-wrap{

			// display: flex;
			// justify-content: space-between;
			text-decoration: none;
		}

		.live-item{
			position: relative;
			@include eqWH(torem(360px));
			margin-bottom: torem(4px);
			background-size: cover !important;
			border-radius: torem(10px);

			.live-status{
				$top: torem(20px);
				position: absolute;
				top: $top;
				right: $top;
				width: torem(116px);
				height: torem(42px);
			}

			.live-item-top{
				position: absolute;
				top: 0;
				left: 0;

				.tag{
					$tagH: torem(42px);
					display: flex;
					justify-content: center;
					align-items: center;
					width: auto;
					height: torem(42px);
					font-size: torem(22px);
					color: #fff;
					margin-top: torem(20px);
					padding: 0 torem(20px);
					border-bottom-right-radius: $tagH / 2;
					border-top-right-radius: $tagH / 2;
				}

				.hot{
					background: linear-gradient(left,#5531FF ,#C728FF);
				}

				.local{
					background: linear-gradient(left,#FA6B2A ,#FF9E16);
				}
			}
			.live-item-bottom{
				box-sizing: border-box;
				display:flex;
				// justify-content: space-between;
				align-items: center;
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				padding: torem(10px) torem(10px) ;
				// background: -webkit-gradient(linear,50% 50%,100% 50%,from(#ace),to(#f96));///linear-gradient( top,rgba($color: #fff, .2),#ccc);
				background: linear-gradient(top, rgba(255, 255, 255, 0),rgba(45, 45, 45, .5));
				text-shadow: 0 0 torem(10px) rgba(0, 0, 0, 1);
				border-radius: 0 0 torem(10px) torem(10px);

 				.zbLevel{
					width: torem(66px);
					height: torem(30px);
					margin-right: torem(10px);
				}

				.user-name{
					font-size: torem(24px);
					color: #fff;
				}

				.online-num{
					@extend .user-name;
				}
			}
		}

		.footer-div{
			display: flex;
			align-items: center;
			height: torem(70px);
			box-sizing: border-box;
			padding: 0 torem(10px);
			.distance{
				font-size: torem(24px);
				color: #aaa;
			}
		}
	}

</style>
