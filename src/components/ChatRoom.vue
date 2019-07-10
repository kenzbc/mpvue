<template>
    <div class="scroll-wrap">
        <scroll-view class="scroll" scroll-y bindscrolltoupper="upper" bindscrolltolower="lower">
            <div class="live-item" v-for="(item, index) in liveList" :key="index">
                <div class="avatar">
                    <img class="avatar-img" :src="item.avatar || '/static/images/default_avatar.jpg'" />
                    <img class="sign-icon" src="/static/images/v.png" v-if="chatData.roomType === 'chat' && item.member_type === '1'" />
                    <img class="sign-icon" src="/static/images/staff.png" v-if="chatData.roomType === 'chat' && item.member_type === '2'" />
                    <div class="sign" v-if="chatData.roomType === 'live'">直播君</div>
                </div>
                <div class="comment-info">
                    <div class="c-username">{{ item.nickname || '' }}</div>
                    <div class="content">
                        <img v-if="item.picture[0]" :src="item.picture[0].image_url5" mode="widthFix" />
                        <div class="text" v-if="item.content" :class="{mt: item.picture[0]}">{{item.content}}</div>
                    </div>
                </div>
            </div>
        </scroll-view>
    </div>
</template>

<script>
  export default {
    props: {
      liveData: Object,
      chatData: {
        type: Object,
        default () {
          return {}
        }
      },
      firstPageKey: String,
      list: Array
    },
    computed: {
      liveList () {
        return this.list
      }
    },
    mounted () {
      console.log(this.list)
    }
  }
</script>

<style lang="stylus" scoped>
    .scroll-wrap {
        height 100%
    }
    .scroll {
        height 100%
        .live-item {
            padding 24rpx 28rpx

            .avatar {
                width 72rpx
                height 72rpx
                position relative
                float left
                .avatar-img {
                    width: 100%
                    height: 100%
                    border-radius 50%
                }
                .sign-icon {
                    width 30rpx
                    height 30rpx
                    position absolute
                    right -2rpx
                    bottom -2rpx
                }
                .sign {
                    width: 100%
                    height: 28rpx;
                    background: linear-gradient(135deg,rgba(13,126,255,1) 0%,rgba(15,151,255,1) 100%);
                    border-radius: 14rpx;
                    text-align center
                    line-height 28rpx
                    position absolute
                    bottom -14rpx
                    font-size 18rpx
                    color #fff
                }
            }
            .comment-info {
                margin-left 90rpx
                .c-username {
                    height 44rpx
                    line-height 44rpx
                    font-size 32rpx
                    font-weight 600
                }
                .content {
                    width 80%
                    font-size 32rpx
                    font-weight 400
                    line-height 52rpx
                    text-align justify
                    margin-top 12rpx
                    color #2D2F33
                    background #0D8DFC
                    border-radius 16rpx
                    overflow hidden
                    padding 20rpx
                    img {
                        width: 100%
                        display block
                        border-radius 16rpx
                    }
                    .text {
                        width 100%
                        font-size 30rpx
                        line-height 44rpx
                        font-weight 400
                        color #fff
                        text-align justify
                        &.mt {
                            margin-top 16rpx
                        }
                    }
                }
            }
        }
    }
</style>