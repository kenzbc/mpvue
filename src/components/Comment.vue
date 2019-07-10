<template>
    <div>
        <div class="comment-wrap" v-show="hotComment.count > 0">
            <div class="c-header">
                <div class="line"></div>
                <div class="title">神回复</div>
                <div class="right">共有<span>{{hotComment.count}}</span>条神回复</div>
            </div>
            <ul class="c-list">
                <li class="c-item" v-for="(item, index) in hotComment.list" :key="index">
                    <div class="avatar">
                        <img class="avatar-img" :src="item.avatar || '/static/images/default_avatar.jpg'" />
                        <img class="sign-icon" src="/static/images/v.png" v-if="item.member_type === '1'" />
                        <img class="sign-icon" src="/static/images/staff.png" v-if="item.member_type === '2'" />
                    </div>
                    <div class="comment-info">
                        <div class="c-username"><span>{{ item.nickname || '' }}</span><div class="rank">Lv.{{ item.rank }}</div></div>
                        <div class="content">{{ item.content || '' }}</div>
                        <div class="tools-bar">
                            <div class="left">{{ item.floor === 1 ? '沙发' : item.floor === 2 ? '地板' : item.floor + 1 + '楼'}}<span class="date">{{ item.web_time || '' }}</span></div>
                            <div class="right" v-if="false">
                                <button class='btn share-btn' id="commentShareBtn" open-type="share" type="" hover-class="none"><img class="btn-icon" src="/static/images/share.png" /></button>
                                <div class="btn comment-btn"><img class="btn-icon" src="/static/images/comment.png" /><span class="num" v-show="item.reply.count > 0">{{ item.reply.count }}</span></div>
                                <div class="btn like-btn"><img class="btn-icon" src="/static/images/like.png" /><span class="num" v-show="item.praise_count > 0">{{ item.praise_count }}</span></div>
                            </div>
                        </div>
                        <ul class="reply-list" :class="{full: item.reply.list.length === item.reply.count}" v-show="item.reply.count > 0">
                            <li class="r-list" v-for="(replyItem, n) in (item.reply.list || [])" :key="n">
                                <span class="r-username">{{ replyItem.nickname || '' }} :</span>{{ replyItem.content || '' }}<span class="r-date">{{replyItem.web_time}}</span>
                            </li>
                        </ul>
                        <div class="more-hot-reply-btn" v-show="item.reply.list.length < item.reply.count" @click="getMoreHotReply(index)">还剩 {{item.reply.count - item.reply.list.length}} 条回复</div>
                    </div>
                </li>
            </ul>
            <div class="more" @click="getHotComment" v-show="isHotMore">查看更多神回复</div>
        </div>
    </div>
</template>

