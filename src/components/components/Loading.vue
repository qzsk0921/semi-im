<template>
    <div id="loading-div">
        <div class="loading-content">
            <img class="loading-gift" src="../../assets/images/index.sandglass-time-loading-gif.svg" alt="">
        </div>
    </div>
</template>
<script>
export default {
    name: 'loading',
    data: function () {
        return {}
    }
}
</script>
<style <style lang="scss" scoped>
@import '../../assets/scss/function';
    #loading-div{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        

        .loading-content{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);

            .loading-gift{
                @include eqWH(torem(80px));
            }
        }

    }

</style>

