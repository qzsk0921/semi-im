<template>
    <div class="scratch-card" ref="scratchcard">
        <div class="bg-div" v-show="initReady" :style="bgStyle">
            <div class="result-des">
                <p class="prise">￥{{options.money}}</p>
                <p class="congratulation-des">恭喜您!</p>
            </div>
        </div>
        <canvas v-show="showCanvas" :style="cavasStyle" ref="redcanvas" id="red-packet"></canvas>
         <div class="fg-div" v-show="showFg && initReady && options.isOpended" >
             <div>
                <p class="scratch-des">刮一下 试一下</p>
                <p class="chance">您还有<span class="chance-num">{{options.chanceNum}}</span>次机会</p>
             </div>
            
        </div>
    </div>
</template>

<script>
    export default {
        name: 'scratchCard',
        props: ['options'],
        data: function () {
            return {
                showCanvas: false,
                cavasStyle: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                },
                bgStyle: {
                    width: '100%',
                    height: '100%',
                    background: 'url('+ this.options.bg +') no-repeat center',
                    backgroundSize: '100%',
                },
                drawing: false,   // 是否在
                ratio: .1,
                radius: 30,
                fg: this.options.fg,
                showFg: true,
                initReady: false ,
            }
        },
        mounted: function () {
            // this.init()
        },
        watch: {
            'options.isOpended': function (n, o) {
                if (n) {
                    this.init()
                    // console.log(1)
                } else {
                    this.initReady = true;
                }
            }
        },
        methods: {
            closeFg: function () {
                this.showFg = false;
            },
            init: function () {
               
                let _this = this;
                let canvas = _this.$refs.redcanvas
                let cWidth = _this.$refs.scratchcard.offsetWidth
                let cHeight = _this.$refs.scratchcard.offsetHeight
                // 设置canvas 宽高
                canvas.width = cWidth
                canvas.height = cHeight
                // console.log(cWidth, cHeight)

                // 获取canvas上下文
                let context = canvas.getContext('2d')
                let drawing = false;

                let radius = _this.radius;      //线宽
                let fgImg = new Image()
                fgImg.src = _this.fg

                fgImg.onload = function () {
                    context.drawImage(fgImg, 0, 0, cWidth, cHeight)
                    _this.initReady = true;
                    // _this.fillText(context, 'hell0', cWidth / 2 , 100)
                    _this.showCanvas = true;
                    context.lineWidth = radius;
                    context.lineCap = "round";
                    context.lineJoin = "round";
                    context.globalCompositeOperation = 'destination-out' // "destination-out";
                }
                // 兼容 pc
                let hastouch = "ontouchstart" in window ? true : false,
                tapstart = hastouch ? "touchstart" : "mousedown",
                tapmove = hastouch ? "touchmove" : "mousemove",
                tapend = hastouch ? "touchend" : "mouseup";

                canvas.addEventListener(tapstart, function (e) {
                    e.preventDefault();
                    _this.closeFg();
                    var first = _this.getBoundingClientRect(canvas, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                    // console.log(first)
                    context.save();
                    context.beginPath();
                    //   context.moveTo(first.x, first.y);
                    drawing = true;
                })

                canvas.addEventListener(tapmove, function (e) {
                    e.preventDefault();
                    if(drawing){
                        var move = _this.getBoundingClientRect(canvas, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                        context.save();
                        context.lineTo(move.x, move.y);
                        context.stroke()
                        context.restore()
                    }
                })

                canvas.addEventListener(tapend, function (e) {
                    e.preventDefault();
                    drawing = false;
                    var pixels = context.getImageData(0, 0, cWidth, cHeight);
                    var transPixels = [];
                    _this._forEach(pixels.data, function(item, i) {
                        var pixel = pixels.data[i + 3];
                        if (pixel === 0) {
                            transPixels.push(pixel);
                        }
                    });

                    if (transPixels.length / pixels.data.length > _this.ratio) {
                        _this.clearRect(context, 0, 0, cWidth, cHeight);
                        _this.$emit('scratchDone')
                    }
                })
            },
            clearRect: function (context, x, y, w, h) {
                context.clearRect(0, 0, w, h);
            },
            fillText: function (context, text, x, y) {
                // context.beginPath();
                context.textAlign= "center";
                context.font = "48px normol";
                context.fillText(text, x, y);
                // context.closePath()
            },
            _forEach: function (items, callback) {
                return Array.prototype.forEach.call(items, function(item, idx) {
                    callback(item, idx);
                });
            },
            getBoundingClientRect: function (canvas, x, y){
                var box = canvas.getBoundingClientRect();    //获取canvas的距离浏览器视窗的上下左右距离
                return {
                    x: x - box.left,
                    y: y - box.top
                }
            },
            noScroll: function () {
                let bodyStyle = document.body.style;
                bodyStyle.mozUserSelect = 'none';
                bodyStyle.webkitUserSelect = 'none';
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/scss/function';
    .scratch-card{
        position: relative;
        .bg-div{
            display: flex;
            justify-content: center;
            align-items: center;
            .result-des{
                $resColor: #b01308;
                $lineHeight: 100%;
                .prise{
                    font-size: torem(106px);
                    color: $resColor;
                    line-height: $lineHeight;
                    text-align: center;
                }

                .congratulation-des{
                    font-size: torem(36px);
                    color: $resColor;
                    line-height: $lineHeight;
                    text-align: center;
                    margin-top: torem(36px);
                }
            }
        }

        .fg-div{
            $fcolor: #ffea00;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            @include eqWH(100%);
            transition: all .1s;
            
            color: $fcolor;
            text-align: center;

            .scratch-des, .chance{
                font-size: torem(38px);
                line-height: 100%;
            }

            .chance{
                font-size: torem(32px);
                margin-top: torem(60px);
                .chance-num{
                    display: inline-block;
                    font-size: torem(60px);
                    margin: 0 torem(14px);
                    vertical-align: top;
                }
            }
        }
    }
</style>
