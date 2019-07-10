<template>
    <div class="tab-video" v-show="tabIndex == 4">
        <VideoList videoTypeStr="比赛回放" :listData="videoData.bo_list" @showVideo="showVideoShade" />
        <VideoList videoTypeStr="精彩集锦" :listData="videoData.nobo_list" @showVideo="showVideoShade" />
        <VideoBox :isShow="isShowVideo" :videoItem="videoItem" v-on:update:isShow="isShowVideo = $event" />
        <NotDataBox :isShow="isShowNotBox" width="100%" height="calc(100vh - 432rpx)" />
    </div>
</template>

<script>
  // import Api from '@/http/api'
  // import { mapState, mapActions } from 'vuex'
  import VideoList from './VideoList'
  import VideoBox from './VideoBox'
  import NotDataBox from './NotDataBox'

  export default {
    components: {
      VideoList,
      VideoBox,
      NotDataBox
    },
    data () {
      return {
        isShowVideo: false,
        videoItem: {},
        videoType: ''
      }
    },
    props: {
      mid: {
        type: String,
        default: ''
      },
      videoData: {
        type: Object,
        default: {}
      },
      tabIndex: {
        type: Number,
        default: -1
      }
    },
    computed: {
      // ...mapState(['member'])
      isShowNotBox () {
        if ((this.videoData.bo_list && this.videoData.bo_list.length > 0) || (this.videoData.nobo_list && this.videoData.nobo_list.length > 0)) return false
        return true
      }
    },
    methods: {
      // ...mapActions(['getSetting', 'getUserInfo', 'login'])
      showVideoShade (item) {
        this.videoItem = item
        if (item.video_link.indexOf('famulei.com') !== -1) {
          this.isShowVideo = true
        } else {
          this.$router.push({path: '/pages/webView/main', query: { src: encodeURIComponent(item.video_link) }})
        }
      }
    },
    mounted () {}
  }
</script>

<style lang="stylus" scoped>
    .tab-video {
        background #fff
        width 100%
        min-height calc(100vh - 412rpx - 20rpx)
    }
</style>