<template>
    <div class="red-packet">
        <img class="close-btn" @touchstart="closeRedPacket" src="../../../static/images/common/btn_trend_closed@2x.png" alt="" >
        <div class="packet">
            <scratch-card :options="cratchCardOptions" @scratchDone="openDone" class="scratch-card-div"></scratch-card>
            <p class="red-packet-des" v-show="cratchCardOptions.isOpended == 1">{{popTxt}}</p>

            <div class="opend-res-des-login" v-if="guestLogin == 'false' && cratchCardOptions.isOpended == 0">
                <p class="opend-res-des">{{openPopTxt}}</p>
                <div class="download-btn" @touchstart="download"><span>前往合拍</span> </div>
                <p class="bottom-des">现在登录合拍，还有数十个红包等你来刮！</p>
            </div>
            <div class="opend-res-des-nologin" v-else-if="cratchCardOptions.isOpended == 0">
                <p class="opend-res-des">{{openPopTxt}}</p>
                <input v-if="!hasCommited" class="phone-input" type="number" v-model="phone" placeholder="输入手机号码" />
                <div v-if="!hasCommited" class="download-btn" @touchstart="getRedPacket"><span>立刻领取</span> </div>
                 <div v-else class="download-btn" @touchstart="download"><span>前往合拍</span> </div>
                <p class="bottom-des">现在登录合拍，还有数十个红包等你来刮！</p>
            </div>

        </div>

        <modal-dialog :options="modalOptions" @close="closeModal" v-if="showModal"></modal-dialog>
    </div>
</template>

<script>
const scratchCard = () => import ('@/components/components/ScratchCard')
const modalDialog = () => import ('@/components/components/ModalDialog')

