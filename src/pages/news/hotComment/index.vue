<template>
    <div>
        <PageLoad :loading="!loading"/>
        <div class="main post">
            <ul class="c-list" v-show="loading">
                <li class="c-item" v-for="(item, index) in hotComment.list" :key="index">
                    <div class="avatar">
                        <img class="avatar-img" :src="item.avatar || '/static/images/default_avatar.jpg'" />
                        <img class="sign-icon" src="/static/images/v.png" v-if="item.member_type == '1'" />
                        <img class="sign-icon" src="/static/images/staff.png" v-if="item.member_type == '2'" />
                    </div>
                    <div class="comment-info">
                        <div class="c-username"><span>{{ item.nickname || '' }}</span><div class="rank">Lv.{{ item.rank }}</div></div>
                        <div class="content">
                            <div class="text-box">
                                <wxParse :content="item.content_html_img" :loading="!item.content_html_img"/>
                            </div>
                            <!--图片-->
                            <div class="img-box flex" :class="[item.picture.length == 1 ? 'one' : item.picture.length == 2 ? 'two' : item.picture.length > 2 ? 'three' : '']" v-if="item.picture && item.picture.length">
                                <div class="pic-wrap" v-for="(pic, p) in item.picture" :key="p" v-if="p < 3">
                                    <img :src="pic.image_url_scale" mode="widthFix" />
                                    <div class="type-label" :class="[pic.imgType == '1' ? 'gif' : pic.imgType == '2' ? 'lang' : '']">{{pic.imgType == '1' ? 'GIF' : pic.imgType == '2' ? '长图' : ''}}</div>
                                </div>
                            </div>
                            <!--语音-->
                            <AudioBox v-if="item.audio_url" commentType="hotComment" :cid="item.dynamic_comment_id" :src="item.audio_url" :duration="item.seconds" :stop="item.audioStop" @setAudioStop="audioStop" />
                        </div>
                        <ul class="reply-list" :class="{full: item.reply.list.length == item.reply.count}" v-show="item.reply.count > 0">
                            <li class="r-list" v-for="(replyItem, n) in (item.reply.list || [])" :key="n" @click="replyReplyComment(replyItem)">
                                <span class="r-username">{{ replyItem.nickname || '' }} :</span><wxParse :content="replyItem.content_html_img" :loading="!replyItem.content_html_img"/><span class="r-date">{{replyItem.web_time}}</span>
                            </li>
                        </ul>
                        <div class="more-hot-reply-btn" v-show="item.reply.list.length < item.reply.count" @click="toMoreReply(item.dynamic_comment_id)">还剩 {{item.reply.count - item.reply.list.length}} 条回复</div>
                        <div class="tools-bar">
                            <div class="left">{{ item.floorStr }}<span class="date">{{ item.web_time || '' }}</span></div>
                            <div class="right">
                                <div class='btn share-btn' v-if="false" @tap="showShareBox(item)"><img class="btn-icon" src="/static/images/share.png" /></div>
                                <div class="btn comment-btn" @click="replyComment(item)"><img class="btn-icon" src="/static/images/comment.png" /><span class="num" v-show="item.reply.count > 0">{{ item.reply.count }}</span></div>
                                <div class="btn like-btn" :class="{praise: item.is_praise == 1}" @click="setReplyPraise(item)"><text class="iconfont icon-circle__good_white"></text><span class="num" v-if="item.praise_count > 0">{{ item.praise_count }}</span></div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <Load :loading="bottomLoading" />
            <div class="tip" v-show="false">没有更多回复了</div>
        </div>
        <SendCommentBox @updateComment="getHotComment(1)" :name="nickName" :ctype="commentType" :rid="replyId" :rrid="replyReplyId" :did="did" />
    </div>
</template>