<script>
  import Api from '@/http/api'
  import Load from '@/components/Load'
  import PageLoad from '@/components/PageLoad'
  import Moment from 'moment'
  export default {
    components: {
      Load,
      PageLoad
    },
    data () {
      return {
        did: '',
        hotComment: {
          count: 0,
          list: []
        },
        comment: {
          count: 0,
          list: []
        },
        hotCommentLastPageKey: '',
        commentLastPageKey: '',
        isHotMore: false,
        isMore: false
      }
    },
    methods: {
      init () {},
      // 神评论
      async getHotComment () {
        let params = {
          dynamic_id: this.did,
          limit: 5,
          last_page_key: this.hotCommentLastPageKey
        }
        return Api.post('/services/dynamic/dynamic_comment_all_hot_list.php', params).then(resp => {
          if (resp.code === '200') {
            let data = resp.data || {}
            let list = data.list || []
            let len = list.length
            list.forEach(item => {
              item.web_time = Moment.unix(item.add_time).fromNow()
              item.reply.list.forEach(subItem => {
                subItem.web_time = Moment.unix(subItem.add_time).fromNow()
              })
            })
            if (this.hotCommentLastPageKey) {
              list.forEach(item => {
                this.hotComment.list.push(item)
              })
            } else {
              this.hotComment = data
            }
            if (this.hotComment.list.length < this.hotComment.count) {
              this.hotCommentLastPageKey = list[len - 1].cache_key || ''
              this.isHotMore = true
            } else {
              this.isHotMore = false
            }
          }
        })
      },
      // 神评论回复
      getMoreHotReply (index) {
        console.log(index)
        let params = {
          dynamic_comment_id: this.did,
          limit: 5,
          last_page_key: ''
        }
        Api.post('/services/dynamic/dynamic_comment_all_hot_list.php', params).then(resp => {
          console.log(resp)
          if (resp.code === '200') {}
        })
      },
      // 文章详情bak
      getPostDetailBak () {
        let params = {
          dynamic_id: this.did
        }
        return Api.post('/services/dynamic/dynamic_info.php', params).then(resp => {
          this.contentLoading = false
          if (resp.code === '200') {
            this.details = resp.data || {}
            this.hotComment.count = this.details.hot_dynamic_comment_count || 0
            let list = this.details.hot_dynamic_comment_list || []
            list.forEach(item => {
              item.web_time = Moment.unix(item.add_time).fromNow()
              item.reply.list.forEach(subItem => {
                subItem.web_time = Moment.unix(subItem.add_time).fromNow()
              })
            })
            this.hotComment.list = list
            if (this.hotComment.list.length === 5) {
              this.hotCommentLastPageKey = this.hotComment.list[4].cache_key || ''
            }
            if (this.hotComment.count > 5) {
              this.isHotMore = true
            } else {
              this.isHotMore = false
            }
          }
        }).catch(function () {
          this.contentLoading = false
        })
      },
      // 神评论bak
      getHotCommentBak () {
        let params = {
          dynamic_id: this.did,
          limit: 5,
          last_page_key: this.hotCommentLastPageKey
        }
        return Api.post('/services/dynamic/dynamic_comment_all_hot_list.php', params).then(resp => {
          if (resp.code === '200') {
            let data = resp.data || {}
            let list = data.list || []
            let len = list.length
            this.hotComment.count = data.count
            list.forEach(item => {
              item.web_time = Moment.unix(item.add_time).fromNow()
              item.reply.list.forEach(subItem => {
                subItem.web_time = Moment.unix(subItem.add_time).fromNow()
              })
              this.hotComment.list.push(item)
            })
            if (this.hotComment.list.length < this.hotComment.count) {
              this.hotCommentLastPageKey = list[len - 1].cache_key || ''
              this.isHotMore = true
            } else {
              this.isHotMore = false
            }
          }
        })
      }
    },
    async mounted () {
      await this.getPostDetail()
      await this.getHotComment()
      await this.getComment()
      this.loading = true
    },
    onLoad () { // query需要在onLoad周期内获取
      console.log(this.loading)
      this.did = this.$route.query.did
    },
    onUnload () {
      this.loading = false
      this.init()
    }
  }
</script>

<style lang="stylus" scoped>
    .comment-wrap {
        margin-top 20rpx
        background-color #fff

        .c-header {
            height 66rpx
            padding 0 28rpx
            border-bottom 2rpx solid #F0F1F2
            .line {
                width: 8rpx
                height: 24rpx
                background: #FFCC60
                float left
                margin-top 20rpx
            }
            .title {
                height 64rpx
                line-height 64rpx
                float left
                font-size 28rpx
                color #2D2F33
                font-weight 600
                margin-left 14rpx
            }
            .right {
                height 64rpx
                line-height 64rpx
                float right
                color #A8ABB3
                font-size 28rpx
                font-weight 400
                span {
                    padding 0 14rpx
                }
            }
        }
        .c-list {}
        .c-item {
            padding 24rpx 28rpx
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
                    right -2rpx
                    bottom -2rpx
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
                    font-size 32rpx
                    font-weight 400
                    line-height 52rpx
                    text-align justify
                    margin-top 8rpx
                    color #2D2F33
                }
                .tools-bar {
                    padding 0 6rpx
                    height: 72rpx
                    display flex
                    justify-content space-between
                    align-items center
                    .left {
                        .date {
                            margin-left 20rpx
                        }
                    }
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
                .more-hot-reply-btn {
                    width 100%
                    height 56rpx
                    border-radius 0 0 16rpx 16rpx
                    background #f2f3f5
                    line-height 56rpx
                    text-align center
                    font-size 22rpx
                    font-weight 600
                    color #A8ABB3
                }
            }
        }
        .more {
            width: 100%
            height: 80rpx
            line-height 80rpx
            text-align center
            font-size 26rpx
            color #A8ABB3
            background-color rgba(0,0,0, .1)
        }
    }
</style>