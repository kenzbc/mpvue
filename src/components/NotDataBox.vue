<template>
    <div class="not-box flex-center-mid" v-if="isShow" :style="{width: width, height: height}">
        <div class="content">
            <img src="/static/images/null.png" mode="widthFix" />
            <div class="text">空空如也</div>
        </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      },
      isShow: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .not-box {
        .content {
            width 30%
        }
        img {
            display block
            width 100%
        }
        .text {
            text-align center
            margin-top 20rpx
            font-size 26rpx
            color #A8ABB3
        }
    }
</style>