<script>
  import wxParse from 'mpvue-wxparse'
  import Api from '@/http/api'
  import Load from '@/components/Load'
  import PageLoad from '@/components/PageLoad'
  import SendCommentBox from '@/components/SendCommentBox'
  import AudioBox from '@/components/AudioBox'
  import Moment from 'moment'
  import { mapState } from 'vuex'
  import { emojiToImg } from '@/utils/index'

  export default {
    components: {
      wxParse,
      Load,
      PageLoad,
      SendCommentBox,
      AudioBox
    },

    data () {
      return {
        did: '',
        loading: false,
        bottomLoading: false,
        hotComment: {
          count: 0,
          list: []
        },
        hotCommentLastPageKey: '',
        isLock: false,
        nickName: '楼主',
        commentType: 0,
        replyId: '',
        replyReplyId: '',
        currAudioId: '', // 存储当前音频播放ID
        currAudioFromComment: ''
      }
    },
    computed: {
      ...mapState(['member'])
    },
    methods: {
      init () {
        this.loading = false
        this.bottomLoading = false
        this.hotComment.count = 0
        this.hotComment.list = []
        this.hotCommentLastPageKey = ''
        this.isLock = false
        this.nickName = '楼主'
        this.commentType = 0
        this.replyId = ''
        this.replyReplyId = ''
        this.currAudioId = ''
        this.currAudioFromComment = ''
      },
      // 停止当前语音播放
      audioStop (obj) {
        this.currAudioFromComment = obj.type
        if (!this.currAudioId) {
          this.currAudioId = obj.cid
        } else {
          if (this.currAudioId !== obj.cid) {
            this.setAudioStatus(obj.type)
            this.currAudioId = obj.cid
          }
        }
      },
      // 设置当前语音播放状态
      setAudioStatus (type) {
        this[type].list.forEach((item) => {
          if (item.dynamic_comment_id === this.currAudioId) {
            item.audioStop = true
          } else {
            item.audioStop = false
          }
        })
      },
      // 神评论
      async getHotComment (isRef) {
        if (isRef) {
          this.hotCommentLastPageKey = ''
        }
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          dynamic_id: this.did,
          limit: 20,
          last_page_key: this.hotCommentLastPageKey
        }
        return Api.ajax('GET', '/services/dynamic/dynamic_comment_all_hot_list.php', params).then(resp => {
          if (resp.code === '200') {
            let data = resp.data || {}
            let list = data.list || []
            let len = list.length
            this.hotComment.count = data.count || 0
            if (isRef) {
              this.hotComment.list = []
            }
            list.forEach(item => {
              item.web_time = Moment.unix(item.add_time).fromNow()
              let floor = parseInt(item.floor)
              item.floorStr = floor === 1 ? '沙发' : floor === 2 ? '地板' : floor + 1 + '楼'
              item.reply.list.forEach(subItem => {
                subItem.web_time = Moment.unix(subItem.add_time).fromNow()
                // 表情符转换成图片
                subItem.content_html_img = emojiToImg(subItem.content)
              })
              // 表情符转换成图片
              item.content_html_img = emojiToImg(item.content)
              // 语音控制
              item.audioStop = false
              // 增加图片数据
              if (item.picture && item.picture.length) {
                item.picture.forEach(pic => {
                  // 0:普通 1:GIF 2:长图
                  pic.imgType = ''
                  if (pic.image_url) {
                    if (item.picture.length === 1) {
                      pic.image_url_scale = pic.image_url + '?x-oss-process=image/resize,m_fill,w_600,h_376,limit_0'
                    } else {
                      pic.image_url_scale = pic.image_url + '?x-oss-process=image/resize,m_fill,w_500,h_500,limit_0'
                    }

                    if (pic.image_url.lastIndexOf('.gif') !== -1) {
                      pic.imgType = '1'
                      pic.image_url_scale += '/format,jpg'
                    } else if (parseInt(pic.height) > 0 && parseInt(pic.width) * 2 <= parseInt(pic.height)) {
                      pic.imgType = '2'
                    } else {
                      pic.imgType = '0'
                    }
                  }
                })
              }
              this.hotComment.list.push(item)
              console.log(this.hotComment.list)
            })
            if (len) {
              this.hotCommentLastPageKey = list[len - 1].cache_key || ''
            }
          }
        })
      },
      // 打开回复的回复页
      toMoreReply (dcid) {
        let did = dcid
        this.$router.push({path: '/pages/news/replyComment/main', query: { did }})
      },
      // 回复楼层
      replyComment (item) {
        this.commentType = 2
        this.nickName = item.nickname
        this.replyId = item.dynamic_comment_id
        this.replyReplyId = ''
      },
      // 楼层回复的回复
      replyReplyComment (item) {
        this.commentType = 3
        this.nickName = item.nickname
        this.replyId = item.bar_comment_id
        this.replyReplyId = item.dynamic_comment_id
      },
      // 楼层点赞
      setReplyPraise (item) {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          dynamic_id: this.did,
          dynamic_comment_id: item.dynamic_comment_id,
          comment_cache_key: item.cache_key
        }
        Api.ajax('GET', '/services/dynamic/dynamic_comment_praise.php', params).then(resp => {
          if (resp.code === '200') {
            this.getHotComment(1)
          }
          wx.showToast({
            title: resp.message,
            duration: 800,
            mask: true
          })
        })
      }
    },
    async mounted () {
      await this.getHotComment(1)
      this.loading = true
    },
    onLoad () {
      this.did = this.$route.query.did
      this.init()
      console.log(this.did)
    },
    onUnload () {
      if (this.currAudioFromComment) {
        this.setAudioStatus(this.currAudioFromComment)
      }
    },
    onShareAppMessage (ops) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        // console.log(ops.target)
      }
      return {
        title: 'score',
        path: '/pages/news/hotComment/main?did=' + this.did,
        success: function (res) {
          // 转发成功
          // console.log('转发成功:' + JSON.stringify(res))
        },
        fail: function (res) {
          // 转发失败
          // console.log('转发失败:' + JSON.stringify(res))
        }
      }
    },
    // 下拉加载
    async onPullDownRefresh () {
      this.hotCommentLastPageKey = ''
      await this.getHotComment(1)
      wx.stopPullDownRefresh()
    },
    // 上拉加载
    async onReachBottom () {
      if (!this.isLock) {
        this.isLock = true
        this.bottomLoading = true
        await this.getHotComment()
        this.bottomLoading = false
        this.isLock = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
    @import url("~mpvue-wxparse/src/wxParse.css")
    .tools-bar {
        display flex
        justify-content space-between
        align-items center
        height 88rpx
        font-size 22rpx
        color #656973
        padding 0 64rpx
        background-color #fff
        .iconfont {
            font-size 38rpx
            color #656973
        }
        .btn {
            display flex
            align-items center
            &.share-btn {
                padding 0
                margin 0
                background transparent
                border none
                &:after {
                    border none
                }
            }
            &.praise {
                .iconfont {
                    color #0D8DFC
                }
            }
        }
        .btn-icon {
            width 48rpx
            height 48rpx
        }
        .num {
            margin-left 4rpx
        }
    }

    .c-item {
        padding 24rpx 28rpx 18rpx
        background: #fffcf7
        +.c-item {
            border-top 2rpx solid #F0F1F2
        }

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
                right -6rpx
                bottom -6rpx
            }
        }
        .comment-info {
            margin-left 94rpx
            .c-username {
                display flex
                align-items center
                span {
                    display block
                    height 44rpx
                    line-height 44rpx
                    font-size 32rpx
                    font-weight 600
                }
            }
            .rank {
                width 68rpx
                height 28rpx
                line-height 28rpx
                background linear-gradient(135deg,rgba(25,167,255,1) 0%,rgba(5,138,255,1) 100%)
                border-radius 6rpx
                text-align center
                font-size 22rpx
                color #fff
                margin-left 12rpx
            }
            .content {
                width 100%
                .text-box {
                    width 100%
                    font-size 32rpx
                    font-weight 400
                    line-height 52rpx
                    text-align justify
                    margin-top 8rpx
                    color #2D2F33
                    word-break break-all
                }
                .img-box {
                    justify-content space-between
                    margin-top 20rpx
                    .pic-wrap {
                        position relative
                        .type-label {
                            width 64rpx
                            height 36rpx
                            line-height 36rpx
                            text-align center
                            color #fff
                            font-size 22rpx
                            position absolute
                            right 0
                            bottom 0
                            border-radius 6rpx 0 0 0
                            &.gif {
                                background #0D8DFC
                            }
                            &.lang {
                                background #16DE9B
                            }
                        }
                    }
                    img {
                        display block
                    }
                    &.one {
                        .pic-wrap {
                            width 100%
                            img {
                                width 100%
                            }
                        }
                    }
                    &.two {
                        .pic-wrap {
                            width 49.4%
                            img {
                                width 100%
                            }
                        }
                    }
                    &.three {
                        .pic-wrap {
                            width 32.5%
                            img {
                                width 100%
                            }
                        }
                    }
                }
                .audio-box {

                }
            }
            .tools-bar {
                padding 0 6rpx
                height: auto
                margin-top 14rpx
                display flex
                justify-content space-between
                align-items center
                background: #fffcf7
                .left {
                    color #B3B3B3
                    font-size 24rpx
                    .date {
                        margin-left 20rpx
                    }
                }
                .right {
                    display -webkit-flex
                    display flex
                    justify-content flex-end
                    align-items center
                    .btn {
                        height 48rpx
                        &.like-btn {
                            width 48rpx
                            position relative
                            margin-right 6rpx
                            display block
                            line-height 48rpx
                            .num {
                                position absolute
                                bottom 0
                                right 0
                                display block
                                height 20rpx
                                padding 0 6rpx
                                background #0D8DFC
                                border-radius 10rpx
                                line-height 20rpx
                                color #fff
                                font-size 16rpx
                            }
                        }
                        &.share-btn, &.comment-btn {
                            margin-right 20rpx
                        }
                    }
                }
            }
            .reply-list {
                border-radius 16rpx 16rpx 0 0
                background-color #fff7e8
                padding 16rpx 28rpx
                margin-top 20rpx
                box-shadow: 0 0 0 2rpx #fae8c3

                &.full {
                    border-radius 16rpx
                }

                .r-list {
                    line-height 48rpx
                    font-size 28rpx
                    font-weight 500
                    color #737373
                    word-break break-all
                    +.r-list {
                        margin-top 16rpx
                    }
                    .r-username {
                        color #dbb676
                        margin-right 10rpx
                    }
                    .r-date {
                        margin-left 20rpx
                        font-size 22rpx
                        color #b3b3b3
                    }
                }
            }
            .more-hot-reply-btn {
                width 100%
                height 56rpx
                border-radius 0 0 16rpx 16rpx
                background #fff5e0
                line-height 56rpx
                text-align center
                font-size 22rpx
                font-weight 600
                color #dbb676
                box-shadow: 0 0 0 2rpx #fae8c3
            }
        }
    }
    .tip {
        text-align center
        line-height 40rpx
        font-size 24rpx
        color #A8ABB3
        padding-bottom 20rpx
    }
</style>
