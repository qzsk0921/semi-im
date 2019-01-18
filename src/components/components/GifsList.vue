<template>
    <div id="gifs-list-div" @click.stop.prevent>
        <div id="swiper-wrapper" >
                <!-- The ref attr used to find the swiper instance -->
            <template>
                <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper" >
                    <!-- slides -->
                    <swiper-slide v-for="(item , i) in gifsList" :key="i" class="swiper-gift-item">
                        <a href="javascript:void(0)" @click.stop.prevent="sendGif(item)">
                                    <!-- <div class="gif-item" :style="{background: 'url(' + item.thumb_url +'!s1) center no-repeat'}" @click.stop="sendGif(item)"></div> -->
                            <div class="gif-item" >
                                <img :src="item.thumb_url" width="100%" alt="">
                            </div>
                            <span class="gift-title">{{item.title}}</span>
                            <div class="gift-prise">{{item.price}} <img class="prise-icon" src="../../assets/images/live_money_small.png"></div>
                        </a>

                    </swiper-slide>
                    <div class="swiper-pagination"  slot="pagination"></div>
                </swiper>
            </template>
        </div>
        <div class="gif-list-bottom" @click.stop.prevent>
            <span class="balance">可用：{{conin}} <img class="prise-icon-big" src="../../assets/images/live_money_big.png"></span>
            <span class="rechange" @click.stop.prevent.self="recharge">充值</span>
        </div>

        <!-- loginDailog -->
        <login-dailog v-if="showLoginDailog" style="position: fixed; top:0; left: 0;width: 100%; height: 100%;"  @close="showLoginDailog = false" @confirm="loginDailogcConfirm"></login-dailog>
    </div>
</template>
<script>
import eventBus from '@/assets/js/bus';
const loginDailog = () => import('@/components/components/LoginDailog')