export default {
    name: 'redPacket',
    components: {scratchCard, modalDialog},
    data: function () {
        return {
            cratchCardOptions: {
                bg: '../../../static/images/common/pic_guaguale_open@2x.png',
                fg: '../../../static/images/common/pic_guaguale@2x.png',
                chanceNum: null,
                money: null,
                isOpended: null,
                id: null
            },
            modalOptions:{
                content: null
            },
            anchorId: this.$route.query.u,
            showModal: false,
            phone: null,
            showResDes: null,
            openPopTxt: null,
            popTxt: null,
            hasCommited: 0,
            userId: this.$common.getLocalStorage('user_id'),
            guestLogin: this.$common.getLocalStorage('guestLogin')
        }
    },
    created: function () {
        // this.getRedPacketdetail()
        // console.log(this.guestLogin)
        if (this.guestLogin == 'false') {
            this.getRedPacketdetail()
        } else {
           this.getNoLoginRedPacket()
        //    console.log(1)
        }

        // console.log(this.isLogin, this.opendResDes)
    },
    methods: {
        closeModal: function () {
            this.showModal = false;
        },
        getRedPacket: function () {
            if (this.$common.checkPhone(this.phone)) { /// https://redpacket.quhepai.com
                this.$http.get('https://redpacket.quhepai.com/share/red-packet/handle-commit-h5?mobile=' + this.phone + '&anchor_id=' + this.anchorId, {
                    withCredentials: true
                })
                .then(res => {
                    if (res.data.data.result == 1) {
                        this.hasCommited = 1;
                    }
                    this.modalOptions.content = res.data.data.msg
                    this.showModal = true
                    // console.log(res)
                })
            } else {
                this.modalOptions.content = '请填写正确的手机号码'
                this.showModal = true
            }
        },
        getNoLoginRedPacket: function () {
            this.$http.get('https://redpacket.quhepai.com/share/red-packet/get-red-packet-no-user?anchor_id=' + this.anchorId, {
                withCredentials: true
            })
                .then(res => {
                    if (res.data.result == 1) {
                        let data =  res.data.data
                        // console.log(res)
                        this.$set(this.cratchCardOptions, 'chanceNum', data.redPacketCount)
                        this.$set(this.cratchCardOptions, 'money', data.money)
                        this.$set(this.cratchCardOptions, 'isOpended', data.is_no_open)
                        this.cratchCardOptions.id = data.id
                        this.openPopTxt = data.open_pop_txt
                        this.hasCommited = data.has_commited
                        this.popTxt = data.pop_txt
                    } else {
                        console.log(res.data.msg)
                    }

                })
        },
        download: function () {
            if (window.__wxjs_environment === 'miniprogram') {
                window.location = 'http://quhepai.com/mobile';
            } else {
                window.location = 'http://quhepai.com/mobile/download';
            }

        },
        closeRedPacket: function (){
            this.$emit('close')
        },
        openDone: function () {
            console.log(this.isLogin)
            if (this.guestLogin != 'true') {
                this.$http({
                url: '/user/red-packet/h5-open',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                    data: 'id=' + this.cratchCardOptions.id + '&user_id=' + this.userId
                })
                .then(res => {
                    if (res.data.result == 1) {
                        this.$set(this.cratchCardOptions, 'isOpended', 0)
                    } else {
                        console.log(res)
                    }

                })
            }  else {
                this.$set(this.cratchCardOptions, 'isOpended', 0)
            }


        },
        getRedPacketdetail: function () {
            this.$http.get('/user/red-packet/get-h5-packet?user_id=' + this.userId + '&anchor_id=' + this.anchorId)
                .then(res => {
                    if (res.data.result == 1) {
                        let data =  res.data.data
                        // console.log(res)
                        this.$set(this.cratchCardOptions, 'chanceNum', data.redPacketCount)
                        this.$set(this.cratchCardOptions, 'money', data.money)
                        this.$set(this.cratchCardOptions, 'isOpended', data.is_first)
                        this.cratchCardOptions.id = data.id
                        this.openPopTxt = data.open_pop_txt
                        this.popTxt = data.pop_txt
                    } else {
                        console.log(res.data.msg)
                    }

                })
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../../assets/scss/function';
    .red-packet{
        background: url('../../../static/images/common/pic_bg_huodong@2x.png') no-repeat center;
        background-size: cover;
        height: 100%;
        width: 100%;
        overflow: hidden;

        .close-btn{
            @include eqWH (torem(78px));
            position: absolute;
            right: torem(20px);
            top: torem(40px);
        }

        .packet{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: torem(638px);
            background: url('../../../static/images/common/pic_bg1@2x.png') no-repeat center;
            background-size: cover;

            .scratch-card-div{
                $h: torem(422px);
                $w: torem(694px);
                position: absolute;
                top: - torem(320px);
                left: 50%;
                transform: translate3d(-50%, 0, 0);
                // margin: torem(270px) auto 0;
                width: $w;
                height: $h;
            }

            .red-packet-des{
                box-sizing: border-box;
                font-size: torem(36px);
                color: #ffdc3d;
                text-align: center;
                padding: 0 torem(38px);
                margin: torem(300px) auto;
            }

            .opend-res-des-login, .opend-res-des-nologin{
                margin: torem(270px) auto 0;
                line-height: torem(62px);

                .opend-res-des{
                    color: #ffdc3d;
                    font-size: torem(36px);
                    text-align: center;
                }



                .download-btn{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: torem(260px);
                    height: torem(71px);
                    background: url('../../../static/images/common/btn_h5_hongbao_button@2x.png') center no-repeat;
                    background-size: 100%;
                    font-size: torem(36px);
                    color: #a11414;
                    line-height: 100%;
                    margin: torem(55px) auto 0;
                }


            }

            .opend-res-des-nologin {
                margin: torem(230px) auto 0;
                line-height: torem(62px);
                .phone-input {
                    display: block;
                    width: torem(454px);
                    height: torem(70px);
                    box-sizing: border-box;
                    border-radius: torem(5px);
                    padding-left: torem(24px);
                    border: none;
                    margin:  torem(50px) auto 0;
                    font-size: torem(32px);
                    color: #2e2e2e;

                    @include placeholder (#989898);
                }

                .download-btn{
                    margin: torem(40px) auto 0;
                }
            }

            .bottom-des{
                font-size: torem(32px);
                color: #fff;
                text-align: center;
                margin-top: torem(36px);
            }


        }



    }
</style>
