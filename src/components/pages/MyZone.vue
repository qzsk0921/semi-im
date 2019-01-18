<template>
    <div id="my-zone" v-if="userData">
        <div class="header-div">
            <div class="user-info">
                <img class="avatar left" :src="userData.user_pic + '!S1'" :alt="userData.user_nickname">
                <div class="mid">
                    <div class="nickname-div">
                        <span class="nickname-span">{{userData.user_nickname}}</span>
                        <div class="age-div" :class="{'female-color': userData.sex == 0, 'male-color': userData.sex == 1}">
                            <div class="age-icon" :class="{'female': userData.sex == 0, 'male': userData.sex == 1}"></div>
                            <span class="age-span">{{userData.age}}</span>
                        </div>
                        <img class="levl" :src="'../../../static/images/userLevel/pic_caifu_lv'+ userData.level +'@2x.png'" alt="">
                    </div>
                    <p class="id-div">ID : {{userData.user_id}}</p>
                </div>
            </div>
            
            <div class="dvi caifu-lev">
                <span class="level-num">财富值 : LV.{{userData.level}}</span>
                <div class="level-prosess"><div class="prosess" :style="{width: ((parseInt(userData.exp) / parseInt(userData.maxExp))*100) + '%'}"><div class="prosess-num">{{((parseInt(userData.exp) / parseInt(userData.maxExp)).toFixed(2))*100}}%</div></div></div>
            </div>
        </div>
        <div class="main-div">
            <div class="coin-div">
                <p class="my-coin-title">我的播币</p>
                <div class="coin-num-div">
                    <div class="coin-num">{{coinNum}}</div>
                    <a class="go-recharge-btn" href="javascript:void(0)" @click.stop.prevent="rechargeFn">去充值</a>
                </div>
            </div>
        </div>
        <div class="footer-div">
            <a class="bind-phone-btn" href="javascript:void(0)" v-if="phoneCheck != 1" @click="bindPhoneMask()">绑定手机</a>
        </div>
        <!-- 充值 -->
        <transition 
            name="recharge"
            enter-active-class="slideInUp"
            leave-active-class="slideOutDown">
            <recharge v-if="recharge" class="recharge-div" @close="recharge = false"></recharge>
        </transition>

          <!-- 绑定手机 -->
        <bind-phone :options="BPOptions" @comfirm="comfirmPhone" @getAuthCode="getAuthCode"></bind-phone>

        <loading v-if="loading"></loading>

        <modal-dialog :options="dailogOptions" @close="showDailog = false" v-if="showDailog"></modal-dialog>  
    </div>
</template>
<script>

const recharge = () => import('@/components/components/Recharge')       // 充值
const bindPhone = () => import('@/components/components/BindPhone')     // 绑定手机
const loading = () => import('@/components/components/Loading')
const modalDialog = () => import('@/components/components/ModalDialog')

