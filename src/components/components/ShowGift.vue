<template>
    <div id="show-gift-div">
        <!-- 小礼物 -->
        <transition-group
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:after-enter="afterEnter"
            v-on:enter-cancelled="enterCancelled"

            v-on:before-leave="beforeLeave"
            v-on:leave="leave"
            v-on:after-leave="afterLeave"
            v-on:leave-cancelled="leaveCancelled"
            >

            <!-- <div v-show="sIsShow" v-for=" (v , i) in showSGiftData" :key="i" :data-is-static="v.is_static" class="show-gift-div" :class="'show-gift-div-'+ i" ref="s-gift" >
                <div class="show-s-gift-div" v-if="v.is_static == 1" >
                    <div class="left-div-wrap">
                        <img class="avatar" :src="v.user.portrait" alt="" >
                        <div class="nick-name-div">
                            <p class="nick-name">{{v.user.name}}</p>
                            <p class="gift-des">送 主播{{v.title}}</p>
                        </div>
                        <div class="s-gift-img-div">
                            <img class="s-gift-img" :src="v.thumb_url" alt="">
                        </div>
                    </div>
                    <div class="right-div"><span class="plus">×</span><span class="gift-num">{{v.giftsendcount}}</span></div>
                </div>

            </div> -->
        </transition-group>

        <!-- 大礼物 （动态礼物） -->
        <transition-group
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:after-enter="afterEnter"
            v-on:enter-cancelled="enterCancelled"

            v-on:before-leave="beforeLeave"
            v-on:leave="leave"
            v-on:after-leave="afterLeave"
            v-on:leave-cancelled="leaveCancelled"
            >
            <!-- <div class="show-b-gift-div" v-show="gIsShow" :data-is-static="v.is_static" :class="'show-b-gift-div-'+i"  v-for="(v, i) in showGGiftData" :key="i">
                <img class="gif-gift-img" :src="v.pic_url" alt="">
            </div> -->

        </transition-group>
    </div>
