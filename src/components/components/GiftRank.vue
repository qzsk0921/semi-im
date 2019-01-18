<template>
    <div id="gift-rank-wrap">
        <div class="gift-rank-div">
            <template>
                <swiper :options="swiperOption" ref="mySwiper">
                    <!-- slides -->
                    <swiper-slide  v-for="(v , i) in giftRankData.users" :key="i" >
                         <div class="rank-item-div"
                        :style="{background:'url('+ v.portrait +'!S1) center no-repeat'}">
                        </div>
                        <div class="ex-span" :class="{'one': i == 0, 'two': i == 1, 'three': i == 2}">{{v.currExpStr}}</div>
                    </swiper-slide>
                </swiper>
            </template>
        </div> 
    </div>
</template>
<script>
export default {
    name: 'giftRank',
    props: ['giftRankData'],
    data: function () {
        return {
            swiperOption: {
                pagination: '.swiper-pagination',
                slidesPerView: 3.5,
                paginationClickable: true,
                // spaceBetween: 30,
                freeMode: true
            }
        }
    },
    created: function () {},
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    }
}
</script>
<style lang="scss" scoped>
     @import "../../assets/scss/function";
    #gift-rank-wrap{
        $h: torem(70px);
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;

        // ::-webkit-scrollbar {
        //     width: 0px;
        //     height: 0px;
        // }
        // ::-webkit-scrollbar-thumb {
        //     border-radius: 5px;
        //     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        //     background: rgba(0, 0, 0, 0.2);
        // } 
       
        .gift-rank-div{
            display: flex;


            // width: $w;
            width: torem(284px);
            height: $h;
            
            .rank-item-div{
                $w: torem(60px);
                @include eqWH($w);
                border-radius: $w / 2;
                margin: 0 torem(10px);
                background-size: cover !important;
            }

            .ex-span{
                $w: torem(50px);
                position: absolute;
                bottom: 0;
                z-index: 1;
                left: 50%;
                width: $w; 
                display: flex;
                justify-content: center;
                align-items: center;
                height: torem(24px);
                transform: translate3d(-50%, 0, 0);
                // background-color: rgba(0, 0, 0, .5);
                background-color: rgba(46, 46, 46, .8);
                
                font-size: torem(16px);
                border-radius:  $w / 2;
                color: #fff;
            }

            .one{
                background-color: rgba($color: #fdc94b, $alpha: .8);
            }

            .two{
                background-color: rgba($color: #bdbdbd, $alpha: .8);

            }

            .three{
                background-color: rgba($color: #c08f50, $alpha: .8);
                opacity: .8;
            }


            
        }


        .swiper-container {
            width: torem(284px);
            height: $h;
            // margin: 20px auto;
        }
        .swiper-slide {
            position: relative;
            text-align: center;
            margin-right: 0 !important;
            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            -webkit-align-items: center;
            align-items: center;
        }
    }
</style>
