<template>
    <div id="live-over">
        <img class="bg-blur" :src="options.cover_path + '!S4'" alt="">
        <div class="live-over-mask">
            <img class="close-btn" @click="close" src="../../../static/images/common/btn_video_closed@2x.png" alt="">
            <p class="close-title-p">直播结束</p>
            <p class="close-des-p">关注Ta不错过下次直播</p>
            <img class="avatar" :src="options.user_pic" alt="">
            <p class="nick-name">{{options.user_nickname}}</p>
            <p class="view-num">{{options.on_line_past_num}}人看过</p>
            <div class="btn-div" :class="focus ? 'not-focus ' : 'focus'" @click="focusAnchor">{{focus ? '已关注' : '关注'}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'liveOver',
    props: ['options'],
    data: function () {
        return {
            focus: (this.options.focus_id == 0) ? false : true,
            isLogin: this.$common.chekLogin()
        }
    },
    methods: {
        close: function () {
            this.$emit('close')
        },
        // 关注主播
        focusAnchor: function () {

            if (this.isLogin) {
                if (this.focus) {
                    return false;
                }

                let byUserId = this.options.user_id;     // 被关注者ID
                let focusUserId = this.$common.getLocalStorage('user_id'); // 关注者ID

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
                    }
                })
            } else {
                location.href = 'http://quhepai.com/mobile/download';
            }


        },
    }
}
</script>
<style lang="scss" scoped>
    @import '../../assets/scss/function';
    #live-over{
        width: 100%;
        height: 100%;
        touch-action: none;

        .bg-blur{
            width: 100%;
            height: 100%;
            filter: blur(35px);
        }

         .live-over-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(43, 51, 63, .5);
            text-align: center;
            touch-action: none;

            .close-btn{
                @include eqWH(torem(40px));
                position: absolute;
                top: torem(34px);
                right: torem(34px);
            }

            .close-title-p{
                font-size: torem(48px);
                color: #fff;
                margin-top: torem(170px);
            }

            .close-des-p{
                font-size: torem(26px);
                color: #aaa;
                margin-top: torem(10px);
            }

            .avatar{
                @include eqWH(torem(160px));
                box-sizing: border-box;
                border-radius: torem(80px);
                border: 1px solid #fff;
                margin: torem(80px) 0 torem(30px);
            }

            .nick-name{
                font-size: torem(30px);
                color: #fff;
                margin-bottom: torem(50px);
            }

            .view-num{
                font-size: torem(36px);
                color: #fff;
            }

            .btn-div{
                $w: torem(420px);
                $h: torem(78px);
                display: flex;
                justify-content: center;
                align-items: center;
                width: $w;
                height: $h;
                border-radius: $h / 2;
                font-size: torem(32px);
                margin: torem(50px) auto 0;
            }

            .focus{
                background-color: #ffa800;
                color: #fff;
            }
            .not-focus{
                background-color: rgb(174, 171, 164);
                color: #fff;
            }
        }


    }
</style>
