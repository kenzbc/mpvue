<template>
    <div>
        <PageLoad :loading="!loading"/>
        <div class="main post" v-show="loading">
            <div class="c-item member" v-if="replyMember.nickname">
                <div class="avatar">
                    <img class="avatar-img" :src="replyMember.avatar || '/static/images/default_avatar.jpg'" />
                    <img class="sign-icon" src="/static/images/v.png" v-if="replyMember.member_type == '1'" />
                    <img class="sign-icon" src="/static/images/staff.png" v-if="replyMember.member_type == '2'" />
                </div>
                <div class="comment-info">
                    <div class="c-username"><span>{{ replyMember.nickname || '' }}</span><div class="rank">Lv.{{ replyMember.rank }}</div></div>
                    <div class="content">
                        <div class="text-box">
                            <wxParse :content="replyMember.content_html_img" :loading="!replyMember.content_html_img"/>
                        </div>
                        <!--图片-->
                        <div class="img-box flex" :class="[replyMember.picture.length == 1 ? 'one' : replyMember.picture.length == 2 ? 'two' : replyMember.picture.length > 2 ? 'three' : '']" v-if="replyMember.picture && replyMember.picture.length">
                            <div class="pic-wrap" v-for="(pic, p) in replyMember.picture" :key="p" v-if="p < 3">
                                <img :src="pic.image_url_scale" mode="widthFix" />
                                <div class="type-label" :class="[pic.imgType == '1' ? 'gif' : pic.imgType == '2' ? 'lang' : '']">{{pic.imgType == '1' ? 'GIF' : pic.imgType == '2' ? '长图' : ''}}</div>
                            </div>
                        </div>
                        <!--语音-->
                        <AudioBox v-if="replyMember.audio_url" commentType="reply" :cid="replyMember.dynamic_comment_id" :src="replyMember.audio_url" :duration="replyMember.seconds" :stop="audioStatus" />
                    </div>
                    <div class="tools-bar">
                        <div class="left">{{ replyMember.floor == 1 ? '沙发' : replyMember.floor == 2 ? '地板' : replyMember.floor + 1 + '楼'}}<span class="date">{{ replyMember.web_time || '' }}</span></div>
                        <div class="right" v-if="true">
                            <button v-if="false" class='btn share-btn' id="commentShareBtn" open-type="share" type="" hover-class="none"><img class="btn-icon" src="/static/images/share.png" /></button>
                            <div class="btn comment-btn" @click="replyComment"><img class="btn-icon" src="/static/images/comment.png" /><span class="num" v-show="reply.count > 0">{{ reply.count }}</span></div>
                            <div class="btn like-btn" :class="{praise: replyMember.is_praise == 1}" @click="setReplyPraise"><text class="iconfont icon-circle__good_Gray"></text><span class="num" v-show="replyMember.praise_count > 0">{{ replyMember.praise_count }}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <ul class="c-list">
                <li class="c-item" v-for="(item, index) in reply.list" :key="index" @click="replyReplyComment(item)">
                    <div class="avatar">
                        <img class="avatar-img" :src="item.avatar || '/static/images/default_avatar.jpg'" />
                        <img class="sign-icon" src="/static/images/v.png" v-if="item.member_type == '1'" />
                        <img class="sign-icon" src="/static/images/staff.png" v-if="item.member_type == '2'" />
                    </div>
                    <div class="comment-info">
                        <div class="c-username"><span>{{ item.nickname || '' }}</span><div class="rank">Lv.{{ item.rank }}</div></div>
                        <div class="content">
                            <wxParse :content="item.content_html_img" :loading="!item.content_html_img"/>
                        </div>
                        <div class="tools-bar">
                            <div class="left"><span class="date">{{ item.web_time || '' }}</span></div>
                        </div>
                    </div>
                </li>
            </ul>
            <Load :loading="bottomLoading" />
            <div class="tip" v-show="false">没有更多回复了</div>
        </div>
        <SendCommentBox @updateComment="getReply(1)" :name="nickName" :ctype="commentType" :rid="replyMember.dynamic_comment_id" :rrid="replyReplyId" :did="replyMember.dynamic_id" />
    </div>
</template>