export default {
  name: 'gifsList',
  props:['giftData'],
  components: {loginDailog},
  data: function () {
      return {
          notNextTick: true,
          gifsList: [],
          emitDate: [],
          conin: 0,
          showLoginDailog: false,
          isLogin: this.$common.chekLogin(),
          swiperOption: {
            direction: 'horizontal',    // Slides的滑动方向
            grabCursor: true,
            setWrapperSize: true,
            init: false,
            autoHeight: true,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            slidesPerColumn : 2,
            slidesPerColumnFill : 'row',
            slidesPerView : 4,//'auto'
            slidesPerGroup : 4,
            mousewheelControl: true,
            observeParents: true,
            debugger: true,
            lazy: {
                loadPrevNext: true,
                loadPrevNextAmount: 1
            },
            // pagination:{
            //     el: '.swiper-pagination',
            //     bulletActiveClass: 'bullet-active',
            // },
            onTransitionStart (swiper) {
                // console.log(swiper)
            }
          }
      }
  },
  computed: {
    swiper() {
        return this.$refs.mySwiper.swiper
    }
  },
  beforeCreate: function () {},
  created: function () {
    // 获取用户信息
    this.getUserInfoData();

    // 订阅充值成功更新播币通知
    eventBus.$on('changeCoin', res => {
        this.changeCoin();
    })
  },
  mounted() {
    //   this.swiper.slideTo(3, 1000, false)
  },
  destroyed: function () {
      eventBus.$off('changeCoin')
  },
  watch:  {
    'giftData.gifsList': function (n, o) {
        if (n) {
            this.gifsList = this.giftData.gifsList
        }
    },
    'giftData.show': function (n, o) {
        if (n) {
            this.swiper.init();
            this.$nextTick(() => {
                this.gifsList = this.giftData.gifsList
            })
        }

    }
  },
  methods: {
      // 登录提示框
        loginDailogcConfirm: function () {
            let url = encodeURIComponent('https://mapp.quhepai.com/?#/?ch=' + this.$common.getLocalStorage('ch'));
            window.location.href = 'https://quhepai.com/sso/login?appid=hp29e0943260f1e28b&redirect_uri=' + url;
        },
      // 更新播币
      changeCoin: function () {
          this.$http.get('/video/short-video/coin')
            .then(res => {
                if (res.data.result == 1) {
                    this.conin = parseInt(res.data.data);
                } else {
                    console.log(res.data.msg)
                }
            })
      },
      // 充值
      recharge: function () {

        if (this.$common.browserType() == 'weixin') {
            this.$emit('recharge', {rechargeShow: true})
            return false;
        } else {
            let sch = this.$common.getLocalStorage('ch')
            let ch =  (sch == 'null' || sch == 'undefined') ? 'H5_s_000' : sch
            location.href = 'https://api2.quhepai.com/webview/live/goods?os=Android&user_id='+ this.$common.getLocalStorage('user_id') +'&token=' + this.$common.getLocalStorage('token') + '&ch=' + ch
        }

      },
      // 用户信息
      getUserInfoData: function () {
          let _this = this;
          this.$http({
            method: 'post',
            url: '/live/live/user-info',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'live_room_id=' + _this.giftData.liveroomId + '&chat_room_id=' + _this.giftData.chatroomId + '&target_user_id=' + this.$common.getLocalStorage('user_id') + '&source=0'

          }).then((res) => {
              if (1 == res.data.result) {
                  this.conin = parseInt(res.data.data.hp_coin)
                  this.$common.setLocalStorage('level', res.data.data.level)
              } else {
                  console.log(res.data.msg)
              }
          })
      },
      // 送礼物
      sendGif (data) {
        //   alert(1)
          // eventBus.$emit('sendGif', data); return;    // 测试送礼
          if(this.conin <= 0 || this.conin < parseInt(data.price)){
                var cm = confirm('哎呀,您的播币余额不足，请前往充值？')
                if (cm == true){
                    this.recharge();
                }
                return false;
          }
          let _this = this;
          let giftNum = 1;
          this.$http({
            method: 'post',
            url: '/live/live/gift-send',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'live_room_id=' + _this.giftData.liveroomId + '&chat_room_id=' + _this.giftData.chatroomId + '&gift_id=' + data.id + '&gift_num=' + giftNum

          })
          .then((res) => {
              if (res.data.result == 1) {
                  this.conin = this.conin - parseInt(data.price);
                  eventBus.$emit('sendGif', data);
              } else {
                //   eventBus.$emit('sendGif', data);
                //   alert(res.data.msg);
                  console.log(res.data.msg)
              }
          })
      }
  }
}
</script>
<style lang="scss" scoped>
     @import "../../assets/scss/function";



    #gifs-list-div, #swiper-wrapper{
        width: 100vw;
        height: torem(450px);
        background-color: rgba(0, 0, 0, .5);

        .swiper-container{
            height: 100%;

            .swiper-wrapper{
                height: 100% !important;
            }

        }

        .swiper-pagination /deep/ .swiper-pagination-bullet-active{
            background: #a3a2a2 !important;
        }


        .swiper-pagination /deep/ .swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets{
            bottom: 0 !important;
        }


        .swiper-gift-item{
            text-align: center;
            width: torem(187px);
            height: torem(180px);
            margin-top: torem(15px);
            margin-bottom: torem(20px);
            text-shadow: 0 0 torem(2px) rgba( 0, 0, 0, 1);

            &>a{
                text-decoration: none;
            }
        }

        .gif-item{
            display: flex;
            justify-content: center;
            align-items: center;
            width: torem(100px);
            height: torem(100px);
            margin: 0 auto;
            background-size: 100% !important;
        }

        .gift-title{
            display: inline-block;
            color: #fff;
            font-size: torem(26px);
            margin: torem(8px) 0 torem(10px);
            text-shadow: 0 0 torem(2px) rgba( 0, 0, 0, 1);
        }

        .gift-prise{
            display:flex;
            align-items: center;
            justify-content: center;
            font-size: torem(22px);
            color: #c3c3c3;

            .prise-icon{
                $w: torem(20px);
                width: $w;
                height: $w;
                margin-left: torem(5px);
            }
        }

        .gif-list-bottom{
            box-sizing: border-box;
            padding: 0 torem(34px);
            display: flex;
            height: torem(98px);
            justify-content: space-between;
            align-items: center;
            background-color: rgba(0, 0, 0, .5);

            .balance{
                color: #fff;
                font-size: torem(28px);

                .prise-icon-big{
                    $w: torem(24px);
                    @include eqWH($w);
                }
            }
            .rechange{
                $w: torem(90px);
                display: flex;
                justify-content: center;
                align-items: center;
                width: $w;
                height: torem(40px);
                border-radius: $w / 2;
                border: 2px solid #ffa800;
                color: #ffa800;
                font-size: torem(26px);
            }
        }
    }



</style>


