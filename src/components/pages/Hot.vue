
<template>
	<div id="live-list">
		<!-- <top-nav class="nav-list-div" @select="navSelect"></top-nav> -->
		<scroll class="scroll-div"
			:options="scrollOptions"
			@pullingUp="scrollPullingUp"
			@pullingDown="scrollPullingDown"
			>
			<router-link
                :to="{name: 'live', query: {u: item.user_id, l: item.id, ch: ch }}"
                class="live-item"
                v-for="(item, key) in listData" :key="key"
                >
				<div class="item-top">
                    <div class="left">
                        <img class="avatar" :src="item.cover_path + '!S1'" alt="">
                        <div class="nick-name-div">
                            <div class="name-zbLevel">
                                <span class="nickname">{{item.user_nickname}}</span>
                                <img class="zbLevel" :src="'../../../static/images/zhubo_level/pic_zhubo_lv'+ item.zbLevel +'@2x.png'" alt="">
                            </div>
                            <div class="area">{{item.user_area_name}}</div>
                        </div>
                    </div>
                    <div class="right">
                        <p class="exp-num">{{item.on_line_num}}人</p>
                        <!-- <p class="exp-title">魅力</p> -->
                    </div>
                </div>
                <div class="item-mid" :style="{background: 'url('+ item.cover_path +'!S4) no-repeat center'}">
                    <img v-if="item.status == 1" class="live-status" src="../../../static/images/common/pic_zhibozhong@2x.png" alt="直播中">
                </div>
                <div class="item-bottom">
                    <div class="tag" v-for="(v , i) in item.live_room_tags" :key="i" >{{v.name}}</div>
                    <p class="theme">{{item.live_room_theme}}</p>
                </div>
			</router-link>
		</scroll>
		<loading v-if="loading" class="loading-div"></loading>
	</div>
</template>

<script>
// const loading = () => import('@/components/components/Loading')
import loading from '@/components/components/Loading';
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
			pageSize: 5,
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

		.loading-div{
			height: 100vh;
		}

		.live-item{
            $p20px: torem(20px);
            width: 100vw;
            text-decoration: none;
            margin-bottom: torem(6px);
            background-color: #fff;

            .item-top{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: torem(120px);
                box-sizing: border-box;
                padding: 0 $p20px;

                .left{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .avatar{
                        $wh: torem(90px);
                        @include eqWH($wh);
                        border-radius: $wh / 2;
                    }

                    .nick-name-div{
                        margin-left: $p20px;
                        .name-zbLevel{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            line-height: 100%;
                            margin-bottom: torem(20px);

                            .nickname{
                                font-size: torem(32px);
                                color: #000;


                            }

                            .zbLevel{
                                width: torem(66px);
                                height: torem(30px);
                                margin-left: torem(10px);
                            }
                        }

                        .area{
                            display: flex;
                            align-items: center;
                            font-size: torem(24px);
                            color: #aaa;
                            line-height: 100%;

                            &::before {
                                content: '';
                                display: inline-block;
                                width: torem(18px);
                                height: torem(22px);
                                background: url('../../../static/images/common/btn_dingwei_s@2x.png') no-repeat center;
                                background-size: 100%;
                                margin-right: torem(10px);
                            }
                        }

                    }
                }

                .right{
                    .exp-num{
                        font-size: torem(34px);
                        color: #ffa800;
                    }
                }


            }
            .item-mid{
                position: relative;
                width: 100vw;
                height: torem(700px);
                background-size: cover !important;
                background-position: center !important;

                .live-status{
                    $top: torem(20px);
                    position: absolute;
                    top: $top;
                    right: $top;
                    width: torem(116px);
                    height: torem(42px);
			    }

            }

            .item-bottom{
                display: flex;
                box-sizing: border-box;
                padding: 0 $p20px;
                align-items: center;
                height: torem(80px);

                .tag{
                    $h: torem(40px);
                    display: flex;
                    align-items: center;
                    height: $h;
                    background-color: #f7f7f7;
                    color: #989898;
                    font-size: torem(22px);
                    border-radius: $h / 2;
                    padding: 0 torem(20px);
                    // padding: torem(20px) torem(20px);
                }

                .theme{
                    margin-left: torem(20px);
                    font-size: torem(24px);
                    color: #989898;
                }
            }
		}
	}

</style>