<script>
  import wxParse from 'mpvue-wxparse'
  import Api from '@/http/api'
  import Load from '@/components/Load'
  import Moment from 'moment'
  import PageLoad from '@/components/PageLoad'
  import SendCommentBox from '@/components/SendCommentBox'
  import AudioBox from '@/components/AudioBox'
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
        replyMember: {},
        reply: {
          count: 0,
          list: []
        },
        replyLastPageKey: '',
        isLock: false,
        nickName: '',
        commentType: 2,
        replyId: '',
        replyReplyId: '',
        audioStatus: false
      }
    },
    computed: {
      ...mapState(['member'])
    },
    methods: {
      init () {
        this.loading = false
        this.bottomLoading = false
        this.replyMember = {}
        this.reply.count = 0
        this.reply.list = []
        this.replyLastPageKey = ''
        this.isLock = false
        this.nickName = ''
        this.commentType = 2
        this.replyId = ''
        this.replyReplyId = ''
        this.audioStatus = false
      },
      // 神评论
      async getReply (ref) {
        if (ref) {
          this.replyLastPageKey = ''
        }
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          dynamic_comment_id: this.did,
          limit: 20,
          last_page_key: this.replyLastPageKey
        }
        return Api.ajax('GET', '/services/dynamic/dynamic_comment_reply_list.php', params).then(resp => {
          if (resp.code === '200') {
            let data = resp.data || {}
            let list = data.list || []
            let len = list.length
            this.replyMember = data.member || {}
            this.replyMember.web_time = Moment.unix(this.replyMember.add_time).fromNow()
            this.replyMember.floor = parseInt(this.replyMember.floor)
            this.reply.count = data.count || 0
            this.nickName = this.replyMember.nickname || ''
            this.replyId = this.replyMember.dynamic_comment_id || ''
            // 表情符转换成图片
            this.replyMember.content_html_img = emojiToImg(this.replyMember.content)
            // 语音控制
            this.replyMember.audioStop = false
            // 增加图片数据
            if (this.replyMember.picture && this.replyMember.picture.length) {
              this.replyMember.picture.forEach(pic => {
                // 0:普通 1:GIF 2:长图
                pic.imgType = ''
                if (pic.image_url) {
                  if (this.replyMember.picture.length === 1) {
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
            if (ref) {
              this.reply.list = []
            }
            list.forEach(item => {
              item.web_time = Moment.unix(item.add_time).fromNow()
              // 表情符转换成图片
              item.content_html_img = emojiToImg(item.content)
              this.reply.list.push(item)
            })

            if (len) {
              this.replyLastPageKey = list[len - 1].cache_key || ''
            }
          }
        })
      },
      // 回复楼层
      replyComment () {
        this.commentType = 2
        this.nickName = this.replyMember.nickname
        this.replyReplyId = ''
      },
      // 楼层回复的回复
      replyReplyComment (item) {
        this.commentType = 3
        this.nickName = item.nickname
        this.replyReplyId = item.dynamic_comment_id
      },
      // 楼层点赞
      setReplyPraise () {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          dynamic_id: this.replyMember.dynamic_id,
          dynamic_comment_id: this.replyMember.dynamic_comment_id,
          comment_cache_key: this.replyMember.cache_key
        }
        Api.ajax('GET', '/services/dynamic/dynamic_comment_praise.php', params).then(resp => {
          if (resp.code === '200') {
            this.getReply(1)
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
      await this.getReply()
      this.loading = true
    },
    onLoad (e) {
      this.init()
      this.did = e.did || this.$route.query.did
      wx.setNavigationBarTitle({
        title: e.floor
      })
    },
    onUnload () {
      this.audioStatus = true
    },
    onShareAppMessage (ops) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        // console.log(ops.target)
      }
      return {
        title: 'score',
        path: '/pages/news/replyComment/main?did=' + this.did,
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
      this.replyLastPageKey = ''
      await this.getReply(true)
      wx.stopPullDownRefresh()
    },
    // 上拉加载
    async onReachBottom () {
      if (!this.isLock) {
        this.isLock = true
        this.bottomLoading = true
        await this.getReply()
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
    .c-list {
        padding-left 60rpx
    }
    .c-item {
            padding 24rpx 28rpx 24rpx 0
        +.c-item {
            border-top 1rpx solid #F0F1F2
        }
        .avatar {
            width 60rpx
            height 60rpx
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
            margin-left 40px
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
            }
            .tools-bar {
                padding 0 6rpx
                height: auto
                margin-top 14rpx
                display flex
                justify-content space-between
                align-items center
                .right {
                    display flex
                    justify-content flex-end
                    align-items center
                    .btn {
                        &.like-btn {
                            margin-right 6rpx
                        }
                        &.share-btn, &.comment-btn {
                            margin-right 20rpx
                        }
                    }
                }
            }
            .reply-list {
                border-radius 16rpx 16rpx 0 0
                background-color #F7F8FA
                padding 16rpx 28rpx
                margin-top 4rpx
                &.full {
                    border-radius 16rpx
                }

                .r-list {
                    line-height 48rpx
                    font-size 28rpx
                    font-weight 500
                    color #A8ABB3
                    +.r-list {
                        margin-top 16rpx
                    }
                    .r-username {
                        color #4B9CE3
                        margin-right 10rpx
                    }
                    .r-date {
                        margin-left 20rpx
                        font-size 22rpx
                    }
                }
            }
        }
        &.member {
            padding 24rpx 28rpx
            border-bottom 1rpx solid #F0F1F2
            .avatar {
                width 34px
                height 34px
            }
            .comment-info {
                margin-left 44px
                .tools-bar {
                    .left {
                        .date {
                            margin-left 20rpx
                        }
                    }
                }
            }
        }
    }
    .tip {
        text-align center
        line-height 40rpx
        font-size 24rpx
        color #A8ABB3
    }
</style>
