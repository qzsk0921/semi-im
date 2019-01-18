<!-- <template>
    <div id="auth">loading 》》》》》》》》》》》》》》》</div>
</template>
<script>
export default {
    name: 'auth',
    data: function () {
        return {
            
        }
    },
    created: function () {
        
        
    },
    methods: {
        auth: function () {
            let params = this.$route.query;
            if (params.state) {
                this.$http({
                    url: '/user/token',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'user_id=' + params.user_id
                })
                .then((res) => {
                    if (res.data.result == 1) {
                       let toUrl =  common.getLocalStorage('toUrl');
                       common.setLocalStorage('userInfo', JSON.stringify(res.data.data));
                       common.setLocalStorage('isLogin', true);
                       this.$route.push({path: toUrl});
                    } else {
                        console.error(res.data.msg);
                    }
                })
            } else {
                console.log('params is undefined')
            }
        }
    },
    beforeRouteEnter (to, from, next) {
         console.log(this)
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当守卫执行前，组件实例还没被创建
    },
    beforeRouteUpdate (to, from, next) {
        console.log(2)
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
</script>
<style lang="scss" scoped>

</style> -->
