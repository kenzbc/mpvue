<template>
    <div class="pop-layer" v-show="member.is_standard == '0' && isShowClubTestModal">
        <div class="dialog-club-test">
            <div class="result before-box">
                <div class="title">Score社区行为规范考试</div>
                <p>欢迎参加社区行为规范考试。</p>
                <p>答对5题即视为通过，</p>
                <p>通过后即可参与社区互动！</p>
                <div class="bttn after" @click="futureTest">以后再考</div>
                <div class="bttn start" @click="startTest">开始考试</div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  export default {
    data () {},
    props: {},
    computed: {
      ...mapState(['member', 'isShowClubTestModal'])
    },
    methods: {
      ...mapMutations(['setShowClubTestModal']),
      futureTest () {
        this.setShowClubTestModal(0)
      },
      startTest () {
        this.clubTest(this.member.f_token || '', this.member.member_id || '')
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .pop-layer {
        width 100%
        height 100vh
        position fixed
        top 0
        left 0
        background rgba(0,0,0, .6)
        z-index 999
    }
    .dialog-club-test {
        position: absolute
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 80%;
        height: 760rpx;
        background: #fff;
        box-shadow: 0 4rpx 8rpx 0 rgba(0,0,0,0.02), 0px 1px 0px 0px rgba(0,0,0,0.03);
        border-radius: 16rpx;
        padding-top: 80rpx;
        text-align: center;
        .title {
            width 100%
            line-height 80rpx
            font-size 40rpx
            font-weight 600
            text-align center
            margin-bottom 50rpx
        }
        p {
            width 80%
            text-align center
            line-height 2em
            color #656973
            font-size 32rpx
            font-weight 400
            margin 0 auto
        }
        .bttn {
            width 70%
            height 80rpx
            line-height 80rpx
            border-radius 40rpx
            color #fff
            font-size 30rpx
            font-weight 600
            cursor pointer
        }
        .after {
            background #fff
            color #0D8DFC
            margin 60rpx auto 0
            border 2rpx solid #0D8DFC
            line-height 78rpx
        }
        .start {
            background #0D8DFC
            margin 40rpx auto 0
        }
    }
</style>