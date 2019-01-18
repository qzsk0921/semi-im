<template>
    <div id="open-app-dailog-div" @click.stop.prevent>
        <div class="dailog-content-div">
            <img class="avatar" :src="userData.portrait" alt="">
            <div class="nick-name-div">
                <span class="nickname-span">{{userData.name}}</span>
                <div class="age-div female-color">
                    <div class="age-icon female"></div>
                    <span class="age-span">{{userData.age}}</span>
                </div>
            </div>
            <div class="user-id-div">
                <span>ID: {{userData.id}}</span>
                <span>{{userData.area_name}}</span>
            </div>
            <p class="siger">{{userData.signer ? userData.signer : '这家伙太懒了...'}}</p>
            <div class="levl-div">
                <div class="levl levl-item" style="background: url(../../../static/images/common/pic_caifu_lv1_4@2x.png) no-repeat center">
                    <p class="levl-p">财富等级</p>
                    <p class="levl-num">{{userData.level}}</p>
                </div>
                <div class="live-levl levl-item" style="background: url(../../../static/images/common/pic_zhubo_lv1_4@2x.png) no-repeat center">
                    <p class="levl-p">主播等级</p>
                    <p class="levl-num">{{userData.zbLevel}}</p>
                </div>
            </div>
            <div class="focus-div">
                <div>
                    <span class="lab">关注 : </span> <span class="num">{{userData.focus_num}}</span>
                </div>
                <div>
                    <span class="lab fans">粉丝 : </span> <span class="num">{{userData.by_focus_num}}</span>
                </div>

            </div>
            <div class="focus-btn">
                <a href="javascript:void(0)" v-if="userData.has_attend" @click.stop.prevent="cancelFocus()">取消关注</a>
                <a href="javascript:void(0)" v-else @click.stop.prevent="focus()">关注</a>
            </div>
            <a class="open-app-btn" href="javascript:void(0)" @click.stop.prevent="openApp()">打开合拍私聊</a>
            <img class="close-btn" @click.stop.prevent="close()" src="../../assets/images/pic_zhibo_closed@2x.png">
        </div>
    </div>
</template>
<script>
export default {
    name: 'openAppDailog',
    props: ["options"],
    data: function () {
        return {
            userData: this.options
        }
    },
    methods: {
        close: function () {
            this.$emit('close', false);
        },
        cancelFocus: function () {
            this.$emit('cancelFocus');
        },
        focus: function () {
            this.$emit('focus');
        },
        openApp: function () {
            if (window.__wxjs_environment === 'miniprogram') {
                window.location = 'http://quhepai.com/mobile';
            } else {
                window.location = 'http://quhepai.com/mobile/download';
            }

        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../../assets/scss/function';

    #open-app-dailog-div{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 8;
        @include eqWH(100%);
        background-color: rgba($color: #000000, $alpha: .5);

        .dailog-content-div{
            $desColor: '#2e2e2e';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
            width: torem(590px);
            background-color: #fff;
            border-radius: torem(10px);

            .close-btn{
                $cbtn: torem(51px);
                $cbtnt: torem(20px);
                position: absolute;
                bottom: - (torem(40px) + $cbtn);
                left: 50%;
                @include eqWH($cbtn);
                transform: translate3d(-50%, 0, 0);
            }

            .avatar{
                $w: torem(140px);
                display: block;
                position: absolute;
                top: 0;
                left: 50%;
                @include eqWH($w);
                border-radius: $w / 2;
                transform: translate3d(-50%, -50%, 0);
                border: torem(3px) solid #fff;
            }

            .nick-name-div{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: torem(100px);
                font-size: 0;

                .nickname-span{
                    font-size: torem(28px);
                    color: #000;
                }

                .age-div{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: torem(28px);
                    border-radius: torem(5px);
                    padding: torem(1px) torem(8px);
                    margin-left: torem(10px);

                    .age-span{
                        font-size: torem(22px);
                        color: #fff;
                    }

                    .male{
                        display: inline-block;
                        @include eqWH(torem(28px));
                        background: url("../../../static/images/common/pic_sex_male@2x.png");
                        background-size: 100%;

                    }

                    .female{
                        display: inline-block;
                        @include eqWH(torem(20px));
                        background: url("../../../static/images/common/pic_sex_female@2x.png");
                        background-size: 100%;
                    }
                }

                .male-color{
                    background-color: #84deff;
                }

                .female-color{
                    background-color: #FF92B3;
                }

            }

            .user-id-div{
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: torem(24px);
                color: #989898;
                margin: torem(20px) 0 torem(30px);
                line-height: 100%;

                span{
                    display: inline;
                    margin-right: torem(20px);
                }
            }

            .siger{
                font-size: torem(24px);
                color: #aaa;
                text-align: center;
                max-width: torem(500px);
                margin: 0 auto;
                line-height: torem(40px);
            }


            .levl{
                margin-right: torem(30px);
            }

            .levl-div{
                display: flex;
                justify-content: center;
                align-items: center;
                margin: torem(50px) 0;

                .levl-item{
                    width: torem(198px);
                    height: torem(90px);
                    background-size: 100% !important;


                    &>p{
                        width: torem(100px);
                        float: right;
                        margin-right: torem(20px);
                        color:#fff;
                    }
                    &>p:nth-of-type(1){
                        font-size: torem(20px);
                        text-align: right;
                        margin-top: torem(16px);
                        margin-bottom: torem(10px);
                        line-height: 100%;
                    }
                    &>p:nth-of-type(2){
                        box-sizing: border-box;
                        font-size: torem(20px);
                        text-align: left;
                        padding-left: torem(20px);
                        font-size: torem(28px);
                    }
                }
            }

            .focus-div{
                display: flex;
                justify-content: center;
                text-align: center;
                line-height: 100%;

                .lab{
                    display: inline-block;
                    font-size: torem(26px);
                    color: #aaa;
                }

                .fans{
                    margin-left: torem(100px);
                }

                .num{
                    font-size: torem(26px);
                    color: #858585;
                }
            }

            .focus-btn{
                display: block;
                width: torem(200px);
                height: torem(70px);
                text-align: center;
                line-height: torem(70px);
                margin: torem(60px) auto 0;



                &>a{
                    font-size: torem(32px);
                    color: #aaa;
                    text-decoration: none;
                }
            }

            .open-app-btn{
                $btnW: torem(420px);
                text-decoration: none;
                display: flex;
                justify-content: center;
                align-items: center;
                width: $btnW;
                height: torem(78px);
                border: 1px solid #ffa800;
                // background-color: #ffa800;
                border-radius: $btnW / 2;
                color: #ffa800;
                font-size: torem(30px);
                margin: torem(40px) auto;

            }

        }
    }
</style>
