<template>
    <div>
        <div class="comment-send-wrap">
            <div class="top-box">回复<span>{{ name }} :</span></div>
            <div class="bottom-box flex">
                <input class="ipt" type="text" @confirm="commitMessage" @input="getIptValue" :value="iptMessages" :focus="false" confirm-type="send" :cursor-spacing="80" :placeholder="placeholder" placeholder-style="color: #D2D4D9" />
                <div class="btn-wrap">
                    <!--<button class="btn cancel" @tap="controlCommentBox">取消</button>-->
                    <button class="btn send" @tap="commitMessage">发送</button>
                </div>
            </div>
        </div>
        <ClubTest />
        <auth-set-modal :show="isShowAuthSetModal" />
    </div>
</template>

<script>
  import Api from '@/http/api'
  import ClubTest from '@/components/ClubTest'
  import AuthSetModal from '@/components/AuthSetModal'
  import { mapState, mapMutations } from 'vuex'

  export default {
    components: {
      ClubTest,
      AuthSetModal
    },
    data () {
      return {
        iptMessages: ''
      }
    },
    props: {
      name: {
        type: String,
        default: ''
      },
      ctype: {
        type: Number,
        default: 0
      },
      rid: {
        type: String,
        default: ''
      },
      rrid: {
        type: String,
        default: ''
      },
      did: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapState(['member', 'isLogin', 'isShowAuthSetModal', 'isShowClubTestModal']),
      placeholder () {
        return this.name === '楼主' ? '回复楼主' : '@' + this.name
      }
    },
    watch: {
      isShowClubTestModal (newValue) {
        if (!newValue) {
          this.setShowVideo(1)
        }
      }
    },
    methods: {
      ...mapMutations(['setShowVideo', 'setShowAuthSetModal', 'setShowClubTestModal']),
      init () {
        this.iptMessages = ''
        this.setShowClubTestModal(0)
      },
      // 发送评论
      commitMessage (e) {
        if (!this.isLogin) {
          this.setShowAuthSetModal(1)
          this.setShowVideo(0)
        } else {
          if (this.member.is_standard != '1') {
            this.setShowClubTestModal(1)
            this.setShowVideo(0)
          } else {
            this.setShowClubTestModal(0)
            if (this.iptMessages) {
              let params = {
                member_id: this.member.member_id || '',
                token: this.member.f_token || '',
                dynamic_id: this.did,
                content_html: this.ctype === 3 ? '回复 ' + this.name + ' : ' + this.iptMessages : this.iptMessages,
                reply_id: this.rid,
                reply_reply_id: this.rrid
              }
              Api.ajax('POST', '/services/dynamic/dynamic_comment_insert.php', params).then(resp => {
                if (resp.code === '200') {
                  this.$emit('updateComment')
                  this.iptMessages = ''
                }
                wx.showToast({title: resp.message, duration: 800, mask: true})
              })
            } else {
              wx.showToast({title: '说点什么吧', duration: 800, mask: true})
            }
          }
        }
      },
      getIptValue (e) {
        this.iptMessages = e.target.value
      },
      // 评论框状态
      controlCommentBox () {
        this.iptMessages = ''
      },
      mounted () {
        this.init()
      },
      onUnload () {
        this.iptMessages = ''
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .comment-send-wrap {
        width 100%
        height 154rpx
        position fixed
        bottom 0
        background #fff
        border-top 1rpx solid #F0F1F2
        background #fff
        z-index 8
        .top-box {
            width 100%
            height 64rpx
            line-height 64rpx
            font-size 24rpx
            color #A8ABB3
            font-weight 400
            padding-left 24rpx
            span {
                color #4B9CE3
                margin-left 10rpx
            }
        }
        .bottom-box {
            align-items center
            justify-content space-between
        }
        padding-left 28rpx
        padding-right 18rpx
        .ipt {
            display block
            /*width 86%*/
            width 73%
            height 72rpx
            /*margin 0 auto*/
            background #F7F8FA
            border-radius 36rpx
            line-height 72rpx
            color #656973
            font-size 32rpx
            font-weight 400
            padding-left 36rpx
        }
        .btn-wrap {
            /*display flex*/
            /*display -webkit-flex*/
            /*justify-content space-between*/
            /*align-items center*/
            /*margin-top 20rpx*/
            padding 0 10rpx
            .btn {
                width 120rpx
                height 60rpx
                line-height 60rpx
                text-align center
                font-size 28rpx
                color #656973
                border none
                outline none
                background-color #fff
                margin 0
                &:after {
                    border none
                }
                &.cancel {
                    display none
                }
                &.send {
                    width: 120rpx
                    height: 64rpx
                    background: #0D8DFC
                    border-radius: 32rpx
                    color #fff
                    line-height 64rpx
                    font-weight 600
                }
            }
        }
    }
</style>