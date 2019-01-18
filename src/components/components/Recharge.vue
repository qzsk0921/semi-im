<template>
    <div id="recharge" @click.stop.prevent="close">
        <div class="recharge-top">选择充值金额</div>
        <div class="recharge-content" v-if="goodsData" @click.stop.prevent>
            <div class="content-item" v-if="i != 2009" :class="{'selected': i == activeSelected}"  v-for="(v,i) in goodsData.list" :key="i" @click="selecte(i, v)">
                <div>
                    <p class="title">{{v.hp_coin_num}}播币</p>
                    <p class="price">{{v.product_price}}元</p>
                </div>
            </div>
            <div class="content-item" v-else :class="{'selected': i == activeSelected}" @click="otherMoneyFn(i, v)">
                <div v-if="!showOtherMoney"  class="others">其他金额</div>
                <div v-else>
                    <p class="title">{{otherCoin}}播币</p>
                    <p class="price">{{otherMoneys}}元</p>
                </div>
            </div>
        </div>
        <div class="recharge-footer">
            <div class="price-des">
                <span class="feiyong">费用 : </span>
                <span class="price">￥{{orderInfo.productPrice}}</span>
            </div>
            <div class="pay-btn" @click="orderGenerate">支付</div>
        </div>
        <div class="other-money-mask" v-show="showInput" @click.stop.prevent="otherMoneyFn" >
            <div class="other-money-input-div" @click.stop.prevent>
                <input type="number" ref="other" v-model="otherMoney"  @click.stop.prevent  v-focus="{'isShow': showInput, 'os': os}"  placeholder="请输入要充值的金额" class="other-money-input">
                <div class="commit-other-money" @click.stop.prevent="changeMoneyToCoin">确定</div>
            </div>
        </div>
    </div>
</template>
<script>
import eventBus from '@/assets/js/bus'

