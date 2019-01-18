<template>
  <div id="index">
    <div class="main-div">
       <!-- 主播列表 -->
        <!-- <live-list></live-list> -->
        <transition 
            name="lightSpeedIn"
            enter-active-class="lightSpeedIn"
            leave-active-class="lightSpeedOut">
            >
            <router-view></router-view>
        </transition>
        <!-- <loading></loading> -->
    </div>
    <bottom-nav class="footer-div"></bottom-nav>
  </div>
</template>
<script>

// const loading = () => import('@/components/components/Loading')
const bottomNav = () => import('@/components/components/BottomNav')
import loading from '@/components/components/Loading'
// import bottomNav from '@/components/components/BottomNav'
export default {
    name: 'index',
    components: { bottomNav,loading},
    data () {
        return {}
    },
    // beforeRouteEnter (to, from, next) {
    //     console.log(to)
    //     next(vm => {
    //         vm.$router.replace({name: to.name, query: {ch: vm.$common.getCh()}})
    //     })
    // },
    created: function () {
        // this.getIMToken();
    },
    mounted: function () {
        // console.log(wx)
        
    },
    methods: {
        // 获取融云 token
        getIMToken: function () {
            this.$http.get('/user/get-im-token')
                .then(res => {
                    if (res.data.result == 1) {
                        this.$common.setLocalStorage('rongcloud_token', res.data.data.rongcloud_token)
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
    #index{
        position: relative;
        width: 100%;
        height: 100%;

        $footerHeight: torem(98px);
        .main-div{
            position: absolute;
            top: 0;
            left: 0;
            // z-index: 1;
            bottom: $footerHeight;
            width: 100%;
            overflow: hidden;
        }

        .footer-div{
            position: absolute;
            bottom: 0;
            left: 0;
            height: $footerHeight;
            width: 100%;
        }


        @keyframes lightSpeedIn {
            from {
                transform: translate3d(100%, 0, 0);
                opacity: 0;
            }

            60% {
                // transform: skewX(20deg);
                opacity: 1;
            }

            80% {
                // transform: skewX(-5deg);
                opacity: 1;
            }

            to {
                transform: none;
                opacity: 1;
            }
        }

        .lightSpeedIn {
            animation-name: lightSpeedIn;
            animation-duration: .3s;
            animation-timing-function: ease-out;
        }


        @keyframes lightSpeedOut {
            from {
                opacity: 1;
            }

            to {
                transform: translate3d(100%, 0, 0);
                opacity: 0;
            }
        }

        .lightSpeedOut {
            animation-name: lightSpeedOut;
            animation-duration: .3s;
            animation-timing-function: ease-in;
        }

    }

    
</style>
