<template>
    <div>
        <div class="main" v-show="canIUse">
            <div class="header">
                <img class="logo" src="/static/images/score_logo.png" />
                <p class="name"><span>score</span>赛高</p>
            </div>
            <div class="content">
                <p class="row-1">申请获取以下权限</p>
                <p>获得您的公开信息 ( 昵称，头像等 )</p>
            </div>
            <!-- 需要使用 button 来授权登录 -->
            <Auth-set-button />
            <!--<button class="btn" open-type="getUserInfo" @getuserinfo="getUserInfo" type="primary">授权登录</button>-->
        </div>
        <!--<div v-show="!canIUse" style="text-align: center; padding-top: 400rpx; font-size: 32rpx;">请升级微信版本</div>-->
    </div>

</template>

<script>
  import AuthSetButton from '@/components/AuthSet'

  export default {
    components: {
      AuthSetButton
    },
    data () {
      return {
        canIUse: false
      }
    },
    computed: {},
    methods: {},
    mounted () {
      this.canIUse = wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad () {}
  }
</script>

<style lang="stylus" scoped>
    .header {
        padding 120rpx 0 40rpx
        .name {
            padding 20rpx 0
            text-align center
            font-size 36rpx
            font-weight 600
            span {
                font-size 40rpx
            }
        }
        .logo {
            display block
            width 120rpx
            height 120rpx
            margin 0 auto
        }
    }
    .content {
        width 80%
        margin 0 auto
        border-top 1rpx solid #ccc
        font-size 28rpx
        padding-top 80rpx
        padding-bottom 80rpx
        p {
            line-height 80rpx
        }
        .row-1 {
            font-size 36rpx
        }
    }
</style>