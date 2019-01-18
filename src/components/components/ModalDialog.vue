<template>
    <div id="modal-dialog">
        <div class="modal-dialog-one">
            <p class="content">{{content}}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'modalDialog',
    props: ['options'],
    data: function () {
        return {
            content: this.options.content
        }
    },
    created: function () {
        this.close();
        // console.log(this.options)
    },
    methods:  {
        close: function () {
            let t = setTimeout(() => {
                this.$emit('close', false);
                clearTimeout(t);
            }, 2000)    
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/function';
    #modal-dialog{
        .modal-dialog-one{
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 9;
            max-width: torem(500px);
            box-sizing: border-box;
            padding: torem(5px) torem(20px);
            border-radius: 10px;
            background-color: rgba($color: #000000, $alpha: .5);
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translate(-50%, -50%);
            .content{
                font-size: torem(24px);
                color: #fff;
            }
        }
    }
</style>
