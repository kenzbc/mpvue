<template>
    <div>
        <div class="main">
            <div class="swiper-wrap" v-show="news.swiper.list.length > 0">
                <swiper class="news-swiper" previous-margin="40rpx" next-margin="40rpx" :indicator-dots="news.swiper.indicatorDots" :autoplay="news.swiper.autoplay" :interval="news.swiper.interval" :duration="news.swiper.duration">
                    <swiper-item class="swiper-item" v-for="(item, index) in news.swiper.list" :key="index">
                        <div class="slide-image" :style="{backgroundImage: 'url(' + item.picture_list[0] + ')'}" @click="toLink(item)"></div>
                    </swiper-item>
                </swiper>
            </div>
            <ul class="news-list">
                <li class="item" :class="{selected: item.selected}" v-for="(item, index) in news.list" :key="index" @click="toLink(item)">
                    <div class="left">
                        <div class="title">{{item.title}}</div>
                        <div><span class="from">{{ item.nickname }}</span><span class="num" v-show="item.member_id != '0'">{{ item.view_count }}次阅读</span></div>
                    </div>
                    <div class="right" :style="{backgroundImage: 'url(' + item.picture_list[0] + ')'}"></div>
                </li>
            </ul>
            <Load :loading="bottomLoading" />
        </div>
    </div>
</template>

<script>
  import { getUrlParams } from '@/utils/index'
  import Api from '@/http/api'
  import Load from '@/components/Load'
  import { mapState } from 'vuex'

  export default {
    components: {
      Load
    },

    data () {
      return {
        bottomLoading: false,
        news: {
          swiper: {
            indicatorDots: false,
            autoplay: true,
            interval: 3000,
            duration: 1000,
            list: []
          },
          list: []
        },
        params: {
          channel_id: -1,
          page: 1,
          limit: 20,
          member_id: '',
          token: ''
        }
      }
    },
    computed: {
      ...mapState(['member'])
    },
    methods: {
      getNewsList () {
        this.params.member_id = this.member.member_id || ''
        this.params.token = this.member.f_token || ''
        return Api.ajax('GET', '/services/cms/article_list.php', this.params).then(resp => {
          if (resp.code === '200') {
            if (this.params.page === 1) {
              let data = this.getSwiperData(resp.data.article_list || [])
              this.news.swiper.list = data.swiperData
              this.news.list = data._list
            } else {
              let list = resp.data.article_list || []
              list.forEach(item => {
                this.news.list.push(item)
              })
            }
          } else {
            if (this.params.page > 1) this.params.page--
          }
        }).catch(() => {
          if (this.params.page > 1) this.params.page--
        })
      },
      getSwiperData (arr) {
        let list = arr || []
        let _list = []
        let swiperData = []
        let len = 0

        list.forEach(function (item) {
          len = swiperData.length
          if (len < 4 && item.picture_model === '2') {
            let pos = item.link_url.lastIndexOf('matchID=') + 8
            item.matchID = item.link_url.slice(pos)
            swiperData.push(item)
          } else {
            item.selected = false
            _list.push(item)
          }
        })
        return {
          _list,
          swiperData
        }
      },
      toLink (item) {
        if (item) {
          let did = item.object_id
          let betid = item.famulei_url.match(/group_bet_detail\/(\d+)/)
          if (did !== '0') {
            // let src = item.video_info && item.video_info.video_url ? item.video_info.video_url : ''
            this.$router.push({path: '/pages/news/detail/main', query: { did, betid }})
            this.$set(item, 'selected', true)
          } else {
            let url = item.link_url
            let matchID = getUrlParams(url).matchID
            if (matchID) {
              this.$router.push({path: '/pages/match/detail/main', query: { matchID }})
            } else if (url) {
              this.$router.push({path: '/pages/match/data/main', query: { url }})
            }
          }
        }
      }
    },
    mounted () {
      this.getNewsList()
    },
    onShareAppMessage (ops) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        // console.log(ops.target)
      }
      return {
        title: '英雄联盟全球赛事资讯',
        path: 'pages/news/main',
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
      wx.showNavigationBarLoading()
      this.params.page = 1
      await this.getNewsList()
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      wx.showToast({title: '已是最新资讯', duration: 800, mask: true})
    },
    // 上拉加载
    async onReachBottom () {
      if (this.bottomLoading) return
      this.bottomLoading = true
      this.params.page++
      await this.getNewsList()
      this.bottomLoading = false
    }
  }
</script>

<style lang="stylus" scoped>
    .swiper-wrap {
        width: 100%
        height: 300rpx
        border-top: 1rpx solid #f0f1f2
        border-bottom: 1rpx solid #f0f1f2
        padding 18rpx 0
        .news-swiper {
            width: 100%;
            height: 260rpx
            .slide-image {
                width: 96%
                height: 100%
                background-repeat no-repeat
                background-position center
                background-size cover
                margin 0 auto
                border-radius 10rpx
                overflow hidden
            }
        }
    }
    .news-list {
        padding 4rpx 28rpx 24rpx
        .item {
            width: 100%
            height: 190rpx
            padding-top 20rpx
            +.item {
                border-top: 2rpx solid #f0f1f2
            }
            .left {
                width: 456rpx
                height: 100%
                float: left
                .title {
                    width 100%
                    height 88rpx
                    line-height 44rpx
                    font-size 32rpx
                    font-weight 500
                    margin-bottom 28rpx
                    overflow hidden
                    color #2D2F33
                    transition color .3s
                }
                .from {
                    float left
                    height 32rpx
                    line-height 32rpx
                    font-size 22rpx
                    font-weight 500
                    color #A8ABB3
                    max-width 60%
                    overflow hidden
                    text-overflow ellipsis
                    white-space nowrap
                }
                .num {
                    float right
                    height 32rpx
                    line-height 32rpx
                    font-size 22rpx
                    font-weight 500
                    color #A8ABB3
                }
            }
            .right {
                width: 210rpx
                height: 140rpx
                margin-top 4rpx
                float: right
                background-position center
                background-size cover
                background-repeat no-repeat
            }
            &.selected {
                .left {
                    .title {
                        color #A8ABB3
                    }
                }
            }
        }
    }
</style>
