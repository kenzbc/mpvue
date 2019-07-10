<template>
    <div>
        <div class="loading" :class="{show: loading}"><img src="/static/images/score_loading.gif" /></div>
    </div>
</template>

<script>
  export default {
    props: {
      loading: Boolean
    }
  }
</script>

<style lang="stylus" scoped>
    .loading {
        width: 100%
        height: 100vh
        overflow hidden
        background #fff
        position fixed
        top 0
        left 0
        z-index 999
        display none
        &.show {
            display -webkit-flex
            display flex
            align-items center
            justify-content center
        }
        img {
            display block
            width 60rpx
            height 60rpx
        }
    }
</style>