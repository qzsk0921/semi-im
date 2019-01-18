<template>
	<div id="live-room" @click="closeGifsListFn">
        <!-- 播放层 -->
		<template >
            <video-player class="video-player-box"
                ref="videoPlayer"
                :options="playerOptions"
                :playsinline="true"
                @play="onPlayerPlay($event)"
                @pause="onPlayerPause($event)"
                @ended="onPlayerEnded($event)"
                @loadeddata="onPlayerLoadeddata($event)"
                @waiting="onPlayerWaiting($event)"
                @playing="onPlayerPlaying($event)"
                @timeupdate="onPlayerTimeupdate($event)"
                @canplay="onPlayerCanplay($event)"
                @canplaythrough="onPlayerCanplaythrough($event)"
                @ready="playerReadied"
                @statechanged="playerStateChanged($event)">
            </video-player>
        </template>

        <!-- 展示层 -->
        <div class="show-wrap-div">

            <!-- 礼物贡献榜单 -->
            <div class="live-top-div" :class="{'wecat': weChat}" v-if="giftsProps">
                <div class="contribution-div">
                    <div class="anchor-div">
                    <img class="anchor-avata" @click="showOpenAppDailogFn" :src="liveRoomDate.user_pic + '!S1'" alt="">
                    <div class="left">
                        <div class="nick-div">
                            <p class="user-nickname">{{liveRoomDate.user_nickname}}</p>
                            <p class="user-exp">魅力:{{giftsProps.owner_info.currZbExpStr}}</p>
                        </div>
                        <div v-if="!focus" class="follow-btn" @click.stop.prevent="focusAnchor">关注</div>
                    </div>
                    </div>
                    <gift-rank class="gift-rank-div" :giftRankData="giftsProps" v-if="giftsProps"></gift-rank>
                    <div class="live-num-count">
                        <img src="" alt="">
                        <span>{{giftsProps.total}}</span>
                    </div>
                </div>
                <span class="user-id-show-div">合拍ID：{{liveRoomDate.user_id}}</span>
            </div>

            <!-- 封面 -->
            <div v-if="!isPlaying" class="poster-div" :style="{background:'url('+ poster +'!S4) center no-repeat'}"></div>

            <!-- 底部聊天菜单  v-focus="{'isFocus': isFocus}" -->
            <div id="live-room-bottom-nav" v-show="!showGifList" @click.stop.prevent>
                <div class="chat-item" v-show="isFocus == false">
                    <div class="pre-edit-div" v-if="guestLogin == 'true'" @click.stop.prevent="bindPhoneMask"></div>
                    <div class="chat-input" ref="chatbtn" @click="editTextMsg">和主播聊天吧~</div>
                    <img class="mind-red-packet" @touchstart="openRedPacket" src="../../../static/images/common/btn_h5_live_hongbao.gif" alt="">
                    <div class="left">
                        <a href="javascript:void(0)" class="show-gif-btn" @touchstart.stop.prevent="showGifsListFn"></a>
                        <a class="close-live-room" @click.stop.prevent="closeLiveRoom" href="javascript:void(0)" ></a>
                    </div>
                </div>
                <div class="chat-item" :class="{'edit': isFocus == true, 'not-edit': isFocus == false}">
                  <input ref="inputele"  class="chat-input-edit" type="text" v-model="textMsgContent"  placeholder="和主播聊天吧~">
                  <a href="javascript:void(0)" class="send-textmsg-btn" @click.stop.prevent="sendTextMsg" >发送</a>
                </div>
            </div>



            <!-- 播放按钮 -->
            <img v-show="!isPlaying" @click.stop.prevent="play(player)" class="play-video-btn" src="../../assets/images/pic_play_white3@2x.png" alt="">

            <!-- 礼物展示 -->
            <show-gift class="show-gift-div" ></show-gift>

            <!-- 聊天室 @textMsgRes="closeGifsListFn($event)"-->

            <live-chat-msg class="live-chat-msg-div" @joinChatRoomRes="sendJoinTextMsg"  :chatProps="chatProps" v-show="(showLiveChatMsg)"></live-chat-msg>

            <!-- 礼物列表 -->
            <transition
            name="recharge"
            enter-active-class="slideInUp"
            leave-active-class="slideOutDown">
                <gifs-list class="gifs-list-div" @recharge="showRecharge"  :giftData="giftProps" v-show="showGifList "></gifs-list>
            </transition>

            <!-- 绑定手机 -->
            <bind-phone v-if="showBindPhone"  :options="BPOptions" @comfirm="comfirmPhone" @getAuthCode="getAuthCode" @close="showLiveChatMsg = true"></bind-phone>


        </div>

        <!-- 充值 -->
        <transition
        name="recharge"
        enter-active-class="slideInUp"
        leave-active-class="slideOutDown">
            <recharge class="recharge-div" @rechargeRes="showRechargeRes" @close="showRecharge" v-if="rechargeShow"></recharge>
        </transition>

        <modal-dialog :options="dailogOptions" @close="showDailog = false" v-if="showDailog"></modal-dialog>

        <!-- 打开合拍 -->
        <open-app-dailog
            @close="showOpenAppDailog=false"
            @cancelFocus="cancelFocus()"
            @focus="focusAnchor()"
            v-if="showOpenAppDailog"
            :options="openAppDailogOptiions">
        </open-app-dailog>

        <!-- 红包 -->
        <transition
            name="bounceIn"
            enter-active-class="bounceIn"
            leave-active-class="bounceOut"
            >
            <red-packet class="red-packet-div" @close="redPacketOpening = false; showLiveChatMsg = true" v-if="redPacketOpening"></red-packet>
        </transition>

        <!-- loginDailog -->
        <login-dailog v-if="showLoginDailog"  @close="showLoginDailog = false" @confirm="loginDailogcConfirm"></login-dailog>


	</div>

    <!-- <div v-else>dddd</div> -->