export default {
    name: 'recharge',
    data: function () {
        return {
            activeSelected: null,
            price: 0,
            goodsData: null,
            showInput: false,
            showOtherMoney: false,
            otherMoney: null,
            otherCoin: 0, 
            otherMoneys: 0,
            os: null,
            orderInfo: {
                tradeType: 9,
                payType: 8,
                productId: '',
                productName: '',
                productPrice: '',
            }
        }
    },
    created: function () {
        this.getGoodsList();
        this.os = this.$common.clientType();
    },
    watch: {
        otherMoney: function (n, o) {
            if (this.isint1(n)) {
                return this.otherMoney = n;
            } else {
                return this.otherMoney = o;
            }
        }
    },
    methods: {
        isint1 (s) {
            if ( s.match(/^([1-9]\d{0,3}|[1-4]\d{0,4}||50000)$/) != null) {
                return true;
            } else {
                return false;
            }

        },
        otherMoneyFn: function (i, v) {
            this.showInput = !this.showInput;
        },
        close: function () {
            this.$emit('close', {rechargeShow: false})
        },
        selecte: function (i, v) {
            this.activeSelected = i;
            this.orderInfo.productId = v.product_id;
            this.orderInfo.productName = v.product_name;
            this.orderInfo.productPrice = v.product_price;
        },
        getGoodsList: function () {
            this.$http.get('/mapi/live/get-goods')
                .then(res => {
                    if (res.data.result == 1) {
                         this.goodsData = res.data.data
                         this.selecte(this.goodsData['list'][2000]['product_id'], this.goodsData['list'][2000])
                    } else {
                        console.log(res.data.msg);
                    }
                   
                })
        },
        orderGenerate: function () {
            // this.$emit('rechargeRes', 'get_brand_wcpay_request:fail'); return;
            // console.log(this.orderInfo);return;
            this.$http({
                url: '/mapi/live/order-generate',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'trade_type=' + this.orderInfo.tradeType + '&pay_type=' + this.orderInfo.payType + '&product_id=' + this.orderInfo.productId + '&amount=' + this.orderInfo.productPrice
            })
            .then(res => {
                if (res.data.result == 1) {
                    this.callpay(res.data.data.jsApiParameters)
                } else {
                    console.log(res.data.msg)
                }
                
            })
        },
        //调用微信JS api 支付
        jsApiCall: function (jsApiParameters){
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                jsApiParameters,
                function(res){
                    switch (res.err_msg) {
                        case 'get_brand_wcpay_request:ok': 
                            eventBus.$emit('changeCoin', res.err_msg);
                        break;
                        case 'get_brand_wcpay_request:fail':
                            this.$emit('rechargeRes', res.err_msg)
                            WeixinJSBridge.log(res);
                            console.log(res.err_code+res.err_desc+res.err_msg);    
                        break;

                    }
                }
            );
        },
        callpay: function (jsApiParameters){
            if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(jsApiParameters), false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', this.jsApiCall(jsApiParameters));
                    document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall(jsApiParameters));
                }
            }else{
                this.jsApiCall(jsApiParameters);
            }
        },
        changeMoneyToCoin: function () {
            let otherMoneyVal = this.otherMoney;
            if (otherMoneyVal == '' || otherMoneyVal == null || otherMoneyVal == undefined) {
                return;
            }
            this.otherCoin = parseInt(this.otherMoney) * 10;
            this.otherMoneys = parseInt(this.otherMoney);
            this.selecte(2009, {
                product_id: 2009,
                product_name: '购买' +  this.otherCoin + '播币',
                product_price: this.otherMoneys
            });
            this.showOtherMoney = true;
            this.showInput = false;
        },
        choseOtherMoney: function () {
            this.showInput = true;
        }
    },
    directives: {
        focus: {
            update: function (el, {value}) {
                // console.log(value)
                if (value.isShow) {
                    el.focus();
                    // alert(1)
                    console.log(1)
                    if (value.os == 'ios') {
                        setTimeout(function () {
                        var scrollHeight = document.body.scrollHeight;
                            document.body.scrollTop = scrollHeight;
                            document.body.addEventListener('touchmove', ontouchmove, false);
                            window.keyboadEvent = true;
                        }, 200)
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
     @import "../../assets/scss/function";
    #recharge{
        position: relative;
        background-color: #f5f5f5;
        width: 100%;
        height: 100%;

        .recharge-top{
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: torem(70px);
            padding: 0 torem(30px);
            // background-color: #f5f5f5;
            font-size: torem(26px);
            color: #858585;
        }

        .recharge-content{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            box-sizing: border-box;
            padding: torem(30px) torem(30px) 0;
            background-color: #fff;
            

            .content-item{
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                width: torem(210px);
                height: torem(110px);
                border: 1px solid #cdcdcd;
                border-radius: torem(10px);
                margin-bottom: torem(30px);
                text-align: center;
                font-size: 0;

                .title,.others{
                    // width: 100%;
                    font-size: torem(28px);
                    color: #2e2e2e;
                }

                .price{
                    font-size: torem(24px);
                    color: #989898;
                }

            }

            .selected{
                position: relative;
                border: 1px solid #ffa800;

                &::after{
                    display: inline-block;
                    content: '';
                    width: torem(55px);
                    height: torem(55px);
                    background: url("../../assets/images/pic_select_highlight@2x.png") no-repeat center;
                    background-size: cover;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }
            }
            
        }

        .recharge-footer{
            box-sizing: border-box;
            position: absolute;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: torem(110px);
            background-color: #fff;
            padding-left: torem(30px);

            .price-des{
                .feiyong{
                    font-size: torem(32px);
                    color: #858585;
                }

                .price{
                    font-size: torem(40px);
                    color: #ffa800;
                }
            }

            .pay-btn{
                display: flex;
                justify-content: center;
                align-items: center;
                width: torem(240px);
                height: 100%;
                background-color: #ffa800;
                font-size: torem(32px);
                color: #f5f5f5;
            }
            
        }


        .other-money-mask{
            @include eqWH(100%);
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, .2);

            .other-money-input-div{
                box-sizing: border-box;
                display:  flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: torem(100px);
                position: absolute;
                left: 0;
                bottom: 0;

                background-color: #fff;

                .other-money-input{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: torem(540px);
                    height: torem(64px);
                    background-color: #f5f5f5;
                    border-radius: torem(10px);
                    font-size: torem(28px);
                    color: #2d2d2d;
                    text-align: center;
                    border: none;
                }

                .commit-other-money{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: torem(120px);
                    height: torem(70px);
                    background-color: #ffa800;
                    color: #fff;
                    border-radius: torem(10px);
                    margin-left: torem(20px);
                    font-size: torem(30px);
                }
            }
        }
    }
</style>
