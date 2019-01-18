<template>
    <div id="bind-phone" v-show="options.show" @click.stop.prevent="close()">
        <div class="modal-dialog" @click.stop.prevent>
            <p class="title">绑定手机号</p>
            <div class="item phome-num-div">
                <span>手机号</span>
                <input type="text" v-model="phone" placeholder="请输入手机号">
            </div>
            <div class="item auth-code-div">
                <span>验证码</span>
                <input type="text" ref="code" v-model="authCode" placeholder="请输入验证码">
                <a href="javascript:void(0)" class="get-auth-code-btn" 
                :class="{'getting-auth-code': options.gettingAuth}" 
                @click.stop.prevent="getAuthCode()">{{(options.gettingAuth) ? countdown + 's': '获取验证码'}}</a>
            </div>
            <a href="javascript:void(0)" class="comfirm-btn" @click.stop.prevent="comfirm()">确定</a>
        </div>  
        <modal-dialog :options="dailogOptions" @close="showDailog = false" v-if="showDailog"></modal-dialog>  
    </div>
</template>
<script>
import modalDialog from '../components/ModalDialog'
export default {
    name: 'bindPhone',
    props: ['options'],
    components:{modalDialog},
    data: function () {
        return {
            // gettingAuth: false,
            countdown: 60,
            authTxt: '', 
            phone: null,
            authCode: null,
            showDailog: false,
            dailogOptions: {
                content: null
            }
        }
    },
    created: function () {
        // console.log(this.options)
    },
    methods: {
        close: function () {
            this.options.show = false;
            this.$emit('close')
        },
        getAuthCode: function () {
            if (this.$common.checkPhone(this.phone)) {
                this.gettingAuth = true;
                this.countdownFn();
                this.$emit('getAuthCode', this.phone);
            } else {
                this.showDailog = true;
                this.dailogOptions.content = '请输入手机号码';
                return false;
            }
            
        },
        comfirm: function (){
            if (!this.$common.checkPhone(this.phone) || this.authCode == null || this.authCode == '') {
                this.showDailog = true;
                this.dailogOptions.content = '请检查输入的手机号或验证码是否正确';
                return false;
            }
            this.$emit('comfirm', {
                phone: this.phone,
                smscode: this.authCode
            });
        },
        countdownFn: function  () {
            var t = setTimeout(() => {
                if (this.countdown <= 0) {
                    clearTimeout('t');
                    this.gettingAuth = false;
                    return false;
                }
                this.countdown--;
                this.countdownFn();
            },1000)
        }
    }
}
</script>
<style lang="scss" scoped>
    @import "../../assets/scss/function";
    #bind-phone{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        @include eqWH(100%);
        pointer-events: auto;
        background-color: rgba($color: #000000, $alpha: .5);

        a{
            text-decoration: none;
        }

        .modal-dialog{
            box-sizing: border-box;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
            width: torem(640px);
            background-color: #fff;
            border-radius: torem(10px);
            padding: torem(30px) torem(46px);

            .title{
                font-size: torem(32px);
                color: #000;
                text-align: center;
                margin-bottom: torem(40px);
            }

            .item{
                display: flex;
                justify-content: space-between;
                align-items: center;
                

                &>input{
                    box-sizing: border-box;
                    border: 1px solid #cdcdcd;
                    border-radius: torem(8px);
                    height: torem(60px);
                    font-size: torem(26px);
                    padding: 0 torem(20px);

                    &::-webkit-input-placeholder { 
                        color: #c8c8c8; 
                    } 
                }

                &>span{
                    font-size: torem(28px);
                    color: #2e2e2e;
                }
            }

            .phome-num-div{
                margin-bottom: torem(30px);
                &>input{
                    width: torem(434px);
                }
            }

            .auth-code-div{
                &>input{
                    width: torem(230px);
                }

                .get-auth-code-btn{
                    $h: torem(60px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: torem(182px);
                    height: $h;
                    border-radius: $h / 2;
                    background-color: #ffa800; 
                    color: #fff;
                    font-size: torem(26px);
                }

                .getting-auth-code{
                    background-color: #d5d5d5 !important;
                }
            }

            .comfirm-btn{
                $h: torem(78px);
                display: flex;
                justify-content: center;
                align-items: center;
                width: torem(420px);
                height: $h;
                margin: torem(40px) auto 0;
                background-color: #ffa800;
                border-radius: $h / 2;
                font-size: torem(30px);
                color: #fff;
                
            }
        }
    }
</style>
