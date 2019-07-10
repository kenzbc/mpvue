<template>
    <div>
        <div class="question-radio" v-if="isQa">
            <div class="question-radio-ask">
                <div class="radio-ask-left">问</div>
                <div class="radio-ask-right flex">
                    <div class="radio-ask-message flex">
                        <Avatar :src="details.qa.avatar" :memberType="details.qa.member_type" avatarWidth="36px" avatarHeight="36px" />
                        <div class="ask-message-name">
                            <p class="ask-user-name">{{details.qa.nickname}}</p>
                            <p class="ask-user-demo">{{details.qa.demo}}</p>
                        </div>
                    </div>
                    <div class="radio-ask-zuanshi">{{details.qa.profit_diamond}}<i class="iconfont icon-icon_zuanshi"></i></div>
                </div>
            </div>
            <div class="question-radio-cont">{{details.qa.content}}</div>
            <div class="question-radio-asked">
                <div class="radio-ask-left">答</div>
                <div class="radio-ask-right flex">
                    <div class="radio-ask-message flex">
                        <Avatar :src="details.qa.asked_avatar" :memberType="details.qa.member_type" avatarWidth="36px" avatarHeight="36px" />
                        <div class="ask-message-name">
                            <p class="ask-user-name">{{details.qa.asked_nickname}}</p>
                            <p class="ask-user-demo">{{details.qa.asked_demo}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="asked-radio">
                <!--音频-->
                <div class="asked-radio-top qa-audio" v-if="details.sound && details.sound.length">
                    <div class="asked-radio-three cl" v-if="details.qa.is_buy == '1'">
                        <AudioBox commentType="details" mt="2px" :cid="details.dynamic_id" :src="details.sound[0].audio_url" :duration="details.sound[0].seconds" :stop="details.audioStop" @setAudioStop="postAudioStop" />
                    </div>
                    <div class="asked-radio-first cl" v-if="details.qa.is_buy == '0'" @tap="showPayDiamondModal">
                        <p class="asked-radio-first-left fl"><i class="iconfont radio-icon icon-general__voice"></i></p>
                        <p class="asked-radio-first-middle fl">{{details.qa.listen_diamond}} 钻偷{{listenOrLook}}</p>
                        <p class="asked-radio-first-right fr">{{details.sound[0].seconds}}"</p>
                    </div>
                </div>
                <!--视频-->
                <div class="asked-radio-top qa-video" v-if="details.video && details.video.length">
                    <div class="video-buy" v-if="details.qa.is_buy == '1'">
                        <div class="v-box" v-show="isShowVideo">
                            <video class="video" :src="details.video[0].video_url_mobile || details.video[0].video_url" :poster="details.video[0].image_url" controls></video>
                        </div>
                        <div class="v-img" v-show="!isShowVideo" :style="{'background-image': 'url(' + details.video[0].image_url +')'}">
                            <img src="/static/images/video_icon.png" />
                        </div>
                    </div>
                    <div class="video-not-buy" v-if="details.qa.is_buy == '0'" :style="{'background-image': 'url(' + details.video[0].image_url +')'}" @tap="showPayDiamondModal">
                        <img src="/static/images/video_icon.png" />
                        <div class="tip flex" v-if="!(details.video[0] && details.video[0].video_url_mobile)">
                            <div class="left-text">{{details.qa.listen_diamond}} 钻偷{{listenOrLook}}</div>
                            <div class="left-text">{{details.video[0].seconds}}"</div>
                        </div>
                    </div>
                </div>
                <div class="asked-radio-bottom cl" :class="{'bottom-video': details.video && details.video.length}">
                    <p class="asked-radio-bottom-left fl">回答于 {{details.qa.answer_time}}</p>
                    <p class="asked-radio-bottom-right fr">{{details.qa.listen_num}} 人{{listenOrLook}} &nbsp;&nbsp;{{details.qa.praise_num}} 人喜欢</p>
                </div>
            </div>
            <div class="pop-layer" :class="{show: showModal}">
                <div class="modal-wrap">
                    <div class="header flex-center-mid">提示</div>
                    <div class="body">
                        <div class="mid-box flex-center-mid">是否要用{{details.qa.listen_diamond}}钻石偷{{listenOrLook}}</div>
                        <div class="bottom-box flex">
                            <div class="btn flex-center-mid cancel" @tap="getCancel">稍后再说</div>
                            <div class="btn flex-center-mid ok" @tap="payDiamond">确定</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
  import Api from '@/http/api'
  import Avatar from './Avatar'
  import AudioBox from './AudioBox'
  import { mapState, mapMutations } from 'vuex'

  export default {
    components: {
      Avatar,
      AudioBox
    },
    data () {
      return {
        showModal: false
      }
    },
    props: {
      details: {
        type: Object,
        default: {}
      }
    },
    computed: {
      ...mapState(['member', 'isShowVideo']),
      isQa () {
        return (this.details.question_id && this.details.question_id != '0')
      },
      listenOrLook () {
        if (this.details.sound && this.details.sound.length) {
          return '听'
        } else if (this.details.video && this.details.video.length) {
          return '看'
        }
      }
    },
    methods: {
      ...mapMutations(['setDiamond', 'setShowVideo']),
      showPayDiamondModal () {
        this.showModal = true
      },
      // 支付钻石
      payDiamond () {
        let needDiamond = parseFloat(this.details.qa.listen_diamond || 0)
        let diff = parseFloat(this.member.diamond) - needDiamond
        console.log(diff)
        if (diff >= 0) {
          let params = {
            member_id: this.member.member_id || '',
            token: this.member.f_token || '',
            question_id: this.details.question_id || '',
            is_attention: '1'
          }
          Api.ajax('GET', '/services/qa/listen_answer_new.php', params).then(resp => {
            console.log(resp)
            if (resp.code === '200') {
              this.setDiamond(diff)
              this.$emit('updateDetails')
            }
          })
        } else {
          wx.showToast({title: '钻石不足', duration: 800, mask: true})
        }
        this.getCancel()
      },
      getCancel () {
        this.showModal = false
      },
      postAudioStop (obj) {
        this.$emit('setAudioStop', obj)
      }
    },
    mounted () {}
  }
</script>

<style lang="stylus" scoped>
    .question-radio{
        width 100%
        padding-top 10px
        .question-radio-ask{
            width 100%
            position relative
            left 0px
            top 0
            .radio-ask-left{
                position absolute
                left 0px
                top 0
                z-index 5
                background: #FFCC60;
                border: 3px solid #FFFFFF;
                font-size: 16px;
                color: #FFFFFF;
                text-align: center;
                height 36px
                width 36px
                line-height 30px
                border-radius 50%
            }
            .radio-ask-right{
                width 100%
                padding-left 32px
                justify-content space-between
                .radio-ask-message{
                    max-width 73%
                    .ask-message-avatar{
                        height 36px
                        width 36px
                        position relative
                        .qa-avatar{
                            border-radius 50%
                            border: 1px solid rgba(0,0,0,0.04);
                            height 36px
                            width 36px
                        }
                        .star_qa_staff{
                            position: absolute
                            right 0
                            bottom 0px
                            height 15px
                            width 15px
                        }
                    }
                    .ask-message-name{
                        padding-left 8px
                        width calc(100% - 36px)
                        .ask-user-name{
                            font-size: 15px;
                            color: #2D2F33;
                            line-height 20px
                            height 20px
                            overflow hidden
                            white-space:nowrap
                            text-overflow ellipsis
                        }
                        .ask-user-demo{
                            font-size: 12px;
                            color: #A8ABB3;
                            line-height 18px
                            overflow hidden
                            white-space:nowrap
                            text-overflow ellipsis
                        }
                    }
                }
                .radio-ask-zuanshi{
                    line-height 38px
                    font-size: 14px;
                    color: #0D8DFC;
                    .icon-icon_zuanshi{
                        margin-bottom: 2px;
                        display: inline-block;
                        vertical-align: middle;
                        color: #0D8DFC;
                        font-size: 14px;
                    }
                }
            }
        }
        .question-radio-cont{
            margin-top 10px
            font-size: 14px;
            color: #2D2F33;
            line-height 18px
            padding 10px 16px
            background: #F7F8FA;
            border-radius: 8px;
        }
        .question-radio-asked{
            width 100%
            margin-top 20px
            position relative
            .radio-ask-left{
                position absolute
                left 0px
                top 0
                z-index 5
                background: #0D8DFC;
                border: 3px solid #FFFFFF;
                font-size: 16px;
                color: #FFFFFF;
                text-align: center;
                height 36px
                width 36px
                line-height 30px
                border-radius 50%
            }
            .radio-ask-right{
                width 100%
                padding-left 32px
                justify-content space-between
                .radio-ask-message{
                    width 100%
                    .ask-message-avatar{
                        height 36px
                        width 36px
                        position relative
                        .qa-avatar{
                            border-radius 50%
                            border: 1px solid rgba(0,0,0,0.04);
                            height 36px
                            width 36px
                        }
                        .star_qa_staff{
                            position: absolute
                            right 0
                            bottom 0px
                            height 15px
                            width 15px
                        }
                    }
                    .ask-message-name{
                        padding-left 8px
                        width calc(100% - 36px)
                        .ask-user-name{
                            font-size: 15px;
                            color: #2D2F33;
                            line-height 20px
                            height 20px
                        }
                        .ask-user-demo{
                            font-size: 12px;
                            color: #A8ABB3;
                            line-height 18px
                            overflow hidden
                            white-space:nowrap
                            text-overflow ellipsis
                        }
                    }
                }
                .radio-ask-zuanshi{
                    line-height 36px
                    font-size: 14px;
                    color: #0D8DFC;
                    .icon-icon_zuanshi{
                        margin-bottom: 2px;
                        display: inline-block;
                        vertical-align: middle;
                        color: #0D8DFC;
                        font-size: 14px;
                    }
                }
            }
        }
        .asked-radio{
            margin-top 10px
            width 100%
            background: #FFFFFF;
            border: 1px solid #F0F1F2;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.03);
            border-radius: 8px;
            overflow hidden;
            .asked-radio-top{
                .asked-radio-first{
                    cursor: pointer;
                    overflow hidden
                    border-radius: 8px 8px 0 0;
                    height 50px
                    line-height 50px
                    background-image: linear-gradient(135deg, #0D7EFF 0%, #0F97FF 100%);
                    border: 1px solid rgba(0,0,0,0.06);
                    .asked-radio-first-left{
                        margin -1px 0 0 25px
                        .radio-icon{
                            font-size: 15px;
                            color: #fff;
                        }
                    }
                    .asked-radio-first-right{
                        margin-right 18px
                        font-size: 16px;
                        color: #FFFFFF;
                    }
                    .asked-radio-first-middle{
                        font-size: 16px;
                        color: #FFFFFF;
                        margin-left 16px
                    }
                }
                .asked-radio-second{
                    cursor: pointer;
                    overflow hidden
                    border-radius: 8px 8px 0 0;
                    height 50px
                    background-image: linear-gradient(-45deg, #14D4FA 0%, #05B0FA 100%);
                    .asked-radio-first-left{
                        margin -1px 0 0 25px
                        .radio-icon{
                            font-size: 15px;
                            color: #fff;
                        }
                    }
                    .asked-radio-first-right{
                        margin-right 18px
                        font-size: 16px;
                        color: #FFFFFF;
                    }
                    .asked-radio-first-middle{
                        font-size: 16px;
                        color: #FFFFFF;
                        margin-left 16px
                    }
                }
                .asked-radio-three{
                    cursor: pointer;
                    overflow hidden
                    border-radius: 8px 8px 0 0;
                    height 50px
                    background-image: linear-gradient(135deg, #0D7EFF 0%, #0F97FF 100%);
                    border: 1px solid rgba(0,0,0,0.06);
                    .asked-radio-first-left{
                        margin -1px 0 0 25px
                        .radio-icon{
                            font-size: 15px;
                            color: #fff;
                        }
                    }
                    .asked-radio-first-right{
                        margin-right 18px
                        font-size: 16px;
                        color: #FFFFFF;
                    }
                    .asked-radio-first-middle{
                        font-size: 16px;
                        color: #FFFFFF;
                        margin-left 16px
                    }
                }
                .asked-radio-four{
                    display none
                    position: relative
                    overflow hidden
                    border-radius: 8px 8px 0 0;
                    height 50px
                    background-image: linear-gradient(135deg, #0D7EFF 0%, #0F97FF 100%);
                    border: 1px solid rgba(0,0,0,0.06);
                    .audiojs{
                        margin-top 5px
                        width 410px
                        .scrubber{
                            width 260px
                            height 4px
                            .progress{
                                height 4px
                                border-radius: 2px;
                                background #fff
                            }
                            .loaded{
                                height 4px
                                border-radius: 2px;
                            }
                        }
                        .reset-play{
                            cursor: pointer
                            top 22px
                        }
                    }
                    .asked-radio-first-left{
                        margin -1px 0 0 25px
                        .radio-icon{
                            font-size: 15px;
                            color: #fff;
                        }
                    }
                    .asked-radio-first-right{
                        margin-right 18px
                        font-size: 16px;
                        color: #FFFFFF;
                    }
                    .asked-radio-first-middle{
                        font-size: 16px;
                        color: #FFFFFF;
                        margin-left 16px
                    }
                }
                &.qa-video {
                    width 100%
                    height 400rpx
                    background #fff
                    .video-not-buy {
                        width 100%
                        height 100%
                        position relative
                        background-position center
                        background-repeat no-repeat
                        background-size cover
                        img {
                            display block
                            width: 100rpx
                            height 100rpx
                            position absolute
                            top calc(50% - 50rpx)
                            left calc(50% - 50rpx)
                        }
                        .tip {
                            width 100%
                            position absolute
                            bottom 0
                            justify-content space-between
                            font-size 30rpx
                            color #fff
                            padding 30rpx
                        }
                    }
                    .video {
                        width: 100%
                        height 400rpx
                        display block
                    }
                    .v-img {
                        width 100%
                        height 400rpx
                        background-color #010101
                        position relative
                        background-position center
                        background-repeat no-repeat
                        background-size cover
                        img {
                            display block
                            width: 80rpx
                            height 80rpx
                            position absolute
                            top calc(50% - 40rpx)
                            left calc(50% - 40rpx)
                        }
                    }
                }
            }
            .asked-radio-bottom{
                line-height 30px
                font-size: 12px;
                color: #656973;
                .asked-radio-bottom-left{
                    margin-left 16px
                }
                .asked-radio-bottom-right{
                    margin-right 17px
                }
                &.bottom-video {
                    background-image linear-gradient(135deg,#0d7eff 0%,#0f97ff 100%)
                    color #fff
                }
            }
        }
    }
    .pop-layer {
        display none
        width 100%
        height 100vh
        position fixed
        left 0
        top 0
        z-index 9
        background rgba(0,0,0, .2)
        transition .3s
        &.show {
            display -webkit-flex
            display flex
            justify-content center
            align-items center
        }
    }
    .modal-wrap {
        width 70%
        background #fff
        border-radius 8rpx
        overflow hidden
        padding
        .header {
            height 80rpx
            font-size 30rpx
            background #0D8DFC
            color #fff
        }
        .body {
            padding 30rpx 40rpx
            .mid-box {
                font-size 24rpx
                padding 30rpx 0
            }
            .bottom-box {
                padding-top 30rpx
                align-items center
                justify-content space-between
                .btn {
                    width 45%
                    height 60rpx
                    color #fff
                    font-size 28rpx
                    background #0D8DFC
                    padding 0 28rpx
                    border-radius 30rpx
                    &.cancel {
                        background #A8ABB3
                    }
                }
            }
        }
    }
    .audio-box {
        margin-top 0
    }
</style>