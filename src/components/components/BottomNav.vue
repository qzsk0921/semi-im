<template>
    <div id="bottom-nav">
        <div class="nav-item">
            <router-link class="item focus" :to="{name: 'focus-list'}" active-class="nav-active-focus"></router-link>
        </div>
        <div class="nav-item">
            <router-link class="item live" :to="{name: 'live-list'}" active-class="nav-active-live"></router-link>
        </div>
        <div class="nav-item">
             <router-link class="item my" :to="{name: 'my-zone'}" active-class="nav-active-my"></router-link>
        </div>
        
    </div>
</template>
<script>
export default {
    name: 'bottomNav',
    data: function () {
        return {}
    }
}
</script>
<style lang="scss" scoped>
    @import '../../assets/scss/function';
    #bottom-nav{
        display: flex;
        justify-content: space-around;
        height: 100%;
        border-top: 1px solid #eee;
        box-shadow: 0 torem(5px) torem(20px) #000;
        background-color: #fff;
        
        .nav-item{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100 / 3 * 1%;
            text-decoration: none;
            font-size: torem(29px);
            color: #2d2d2d;

            .item{
                $w: torem(50px);
                @include eqWH($w);
            }

             .focus{
                background: url('../../assets/images/btn_h5_attention_nor@2x.png') no-repeat center;
                background-size: 100%;
            }

            .nav-active-focus{
                background: url('../../assets/images/btn_h5_attention_highlight@2x.png') no-repeat center;
                background-size: 100%;
            }

             .live{
                background: url('../../assets/images/btn_h5_shouye_nor@2x.png') no-repeat center;
                background-size: 100%;
            }

            .nav-active-live{
                background: url('../../assets/images/btn_h5_shouye_highlight@2x.png') no-repeat center;
                background-size: 100%;
            }

            .my{
                background: url('../../assets/images/btn_h5_person_nor@2x.png') no-repeat center;
                background-size: 100%;
            }

            .nav-active-my{
                background: url('../../assets/images/btn_h5_person_highlight@2x.png') no-repeat center;
                background-size: 100%;
            }
        }

        .nav-active{
            background-color: #aa9898;
        }
    }
</style>