</template>
<script>
import eventBus from '@/assets/js/bus'
export default {
    name: 'showGift',
    props: [],
    data: function () {
        return {
            sIsShow: false,
            gIsShow: false,      // 是否显示
            giftListData: null,    // 礼物列表
            gitData: [],         // 单个礼物数据
            showSGiftData: [],    // 静态礼物要显示的礼物数组
            sGiftList:[],           // 静态礼物总数组
            gGiftList:[],           //动态礼物列表
            showGGiftData: [],      // 动态态礼物要显示的礼物数组
            isShowList:[],        // 控制显示的礼物数组
            sAnimateIsFinish: false,
            gAnimateIsFinish: false,
            firstPush: true,
            sgiftAniamte: {
                duration: '',
                keframe:[]
            },
            ggiftAniamte: {
                duration: '',
                keframe:[]
            },
            gifGiftList: []
        }
    },
    beforeCreate: function () {
        eventBus.$on('gitListData', data => {      // 订阅礼物列表数据

            this.giftListData = this.formatArray(data);

        })
    },
    created: function () {

        // 订阅送礼信息
        eventBus.$on('giftMsg' , data => {

            let d = this.giftListData[data['giftid']];

            data['thumb_url'] = d['thumb_url'];
            data['is_static'] = d['is_static'];
            data['gif_mins'] = d['gif_mins'];
            data['pic_url'] = d['pic_url'];
            let type = parseInt(d.is_static);
            switch (type) {
                case 0:
                    this.ggiftAniamte = {
                        duration: parseInt(d.gif_mins) + 50,
                        keframe: [
                            {
                                transform: 'none',
                                easing: 'ease-out',
                                opacity: 0,
                            },
                            {
                                offset: .1,
                                opacity: 1,
                                easing: 'ease-out',
                            },
                            {
                                offset: .9,
                                opacity: 1,
                                easing: 'ease-out',
                            },
                            {
                                transform: 'none',
                                opacity: 0,
                                easing: 'ease-out',
                            }
                        ]
                    };

                    this.gGiftList.push(data);
                    if (this.gAnimateIsFinish == false) {
                        let pushData = this.gGiftList.shift();
                        this.gAnimateIsFinish = true;
                        this.showGGiftData.push(pushData)
                        this.gIsShow = true;
                        this.sendBigGigftMsg(pushData);
                    }
                    break;
                case 1:
                    this.sgiftAniamte.duration = 3000;
                    this.sgiftAniamte.keframe = [
                        {

                            transform: 'translate(-10%, 10vh)',
                            easing: 'linear',
                            opacity: 0
                        },
                        {
                            offset: .1,
                            transform: 'translate(0, 10vh)',
                            easing: 'ease-out',
                            opacity: 1,
                        },
                        {
                            offset: .8,
                            transform: 'translate(0, 10vh)',
                            easing: 'ease-out',
                            opacity: 1,
                        },
                        {
                            offset: 1,
                            transform: 'translate(0, -.5rem)',
                            easing: 'ease-out',
                            opacity: 0
                        },
                        {
                            transform: 'none',
                            opacity: 0,
                            easing: 'ease-out',
                        },
                    ];

                    this.sGiftList.push(data);

                    if (this.sAnimateIsFinish == false) {
                        this.sAnimateIsFinish = true;
                        this.showSGiftData.push(this.sGiftList.shift())
                        this.sIsShow = true;
                    }
                    break;
            }
        })

    },
    destroyed: function () {
      eventBus.$off('gitListData')
      eventBus.$off('giftMsg')
    },
    methods: {
        sendBigGigftMsg: function (data) {    // 大礼物推送IM消息
            let msgContent = {
                content: '{"content":"送出一个'+ data.giftname +'","type":1,"price":0}',
                objectName: "HEP:TxtMsg",
                user: data.user
            }
            eventBus.$emit('sendBigGigftMsg', msgContent);
        },
        formatArray(data) {

            let array = {};
            data.forEach((element, i) => {
                array[element.id] = element;
            })
            return array;
        },

        beforeEnter: function (el) {

        },
        enter: function (el, done) {

            let giftType = parseInt(el.getAttribute('data-is-static'));
            switch (giftType) {
                case 0:
                    let ganimate = el.animate( this.ggiftAniamte.keframe, {duration: this.ggiftAniamte.duration, fill: 'both'})
                     ganimate.addEventListener('finish', () => {

                        if (this.gGiftList.length > 0) {
                            let pushData = this.gGiftList.shift();
                            this.showGGiftData.push(pushData);
                            this.sendBigGigftMsg(pushData);
                        } else {
                            this.gAnimateIsFinish = false;
                        }
                        this.gIsShow = true;
                        var _parentElement = el.parentNode;
                        if(_parentElement){
                            _parentElement.removeChild(el);
                        }
                    });
                    break;
                case 1:
                    let sanimate = el.animate( this.sgiftAniamte.keframe, {duration: this.sgiftAniamte.duration, fill: 'both'})
                     sanimate.addEventListener('finish', () => {

                        if (this.sGiftList.length > 0) {
                            this.showSGiftData.push(this.sGiftList.shift());
                        } else {
                            this.sAnimateIsFinish = false;
                        }
                        this.sIsShow = true;

                        // console.log(t) ;
                        var _parentElement = el.parentNode;
                        if(_parentElement){
                            _parentElement.removeChild(el);
                        }

                    });
                    break;

            }
            done()
        },
        afterEnter: function (el) {},
        enterCancelled: function (el) {},
        beforeLeave: function (el) {},
        leave: function (el, done) {
            console.log(2)
            done()
        },
        afterLeave: function (el) {
            console.log(3)
        },
        // leaveCancelled 只用于 v-show 中
        leaveCancelled: function (el) {
            console.log(4)
        }
    }

}
</script>
<style lang="scss" scoped>
     @import "../../assets/scss/function";
    #show-gift-div{
        width: 100%;
        z-index: 4;
        pointer-events: none;
        .show-s-gift-div{
            display: flex;
            align-items: center;
            position: absolute;
            top: 20vh;
            left: torem(20px);


            .left-div-wrap{
                $h: torem(70px);
                display: flex;
                justify-content: flex-start;
                align-items: center;
                position: relative;
                height: $h;
                // min-width: torem(350px);
                background-color: rgba(181, 181, 176, .5);
                border-radius: $h / 2;

                .avatar{
                    $w: torem(70px);
                    @include eqWH($w);
                    border-radius: $w / 2;
                }

                .nick-name-div{
                    margin-left: torem(10px);
                    color: #fff;

                    .nick-name{ font-size: torem(24px) };
                    .gift-des{ font-size: torem(22px) }

                }

                .s-gift-img-div{

                    position: relative;
                    width: torem(117px);
                    height: torem(70px);
                    .s-gift-img{
                        position: absolute;
                        bottom: 0;
                        right: - torem(5px);
                        width: 100%;
                    }
                }


            }

            .right-div{
                margin-left: torem(20px);

                .plus, .gift-num{
                    $txtsBlur: 3px;
                    $txtsXY: 0;
                    font-size: torem(54px);
                    color: rgba( 248, 198, 40, 1);
                    font-weight: bolder;
                    // text-shadow: 10px 10px 50px rgba( 255, 255, 255, 1);
                   text-shadow: $txtsXY $txtsXY $txtsBlur #fff, - $txtsXY - $txtsXY $txtsBlur #fff;

                    // opacity: ;
                }

                .gift-num{
                   margin-left: torem(10px);
                }
            }

            .cc-enter-active, .cc-leave-active{
                animation: ddd 3s both;
            }

            @keyframes ddd {
                0%{
                    transform: translate3d(-100%, 0, 10vh);
                }
                100%{
                    transform: translate3d(100%, 0, 10vh);
                }
            }

        }


        .show-b-gift-div{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;

            .gif-gift-img{
                width: 100%;
                height: 100%;
            }
        }


    }

</style>
