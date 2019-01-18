<template>
  <div id="top-nav">
	<template>
		<swiper :options="swiperOption">
			<swiper-slide>
                <router-link
                class="nav-item-a"
                :to="{name: 'live-hot', query: {'ch': ch} }"
                active-class="nav-active">热门
                </router-link>
            </swiper-slide>
			<swiper-slide>
                <router-link
                class="nav-item-a"
                :to="{name: 'live-focus', query: {'ch': ch}}"
                active-class="nav-active">推荐
                </router-link>
            </swiper-slide>
			<swiper-slide>
                <router-link
                class="nav-item-a"
                :to="{name: 'live-nearby', query: {'ch': ch}}"
                active-class="nav-active">附近
                </router-link>
            </swiper-slide>
			<swiper-slide>
                <router-link
                class="nav-item-a"
                :to="{name: 'live-blonde', query: {'ch': ch}}"
                active-class="nav-active">颜值
                </router-link>
            </swiper-slide>
			<swiper-slide>
                <router-link
                class="nav-item-a"
                :to="{name: 'live-song-dance', query: {'ch': ch}}"
                active-class="nav-active">歌舞
                </router-link>
            </swiper-slide>
			<swiper-slide>
                <router-link
                class="nav-item-a"
                :to="{name: 'live-talk-show', query: {'ch': ch}}"
                active-class="nav-active">脱口秀
                </router-link>
            </swiper-slide>
		</swiper>
	</template>
  </div>
</template>

<script>
    export default {
      	name: "topNav",
		data: function () {
			return {
				swiperOption: {
					slidesPerView: 5.5,
					paginationClickable: true,
					// spaceBetween: 30,
					freeMode: true
				},
				navList: [],
                selected: '',
                ch: this.$common.getCh()
			}
		},
		created: function () {
            // this.$router.replace({name: 'live-focus', query: {ch: this.$common.getCh() }})
		},
		methods: {

		}

    }
</script>

<style lang="scss" scoped>
	@import '../../assets/scss/function';
	#top-nav{
		background-color: #fff;
		.swiper-container {
			display: flex;
			justify-content: center;
			align-items: center;
            width: 100%;
            height: torem(88px);
            // margin: 20px auto;
        }
        .swiper-slide {
			display: flex;
			justify-content: center;
			align-items: center;
            position: relative;

            // width: torem(300px) !important;

			.nav-item-a{
				// box-sizing: border-box;
				position: relative;
				text-decoration: none;
				font-size: torem(30px);
				color: #aaa;
				padding: 0 torem(5px);


			}

			.nav-active{
				$undercolor: #000;
				color: $undercolor;
				transition: all .2s;

				&::before{
					content: '';
					display: inline-block;
					position: absolute;
					left: 50%;
					bottom: torem(-12px);
					transform: translate3d(-50%, 0, 0);
					width: 100%;
					height: torem(3px);
					background-color: $undercolor;
					transition: all .2s;
				}
			}
        }
	}
</style>
