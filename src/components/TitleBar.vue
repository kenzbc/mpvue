<template>
    <div class="title-wrap">
        <div class="line" :style="{'background': lineBackground}"></div>
        <div class="title">{{ title }}</div>
        <div class="right" v-show="rightBox"></div>
    </div>
</template>

<script>
  export default {
    props: {
      title: String,
      rightBox: Boolean,
      lineBackground: String
    }
  }
</script>

<style lang="stylus" scoped>
    .title-wrap {
        width: 100%
        height 66rpx
        padding 0 28rpx
        box-shadow: 0 0 0 1rpx #F0F1F2
        .line {
            width: 8rpx
            height: 24rpx
            background: #FFCC60
            float left
            margin-top 20rpx
        }
        .title {
            height 66rpx
            line-height 66rpx
            float left
            font-size 28rpx
            color #2D2F33
            font-weight 600
            margin-left 14rpx
        }
        .right {
            height 66rpx
            line-height 66rpx
            float right
            color #A8ABB3
            font-size 28rpx
            font-weight 400
            span {
                padding 0 14rpx
            }
        }
    }
</style>