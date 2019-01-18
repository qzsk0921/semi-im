<template>
    <div class="login-dailog">
        <transition
            name="bounceIn"
            enter-active-class="bounceIn"
            leave-active-class="bounceOut"
            >
            <div class="dailog-content" v-show="show">
                <div class="content">请先登录哦</div>
                <div class="footer">
                    <a href="javascript:void(0)" class="btn cancel-btn" @click.stop.prevent="close">取消</a>
                    <a href="javascript:void(0)" class="btn confirm-btn" @click.stop.prevent="confirm">去登陆</a>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'loginDailog',
    data: function () {
        return {
            show: false
        }
    },
    methods: {
        close: function () {
            this.$emit('close')
        },
        confirm: function () {
            this.$emit('confirm')
        }

    },
    mounted: function (){
        this.show = true;
    }

}
</script>

<style lang="scss" scoped>
    @import '../../assets/scss/function';
    .login-dailog{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100%;
        height: 100%;
        background-color: rgba($color: #000, $alpha: .2);

        .dailog-content{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
            width: torem(640px);
            border-radius: torem(10px);
            background-color: #fff;

            .content{
                text-align: center;
                color: #2e2e2e;
                font-size: torem(28px);
                margin-top: torem(85px);
                margin-bottom: torem(85px);
                transform-origin: 50% 50%;
            }

            .footer{
                display: flex;
                justify-content: space-around;
                margin-bottom: torem(30px);

                .btn{
                    $w: torem(284px);
                    $h: torem(80px);
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: $w;
                    height: $h;
                    font-size: torem(30px);
                    border-radius: $h / 2;
                    text-decoration: none;
                    
                }

                .cancel-btn{
                    color: #000;
                    border: 1px solid #cdcdcd;
                }

                .confirm-btn{
                    color: #fff;
                    background-color: #000;
                }
            }
        }

         @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: translate3d(-50%, -50%, 0) scale3d(0, 0, 0);
                animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            }

            100% {
                opacity: 1;
;
                transform:  translate3d(-50%, -50%, 0) scale3d(1, 1, 1);
            }

        }

        .bounceIn {
            animation-duration: .3s;
            animation-name: bounceIn;
        }



        @keyframes bounceOut {
            0% {
                 opacity: 1;
                transform:  translate3d(-50%, -50%, 0) scale3d(1, 1, 1);
                animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        
            }
            100% {
                opacity: 0;
                transform: translate3d(-50%, -50%, 0) scale3d(0, 0, 0);
                
            }
        }

        .bounceOut {
            animation-duration: .3s;
            animation-name: bounceOut;
        }
    }
</style>