export default {
    name: 'myZone',
    components: {recharge, bindPhone, loading, modalDialog},
    data: function () {
        return {
            userData: null,
            coinNum: 0,
            recharge: false,
            loading: true,
            showDailog: false,
            dailogOptions: {
                content: null
            },
            BPOptions: {
                show: false,
                gettingAuth: false
            },
            phoneCheck: this.$common.getLocalStorage('phone_check')
        }
    },
    created: function () {
        this.pullUserData();
        this.getCoinNum();
    },
    methods: {
        rechargeFn: function () {

            if (this.$common.browserType() == 'weixin') {
                this.recharge = true
            } else {
                let sch = this.$common.getLocalStorage('ch')
                let ch =  (sch == 'null' || sch == 'undefined') ? 'H5_s_000' : sch
                location.href = 'https://api2.quhepai.com/webview/live/goods?os=Android&user_id='+ this.$common.getLocalStorage('user_id') +'&token=' + this.$common.getLocalStorage('token') + '&ch=' + ch
                return false;
                
            }
        },
        bindPhoneMask: function () {
            if (this.phoneCheck == 0) {
                this.BPOptions.show = true;
            }
            return false;
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
                    }
                })
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
                }
                
            })
        },
        pullUserData: function () {
            this.$http.get('/user/token?user_id=' + this.$common.getLocalStorage('user_id') + '&token=' + this.$common.getLocalStorage('token'))
            .then(res => {
                let data = res.data;
                if (data.result == 1) {
                    this.userData = data.data;
                    this.loading = false;
                } else {
                    console.log(res.msg)
                }


                
            })
        },
        // 获取播币余额
        getCoinNum: function () {
            this.$http.get('/video/short-video/coin')
            .then(res => {
                if (res.data.result == 1) {
                    this.coinNum = parseInt(res.data.data);
                } else {
                    console.log(res.data.msg)
                }
            })
        },
    
    }
}
</script>
<style lang="scss" scoped>
    @import '../../assets/scss/function';
    #my-zone{
        $paddingVal: torem(20px);
        $colorWhite: #fff;
        position: relative;
        width: 100vw;
        height: 100%;
        background-color: #f5f5f5;
        overflow: hidden;

        .header-div{
            box-sizing: border-box;
            padding: 0 $paddingVal;
            background-color: $colorWhite;

            .user-info{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                
                height: torem(160px);
                
                
                margin-top: $paddingVal;
                border-bottom: 1px solid #eee;

                .avatar{
                    $avatarW: torem(110px);
                    width: $avatarW;
                    height: $avatarW;
                    border-radius: $avatarW / 2;
                }

                .mid{
                    margin-left: torem(20px);
                    .nickname-div{
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;

                        .nickname-span{
                            font-size: torem(28px);
                            color: #2e2e2e;
                        }

                        .levl{
                            width: torem(66px);
                            height: torem(30px);
                        }

                        .age-div{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: torem(28px);
                            border-radius: torem(5px);
                            padding: torem(1px) torem(8px);
                            margin-left: torem(10px);
                            margin-right: torem(20px);

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

                    .id-div{
                        margin-top: torem(15px);
                        font-size: torem(22px);
                        color: #989898;
                    }
                    
                    
                }
            }
            
            .caifu-lev{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: torem(105px);
                .level-num{
                    font-size: torem(26px);
                    color: #2e2e2e;
                }

                .level-prosess{
                    $h: torem(14px);
                    width: torem(520px);
                    height: $h;
                    border-radius: $h / 2; 
                    background-color: #f5f5f5;

                    .prosess{
                        position: relative;
                        width: 50%;
                        height: 100%;
                        background-color: #ffa800;
                        border-radius: $h / 2;

                        .prosess-num{
                            $ph: torem(32px);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            position: absolute;
                            top: - ($ph + $h / 2);
                            right: - torem(30px);
                            padding: 0 torem(10px);
                            height: $ph;
                            background-color: #ffa800;
                            border-radius: $ph / 2;
                            color: #fff;
                            font-size: torem(20px);
                        } 
                    }
                }
            }

        }
        .main-div{
            box-sizing: border-box;
            padding: 0 torem(20px);
            background-color: $colorWhite;
            margin-top: torem(20px);
            overflow: hidden;

            .coin-div{

                .my-coin-title{
                    font-size: torem(26px);
                    color: #989898;
                    margin-top: torem(60px);
                    margin-bottom: torem(50px);
                }

                .coin-num-div{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: torem(52px);

                    .coin-num{
                        font-size: torem(50px);
                        color: #2e2e2e;
                    }

                    .go-recharge-btn{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: torem(118px);
                        height: torem(54px);
                        background-color: #ffa800;
                        color: #fff;
                        font-size: torem(26px);
                        border-radius: torem(10px);
                        text-decoration: none;
                    }
                }
            }
        }

        .footer-div{
            .bind-phone-btn{
                $w: torem(496px);
                display: flex;
                justify-content: center;
                align-items: center;
                width: $w;
                height: torem(80px);
                border-radius: $w / 2;
                border: 1px solid #ffa800;
                font-size: torem(32px);
                color: #ffa800;
                margin: torem(120px) auto 0;
                text-decoration: none;
            }
        }

        .recharge-div{
            position: fixed;
            top: 0;
            
            left: 0;
            bottom: torem(98px);
            width: 100vw;


            // height: 100%;
            // height: 80%;
            
        }

        #recharge{
            height: auto !important;
        }

        @keyframes slideInUp {
            from {
                transform: translate3d(0, 100%, 0);
                visibility: visible;
            }

            to {
                transform: translate3d(0, 100%, 0);
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
}
</style>
