<template>
    <div style="width: 100%;">
        <!-- 需要使用 button 来授权登录 -->
        <button class="set-btn" open-type="getUserInfo" @getuserinfo="getUserInfo" type="primary">授权登录</button>
    </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data () {},
    methods: {
      ...mapActions(['getUserInfo'])
    },
    mounted () {}
  }
</script>

<style lang="stylus" scoped>
    .set-btn {
        width 80%
    }
</style>