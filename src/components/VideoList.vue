<template>
    <div class="video-box" v-if="listData.length">
        <TitleBar :title="videoTypeStr" :rightBox="false" lineBackground="#0D8DFC" />
        <div class="video-list flex">
            <div class="video-item" v-for="(item, index) in listData" :key="index" @tap="showVideo(item)">
                <div class="video-bg flex" :style="{backgroundImage: 'url(' + (item.image_url || 'https://img1.famulei.com/active/wx_share/default_score.png') + ')'}">
                    <img class="play-icon" src="/static/images/video_icon.png" mode="widthFix" />
                </div>
                <div class="title">{{item.title}}</div>
            </div>
        </div>
    </div>
</template>

<script>
  import TitleBar from './TitleBar'

  export default {
    components: {
      TitleBar
    },
    data () {},
    props: {
      videoTypeStr: {
        type: String,
        default: ''
      },
      listData: {
        type: Array,
        default: []
      },
      videoType: String
    },
    computed: {
    },
    methods: {
      showVideo (item) {
        this.$emit('showVideo', item)
      }
    },
    mounted () {}
  }
</script>

<style lang="stylus" scoped>
    .video-list {
        padding 10rpx 28rpx 28rpx
        justify-content space-between
        flex-wrap wrap
        .video-item {
            width 49%
            margin-top 20rpx
            .video-bg {
                width 100%
                height 240rpx
                background-repeat no-repeat
                background-position center
                background-size cover
                border-radius 8rpx
                align-items center
                justify-content center
            }
            .play-icon {
                width 60rpx
                height 60rpx

            }
            .title {
                font-size 24rpx
                margin-top 10rpx
                height 64rpx
                overflow hidden
            }
        }
    }
</style>