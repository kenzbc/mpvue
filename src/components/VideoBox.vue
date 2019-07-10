<template>
   <div class="video-shade" v-show="isShow" :catchtouchmove="true">
       <div class="close flex flex-center-mid" @tap="closeShade"><text class="iconfont icon-quxiao"></text></div>
       <video id="matchVideo" class="video" :autoplay="isShow" :src="videoItem.video_link" :poster="videoItem.image_url"></video>
   </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: {
      videoItem: {
        type: Object,
        default: {},
        videoContext: {}
      },
      isShow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      closeShade () {
        this.videoContext.stop()
        this.$emit('update:isShow', false)
      }
    },
    mounted () {},
    onReady () {
      this.videoContext = wx.createVideoContext('matchVideo')
    },
    onUnload () {
      this.videoContext.stop()
      this.$emit('update:isShow', false)
    }
  }
</script>

<style lang="stylus" scoped>
    .video-shade {
        width 100%
        height 100vh
        background rgba(0,0,0, .95)
        position fixed
        top 0
        left 0
        z-index 99
        .close {
            width 60rpx
            height 60rpx
            position absolute
            top 20rpx
            left 20rpx
            .iconfont {
                font-size 24rpx
                color #fff
            }
        }
        .video {
            height 500rpx
            position absolute
            top 50%
            left 50%
            transform translate(-50%, -50%)
        }
    }
</style>