</template>
<script>
const gifsList = () => import('@/components/components/GifsList')        // 礼物列表
const giftRank  = () => import('@/components/components/GiftRank')         // 直播间 礼物贡献榜
const showGift = () => import('@/components/components/ShowGift')         // 礼物展示
const bindPhone = () =>  import('@/components/components/BindPhone')      // 绑定手机
const recharge = () => import('@/components/components/Recharge')        // 充值
const modalDialog = () => import ('@/components/components/ModalDialog')   // 模态框
const openAppDailog = () => import('@/components/components/OpenAppDailog')    // 打开合拍
const redPacket = () => import ('@/components/components/RedPacket')
const loginDailog = () => import('@/components/components/LoginDailog')

import eventBus from '@/assets/js/bus'


import liveChatMsg from '@/components/components/LiveChatMsg' // 聊天室

  // require styles
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import  'vue-video-player/src/custom-theme.css'
import videojs from 'video.js'
window.videojs = videojs
require('videojs-contrib-hls/dist/videojs-contrib-hls.js')
// require('videojs-flash')

export default {
    name: 'live',
    props: ['options'],
    components: { liveChatMsg, gifsList, giftRank, showGift, recharge, bindPhone, modalDialog, openAppDailog, redPacket, loginDailog, videoPlayer},
    data: function () {
        return {
            queryParms: this.$route.query,

            guestLogin: this.$common.getLocalStorage('guestLogin'),
            wxShareData: null,      // 微信分享
            rechargeShow: false,   // 充值

            isPlaying: false,   // 直播
            showGifList: false,   // 显示礼物列表
            liveRoomDate: this.options,
            phoneCheck: this.$common.getLocalStorage('phone_check'),
            poster: this.options.cover_path,
            showLoginDailog: false,
            showLiveChatMsg: true,
            focus:  (this.options.focus_id == 0) ? false : true,  // 关注
            chatRoomId: null,       // 聊天室id
            textMsgContent: null,   // 发送的消息
            isFocus: false,     // 是否聚焦
            weChat: false,      // 是否微信浏览器
            os: null,
            getRankListTrm: null,
            showBindPhone: false,
            showOpenAppDailog: false,   // 打开合拍
            redPacketOpening: false,    // 打开红包
            openAppDailogOptiions: [],
            dailogOptions: {
                content: null
            },
            showDailog: false,
            BPOptions: {
                show: false,
                gettingAuth: false,
            },
            giftProps: {
                show: false,
                gifsList: null,
                chatroomId: this.options.room_id,
                liveroomId: this.options.id

            },  // 礼物列表 props,
            parseGifsList: null,
            giftsProps: null,
            chatProps: {    // 聊天室 props
                liveUser: this.options
            },
            playerOptions: {     // video配置
                bigPlayButton: false, // video自带的播放按钮
                preload: true,
                fluid: false,  // 自适应
                muted: false, // 静音
                autoplay: false, // 自动播放
                controls: false, // 是否显示控制栏
                techOrder: [ // 兼容顺序
                    'html5',
                    // 'flash',
                ],
                controlBar: {
                    timeDivider: false,
                    durationDisplay: false
                },
                html5: { hls: { withCredentials: false } },
                // flash: { hls: { withCredentials: false } },

                // fluid: true,
                sourceOrder: true,
                language: 'zh-CN',
                width: 0,
                height: 0,
                sources: [
                    {
                        withCredentials: false,
                        type: "application/x-mpegURL",
                        src: this.options.live_room_url
                    },
                ],
                // poster: "http://s1.quhepai.com/uploads/common/201711/15/live/cover/04ad70319538e4f988060647f2b0cac2.jpg",
            }

        }
    },
    created: function () {

        this.resizePlayer();

        this.$nextTick(() => {
            this.setVideoAttr();
        })

         // 获取礼物列表数据
        this.getGifList();;

        // 送礼排行数据
        this.getGiftRank();

        // 判断浏览
        this.setBrowserType();

    },
    mounted: function (){
        // 轮循取贡献榜单
        this.setToutGetRankList();
        this.getWechatShare();
        let _this = this;
        wx.error(function(res){
            console.log(res)
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });

        this.$refs.chatbtn.addEventListener('click',function(e){
            // e.preventDefault();
            let inputEle = document.querySelector('input')
            inputEle.focus();

            if(_this.os == 'ios') {
                let d = setTimeout(function () {
                    var t = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
                    t = parseInt(t[1], 10),
                    11 > t && window.scrollTo(0, document.body.scrollHeight)
                    clearTimeout(d)
                }, 200)
            }


        }, false);

    },
    destroyed: function () {
        if (this.getRankListTrm) {
            clearTimeout(this.getRankListTrm)
        }

    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
        // 分享推送
        shareIMMsg: function () {
            let content = {content: '{"content": "'+ this.liveRoomDate.share_message +'", "type": 5, "price": 0 }'}

            eventBus.$emit('sendTextMsg', content);
        },
        // 未登录 去登录注册
        goLogin: function () {
            if (!this.$common.browserType() == 'weixin') {
                if (this.guestLogin) {
                    this.showLoginDailog = true;
                }
                return false;
            }

        },
        // 登录提示框
        loginDailogcConfirm: function () {

            if (this.$common.browserType() == 'weixin') {
                let url = encodeURIComponent('https://mapp.quhepai.com/?#/live?ch=' + this.$common.getLocalStorage('ch') + '&l=' + this.queryParms.l + '&u=' + this.queryParms.u);
                window.location.href = 'https://quhepai.com/user/wechat?return_url=' + url;

            } else {
                let url = encodeURIComponent('https://mapp.quhepai.com/?#/?ch=' + this.$common.getLocalStorage('ch'));
                window.location.href = 'https://quhepai.com/sso/login?appid=hp29e0943260f1e28b&redirect_uri=' + url;
            }


        },
        // 打开红包
        openRedPacket: function () {
            this.redPacketOpening = true;
            this.showLiveChatMsg = false;
        },
        // 获取微信分享数据
        getWechatShare: function () {
            this.$http(
                {
                    url: '/share/wx/js-share-config?l=' + this.queryParms.l + '&u=' + this.queryParms.u + '&share_user_id=' + this.$common.getLocalStorage('user_id'),
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'url=' + window.location.href
                })
              .then(res => {
                  if (res.data.result == 1) {
                      let _this = this;
                      this.wxShareData = res.data.data.config;
                    wx.config({
                        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.data.config.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.data.config.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.data.config.nonceStr, // 必填，生成签名的随机串
                        signature: res.data.data.config.signature,// 必填，签名，见附录1
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone'
                        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });


                    wx.onMenuShareTimeline({
                        title: '我们很合拍，直播一起来', // 分享标题
                        link: _this.wxShareData.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: _this.liveRoomDate.cover_path + '!S1', // 分享图标
                        success: function () {
                            _this.shareIMMsg()
                        },   // 用户确认分享后执行的回调函数
                        cancel: function () {

                        }   // 用户取消分享后执行的回调函数
                    })

                    wx.onMenuShareAppMessage({
                        title: '我们很合拍，直播一起来', // 分享标题
                        desc: '让我们一起来直播吧', // 分享描述
                        link: _this.wxShareData.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: _this.liveRoomDate.cover_path + '!S1', // 分享图标
                        type: 'link', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success:  function () {
                            _this.shareIMMsg()
                        },   // 用户确认分享后执行的回调函数
                        cancel: function () {

                        }  // 用户取消分享后执行的回调函数
                    });

                  } else {
                      console.log(res.data.msg)
                  }
              })
        },
        // 关闭直播间
        closeLiveRoom: function () {
            // this.player.pause();
                this.$emit('close')
            // this.$router.go(-1)
            // this.$route.push({name: 'live-list'});
        },
        // showOpenAppDailog
        showOpenAppDailogFn: function () {
            this.$http({
                    url: '/live/live/user-info?',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'source=0' + '&live_room_id=' + this.queryParms.l + '&chat_room_id=' + this.liveRoomDate.room_id + '&target_user_id=' + this.liveRoomDate.user_id
                })
                .then(res => {
                    if (res.data.result == 1) {
                        this.openAppDailogOptiions = res.data.data;
                        this.showOpenAppDailog = true;
                    }

                })
        },
        // 显示充值信息
        showRechargeRes: function (res) {
            this.showDailog = true;
            this.dailogOptions.content = '充值失败';
        },
        // 显示充值
        showRecharge: function (res) {
            this.rechargeShow = res.rechargeShow;
            this.showGifList = res.rechargeShow;
            // console.log(res)
        },
        // 轮循取贡献榜单
        setToutGetRankList: function (clear) {
            this.getRankListTrm =  setTimeout(() => {
                this.getGiftRank();
                this.setToutGetRankList();
            }, 20000)
        },
        // 提交手机号码和验证码comfirmPhone
        comfirmPhone: function (data) {
            this.$http({
                url: '/user/bind-phone',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'phone=' + data.phone + '&smscode=' + data.smscode
            })
            .then((res) => {
                if (res.data.result == 1) {
                    this.$common.setLocalStorage('phone_check', 1);
                    this.phoneCheck = 1;
                    this.BPOptions.show = false;
                    this.showDailog = true;
                    this.dailogOptions.content = res.data.msg;
                } else {
                    this.showDailog = true;
                    this.dailogOptions.content = res.data.msg;
                    console.log(res.data.msg);
                }

            })
        },
        // 获取验证码
        getAuthCode: function (phone) {
            // console.log(data)
            this.$http('/user/getsmscode?type=9&phone=' + phone)
                .then(res => {
                    if(res.data.result == 1) {
                        this.BPOptions.gettingAuth = true;
                    } else {
                        this.showDailog = true;
                        this.dailogOptions.content = res.data.msg;
                        console.log(res.data.msg)
                    }
                })
        },
        // 取消关注
        cancelFocus: function () {
            this.$http({
                url: '/live/live/cancel-focus-user',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'focus_user_id=' + this.$common.getLocalStorage('user_id') + '&by_user_id=' + this.liveRoomDate.user_id
            })
            .then(res => {
                if (res.data.result == 1) {
                    this.openAppDailogOptiions.has_attend = 0;
                    this.focus = false;
                }

                this.dailogOptions.content = res.data.msg;
                this.showDailog = true;

            })
        },
        // 关注主播
        focusAnchor: function () {

            if (this.guestLogin == 'true') {
                this.showLoginDailog = true;
                return false;
            }

            let byUserId = this.liveRoomDate.user_id;     // 被关注者ID
            let focusUserId = this.$common.getLocalStorage('user_id');                   // 关注者ID
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
                    this.focus = true;
                    this.openAppDailogOptiions.has_attend = 1;
                    // this.$set(this.openAppDailogOptiions, 'has_attend', 1);

                    let content = {content: ''+ JSON.stringify({type: 2,price: 0,content: ""}) +''}

                    eventBus.$emit('sendTextMsg', content);
                    // console.log(content)
                }
                this.dailogOptions.content = res.data.msg;
                this.showDailog = true;
            })
        },
        // 发送消息
        sendTextMsg: function () {
            let textMsgContent = this.textMsgContent;
            if (textMsgContent == '' || textMsgContent == null) {
                return false;
            } else {
                let content = {
                    content: '{"content": "'+ textMsgContent +'", "type": 1, "price": 0 }',
                }
                eventBus.$emit('sendTextMsg', content);
                this.closeEdit();

            }

        },
        // 进场消息
        sendJoinTextMsg: function (res){

            if (this.guestLogin == 'true' || this.options.is_joined == 1 || process.env.NODE_ENV === 'development') {
                return false;
            }

            if (res) {
                let d = {
                    type: 3,
                    price: 0,
                    content: '{"is_joined": 0, "join_msg": "'+this.liveRoomDate.viewer_message+'"}'
                }
                let content = {
                    content: ''+ JSON.stringify(d) +''
                }

                eventBus.$emit('sendTextMsg', content);

            } else {
                alert('加入聊天室失败,请重新登录。')
            }

        },
        // 关闭消息编辑
        closeEdit: function () {
            this.isFocus = false;
            this.showLiveChatMsg = true;
            this.textMsgContent = '';
                // this.isFocus = false;
            // document.querySelector('input').blur()
        },
        //
        setBrowserType: function () {
            if (this.browserType() ) this.os = this.browserType();
        },
        // 判断浏览器类型
        browserType: function () {
            let type = '';
            let ua = navigator.userAgent;
            if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
                type = 'ios';
            } else if (/(Android)/i.test(ua)) {
                type = 'android';
            } else {
                type = 'pc';;
            };
            return type;
        },
        bindPhoneMask: function () {

            if (this.guestLogin == 'true') {
                this.showLoginDailog = true;
                return false;
            }
        },
        // 编辑消息
        editTextMsg: function () {
            this.isFocus = true;
            this.showLiveChatMsg = false;
        },
        getGifList () {     // 获取礼物列表
          this.$http.get('/live/live/gifts?type=1')
            .then((res) => {
                if (res.data.result != 0) {
                    this.giftProps.gifsList = res.data.data
                    eventBus.$emit('gitListData', res.data.data.concat(res.data.preload_list));
                    this.giftLoading = false;
                } else {
                    console.log(res.data.msg)
                }
            })
        },
        getGiftRank () {   // 顶部 送礼排行
            this.$http.get('/chat/chatroom/user-list?live_room_id=' + this.queryParms.l + '&page=0')
                .then((res) => {
                    if (res.data.result != 0) {
                        this.giftsProps = res.data.data
                    } else {
                        console.log(res.data.msg)
                    }

                })
        },
        closeGifsListFn: function (e) {     // 关闭礼物列表 和 消息编辑
            if (this.showGifList) {
                this.showGifList = false;
                this.giftProps.show = false;
            } else if (this.isFocus) {
                this.textMsgContent = '';
                this.isFocus = false;
                this.showLiveChatMsg = true;
            }

        },
        showGifsListFn: function () {     // 打开礼物列表

            if (this.guestLogin == 'true') {
                this.showLoginDailog = true;
                return false;
            }

            this.showGifList = true;
            this.$set(this.giftProps, 'show', true)


        },
        play (player) {     // 播放视频
            this.isPlaying = true;

            if (this.$common.browserType() == 'weixin' || this.$common.browserType() == 'lewan' || this.$common.browserType() == 'qq') {
                if (this.browserType() == 'android') {
                    this.weChat = true;
                }

            }
            player.play()
        },
        setVideoAttr () {
            let videoEl = document.getElementsByClassName('vjs-tech')[0];
            videoEl.setAttribute('x-webkit-airplay', 'true');
            videoEl.setAttribute('x5-video-player-type', 'h5')
            videoEl.setAttribute('x5-video-player-fullscreen', 'true')
        },
        // player is ready
        autoplayVideo: function () {
            let _this = this;
            player.load();
            player.play();
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                video.play();
                player.play();
            }, false);

        },
        playerReadied(player) {
            wx.miniProgram.postMessage({ data: {foo: 'bar'} })
            if (this.browserType() == 'ios' || window.__wxjs_environment === 'miniprogram') {
                let _this = this;
                wx.ready(() => {
                    wx.getNetworkType({
                        success: function (res) {
                            // res.networkType; // 返回网络类型2g，3g，4g，wifi
                            document.getElementsByClassName('vjs-tech')[0].load();
                            document.getElementsByClassName('vjs-tech')[0].play();
                            _this.isPlaying = true;
                            if (_this.$common.browserType() == 'weixin') {
                                if (_this.browserType() == 'android') {
                                    _this.weChat = true;
                                }

                            }

                        }
                    })
                })
            }

            var hls = player.tech({ IWillNotUseThisInPlugins: true }).hls
            player.tech_.hls.xhr.beforeRequest = function(options) {
                return options
            }

        },
            // listen event
        onPlayerPlay(player) {
            // player.play();
            // console.log('player play!', player)
        },
        onPlayerPause(player) {
            this.isPlaying = false;
            if (
                this.$common.browserType() == 'weixin'
                || this.$common.browserType() == 'lewan'
                || this.$common.browserType() == 'qq'
            ) {
                if (this.browserType() == 'android') {
                    this.weChat = false;
                }
            }
            // console.log('player pause!', player)
        },
        onPlayerEnded(player) {
            // console.log('player ended!', player)
        },
        onPlayerLoadeddata(player) {
            console.log('player Loadeddata!')
        },
        onPlayerWaiting(player) {
            // console.log('player Waiting!', player)
        },
        onPlayerPlaying(player) {
            // console.log('player Playing!', player)
        },
        onPlayerTimeupdate(player) {
            // console.log('player Timeupdate!', player.currentTime())
        },
        onPlayerCanplay(player) {
            // console.log('player Canplay!', player)
        },
        onPlayerCanplaythrough(player) {
            // console.log('player Canplaythrough!', player)
        },
        // or listen state event
        playerStateChanged(playerCurrentState) {
            // console.log('player current update state', playerCurrentState)
        },
        resizePlayer () {   // 重置播放器大小
            let sWidth = 9, sHeight = 16;
            let width = window.innerWidth;
            let height = width * sHeight / sWidth;
            this.playerOptions.width = width;
            this.playerOptions.height = height;

        }
    }

}
</script>
<style lang="scss" scoped>
     @import "../../assets/scss/function";

    #live-room{
        width: 100vw;
        height: 100%;
        overflow: hidden;

        -webkit-tap-highlight-color:rgba(255,255,255,0);

        .video-player /deep/ video::-webkit-media-controls-start-playback-button {
            display: none !important;
        }



        // 展示层
        .show-wrap-div{
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100%;


            // 礼物贡献榜
            .live-top-div{

                position: absolute;
                top: 0;
                left: 0;
                z-index: 3;
                width: 100vw;
                box-sizing: border-box;
                padding: torem(20px) torem(20px) torem(14px);

                .contribution-div {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    width: 100%;
                    box-sizing: border-box;
                    .anchor-div{
                        $h: torem(70px);
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        height: $h;
                        width: torem(320px);
                        background-color: rgba(0, 0, 0, .2);
                        border-radius:  $h / 2;
                        margin-right: torem(20px);

                        .anchor-avata{
                            $w: torem(70px);
                            @include eqWH($w);
                            border-radius: $w / 2;
                            margin-right: torem(10px);
                        }

                        .left{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            width: 80%;
                            color: #fff;
                            .nick-div{
                                .user-nickname{
                                    width: torem(100px);
                                    // width: torem(200px);
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: torem(20px);
                                }
                                .user-exp{
                                    font-size: torem(22px);
                                }
                            }

                            .follow-btn{
                                $w: torem(80px);
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: $w;
                                height: torem(40px);
                                background-color: rgb(253, 152, 9);
                                border-radius: $w / 2;
                                margin-right: torem(10px);
                                font-size: torem(22px);
                            }
                        }
                    }

                    .gift-rank-div{
                        width: torem(284px);
                    }

                    .live-num-count{
                        $w: torem(76px);
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        width: $w;
                        height: torem(60px);
                        border-radius: $w / 2;
                        background-color: rgba(0, 0, 0, .2);
                        color: #fff;
                        font-size: torem(24px);
                        margin-left: torem(10px);
                    }
                }

                .user-id-show-div{
                    $h: torem(42px);
                    display: inline-block;
                    justify-content: center;
                    align-items: center;
                    height: $h;
                    border-radius: $h / 1.2;
                    background-color: rgba(255, 255, 255, 1);
                    font-size: torem(26px);
                    color: #2d2d2d;
                    opacity: .3;
                    padding: torem(5px) torem(20px);
                    float: right;
                    margin-top: torem(20px);
                    line-height: $h;

                }


            }

            .wecat{
                margin-top: torem(50px);
            }

            // 聊天室
            .live-chat-msg-div{
                position: absolute;
                bottom: torem(110px);
                left: 0;
                z-index: 3;
                max-width: torem(650px);
                height: torem(400px);
            }

            // 封面
            .poster-div{
                width: 100vw;
                height: 100%;
                background-size: cover !important;
            }

            // 礼物列表
            .gifs-list-div{
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 4;
                width: 100vw;
                height: torem(548px);
            }

            // 礼物展示
            .show-gift-div{
                position: absolute;
                left: 0;
                top: torem(90px);
                // bottom: torem(90px);
                bottom: 0;


            }

            // 底部导航
            .not-edit{
                position: absolute;
                left: 0;
                bottom: 0;
                z-index: -1;
                opacity: 0;
                width: 100% !important;
                height: torem(90px) !important;

            }

            .edit{
                transform: all .1s ease-in;
                background-color: #fff;
                opacity: 1;
                transition: all .2s;
                input::-webkit-input-placeholder {
                    color: #ccffff;
                    font-size: torem(28px);
                }

            }

            #live-room-bottom-nav{
                $liveChatH: torem(90px);
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 1;
                width: 100%;
                height: $liveChatH;
                border-top: 1px solid rgba(255, 255, 255, .1);
                // background-color: rgba(255, 255, 255, .2);

                .chat-item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: $liveChatH;
                }

                .chat-input-edit{
                    width: torem(552px);
                    height: torem(72px);
                    background-color: #f3f3f3;
                    border-radius: torem(8px);
                    border: none;
                    box-sizing: border-box;
                    font-size: torem(28px);
                    padding: 0 torem(20px);
                    color: #2e2e2e;
                    margin-left: torem(20px);
                }

                .send-textmsg-btn{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: torem(138px);
                    height: torem(56px);
                    background-color: #ffa800;
                    color: #fff;
                    font-size: torem(26px);
                    border-radius: torem(138px) / 2;
                    margin-right: torem(20px);
                    text-decoration: none;

                }

                $chatInputW: torem(325px);
                .chat-input{
                    width: $chatInputW;
                    display: flex;
                    align-items: center;
                    height: torem(70px);
                    box-sizing: border-box;
                    border-radius: $chatInputW / 2;
                    background-color: rgba(0, 0, 0, .2);
                    font-size: torem(28px);
                    padding: 0 torem(20px);
                    border: none;
                    color: #fff;
                    margin-left: torem(40px);

                }

                .mind-red-packet{
                    @include eqWH(torem(62px));
                }

                input::-webkit-input-placeholder {
                    color: #2e2e2e;
                    font-size: torem(28px);
                }

                .left{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .close-live-room{
                        @include eqWH(torem(60px));
                        margin-left: torem(40px);
                        margin-right: torem(50px);
                        background: url('../../assets/images/btn_trend_closed@2x.png') no-repeat center;
                        background-size: 100%;
                    }

                    .show-gif-btn{
                        $w: torem(78px);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: $w;
                        height: $w;
                        background-color: #f66;
                        color: #fff;
                        // border-radius: $w / 2;
                        text-decoration: none;
                        background: url('../../assets/images/btn_h5_liwu@2x.png') no-repeat center;
                        background-size: 100%;
                    }

                }


                .pre-edit-div{
                    position: absolute;
                    top: 0;
                    left: torem(40px);;
                    width: $chatInputW;
                    height: 100%;
                }


            }

            // 播放按钮
            .play-video-btn{
                $w: torem(140px);
                @include eqWH($w);
                position: absolute;
                top: 50%;
                left: 50%;
                z-index: 3;
                margin-top: - $w / 2;
                margin-left: - $w / 2;
            }
        }

        // 充值
        .recharge-div{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 6;
            width: 100%;
            height: 100vh;
        }



        .red-packet-div{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 5;
            width: 100%;
            height: 100%;
            // z-index: 999;
            // width: torem(694px);
            // height: torem(422px);
        }

        @keyframes slideInUp {
            from {
                transform: translate3d(0, 100%, 0);
                visibility: visible;
            }

            to {
                transform: translate3d(0, 0, 0);
            }
        }

        .slideInUp {
            animation-name: slideInUp;
            animation-duration: .3s;
            animation-fill-mode: both;
        }


        @keyframes slideOutDown {
            from {
                transform: translate3d(0, 0, 0);
            }
            to {
                visibility: hidden;
                transform: translate3d(0, 100%, 0);
            }
        }

        .slideOutDown {
            animation-name: slideOutDown;
            animation-duration: .3s;
            animation-fill-mode: both;
        }



        @keyframes bounceIn {
            from,
            20%,
            40%,
            60%,
            80%,
            to {
                -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
                animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            }

            0% {
                opacity: 0;
                -webkit-transform: scale3d(0.3, 0.3, 0.3);
                transform: scale3d(0.3, 0.3, 0.3);
            }

            20% {
                -webkit-transform: scale3d(1.1, 1.1, 1.1);
                transform: scale3d(1.1, 1.1, 1.1);
            }

            40% {
                -webkit-transform: scale3d(0.9, 0.9, 0.9);
                transform: scale3d(0.9, 0.9, 0.9);
            }

            60% {
                opacity: 1;
                -webkit-transform: scale3d(1.03, 1.03, 1.03);
                transform: scale3d(1.03, 1.03, 1.03);
            }

            80% {
                -webkit-transform: scale3d(0.97, 0.97, 0.97);
                transform: scale3d(0.97, 0.97, 0.97);
            }

            to {
                opacity: 1;
                -webkit-transform: scale3d(1, 1, 1);
                transform: scale3d(1, 1, 1);
            }
        }

        .bounceIn {
            animation-duration: 0.75s;
            animation-name: bounceIn;
        }



        @keyframes bounceOut {
            20% {
                -webkit-transform: scale3d(0.9, 0.9, 0.9);
                transform: scale3d(0.9, 0.9, 0.9);
            }

            50%,
            55% {
                opacity: 1;
                -webkit-transform: scale3d(1.1, 1.1, 1.1);
                transform: scale3d(1.1, 1.1, 1.1);
            }

            to {
                opacity: 0;
                -webkit-transform: scale3d(0.3, 0.3, 0.3);
                transform: scale3d(0.3, 0.3, 0.3);
            }
        }

        .bounceOut {
            animation-duration: 0.75s;
            animation-name: bounceOut;
        }
    }
</style>
