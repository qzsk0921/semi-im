<template>
    <div class="list-wrapper" ref="wrapper">
        <div class="content" ref="list">
            <slot></slot>
        </div>
        <div v-if="isPullDown" class="pullup-loading">
            <img class="pullDown-loading-icon"  src="../../assets/images/loading.gif" alt="">
        </div>
        <!-- <loading v-if="loading" class="loading-div"></loading> -->
    </div>
</template>
<script>
import BScroll from "better-scroll";
// import loading from '@/components/components/Loading'
export default {
  name: "scroll",
  props: ["options"],
  components: {},
  data: function() {
    return {
	  isPullDown: false,
      canFeach: true,
      soltName: this.options.soltName
    }
  },
  watch: {
    'options.refresh': function (n, o){
        if (n) {
             this.$nextTick(() => {
                this.scroll.refresh()

            })
            this.isPullDown = false;
            this.options.refresh = false;
            this.scroll.finishPullUp();
            this.scroll.finishPullDown()
            this.canFeach = true;

        }

    }
  },
  created: function () {
    // this.fetchData(this.page, 'pullingDown')
  },
  mounted: function () {
      this.initScroll();
  },
  methods: {
    initScroll () {    // 初始化 betterscroll
		if (!this.$refs.wrapper) {
			return;
		}

		this.scroll = new BScroll(this.$refs.wrapper, {
			startY: 0,
			click: true,
			tap: true,
			pullUpLoad: {
				threshold: 0,
				moreTxt: 'load more',
				noMoreTxt: 'There is no more data'
			},
			pullDownRefresh: {
				threshold: 90,
				stop: 60
			}
		})

		// 监听 上拉加载事件
		this.scroll.on('pullingUp', () => {
            if (!this.canFeach ) {
                return;
            }
            this.canFeach = false;
			this.$emit('pullingUp')
		})

		// 监听 下拉刷新事件
		this.scroll.on('pullingDown', () => {
            if (!this.canFeach ) {
                return;
            }
            this.isPullDown = true;
            this.canFeach = false;
            this.$emit('pullingDown')
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

	.list-wrapper {
        position: relative;
        width: 100%;
        height: 100%;

		.pullup-loading{
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 60px;

			.pullDown-loading-icon{
				@include eqWH(50px);
			}
		}
		.content{
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

		}


	}



</style>
