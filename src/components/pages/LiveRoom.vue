<template>
    <div id="live-room">
        <live v-if="status == 1 && liveRoomData" :options="liveRoomData" @close="closeLive"></live>
        <live-over v-else-if="status == 0 && liveRoomData" :options="liveRoomData" @close="closeLive"></live-over>
        <!-- loading -->
        <loading v-if="loading" class="loading-div"></loading>
        <div>{{messg}}</div>
    </div>
</template>

<script>
// const live = () => import ('@/components/components/Live')

const liveOver = () => import ('@/components/components/LiveOver')

import loading from '@/components/components/Loading';
import eventBus from '@/assets/js/bus'
import live from '@/components/components/Live'

export default {
    name: 'liveRoom',
    components: {live, liveOver, loading},
    data: function () {
        return {
            status: '0',
            queryParms: this.$route.query,
            liveRoomData: null,
            loading: true,      // loading
            history: null,
            miniprogram: false,
            messg: ''
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.history = from.name;
        })
	},
    created: function () {
        this.getLiveRoomDetail()
        eventBus.$on('closeLiveRoom', () => {
            this.status = '0'
        })

    },
    methods: {
        closeLive: function () {
            if (window.__wxjs_environment === 'miniprogram') {
                wx.miniProgram.navigateBack({delta: 1});
            } else {
                let name;
                if (this.history) {
                    name = this.history
                } else {
                    name = 'live-focus'
                }
                this.$router.push({
                    name: name
                })
            }
        },
        getLiveRoomDetail() {   // 直播间详情信息 H5_s_test
            this.$http.get('/live/live/detail?live_room_id=' + this.queryParms['l'])
                .then((res) => {
                    if (res.data.result != 0) {
                        let resData =  res.data.data;
                        this.status = resData.status
                        this.liveRoomData = resData
                        this.loading = false
                    }
                })
        },
    }
}
</script>

<style lang="scss" scoped>

    #live-room{
        width: 100%;
        height: 100%;
        .loading-div{
            z-index: 10;
        }
    }

</style>
