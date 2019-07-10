<template>
    <div>
        <div class="ref-loading" :class="{show: loading}" :style="{background: bgColor}"><img src="/static/images/score_loading.gif" /></div>
    </div>
</template>

<script>
  export default {
    props: {
      loading: Boolean,
      bgColor: {
        type: String,
        default: '#fff'
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .ref-loading {
        width: 100%
        height 40rpx
        padding-top 5rpx
        overflow hidden
        background #fff
        //transition-duration .4s
        //background transparent
        display none
        &.show {
            /*height 40rpx*/
            display block
        }
        img {
            display block
            width 30rpx
            height 30rpx
            margin 0 auto
        }
    }
</style>