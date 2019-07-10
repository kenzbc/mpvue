<template>
    <div>
        <PageLoad :loading="loading"/>
        <div class="main match-page" v-show="!loading">
            <div class="day" v-for="(day, i) in matchList" :key="i" :class="{today: day.week == '今天'}">
                <div class="date"><span class="md">{{ day.dateStr }}</span><span class="wd">{{ day.week }}</span></div>
                <ul class="tournament" v-if="day.tournament_list && day.tournament_list.length" v-for="(tournament, n) in day.tournament_list" :key="n">
                    <li class="t-title">
                        <!--<img class="t-icon" :src="" />-->
                        <span>{{ tournament.tournament_name }} - {{ tournament.round_name }}</span>
                    </li>
                    <li class="match" :class="match.status == '2' ? 'end' : match.status == '1' ? 'underway' : ''" v-for="(match, m) in tournament.match_list" :key="m">
                        <div @click="toMatchDetail(match.matchID)">
                            <div class="left-box" :class="{nosite: match.status != '1' && !match.homesite}">
                                <div class="time">{{ match.time }}</div>
                                <div class="status">{{ match.status == '1' ? 'LIVE' : match.homesite }}</div>
                            </div>
                            <div class="line"></div>
                            <div class="mid-box">
                                <div class="team team-a">
                                    <img :src="match.team_a_image_thumb" alt="" />
                                    <div class="team-name">{{ match.team_a_en_name }}</div>
                                    <div class="site" :class="{home: match.homesite_a == '1'}" v-if="match.homesite_a == '1' || match.homesite_b == '1'">{{ match.homesite_a === '1' ? '主' : '客' }}</div>
                                    <div class="score" :class="{max: match.team_a_win > match.team_b_win}" v-show="match.status != '0'">{{ match.team_a_win }}</div>
                                </div>
                                <div class="team team-b">
                                    <img :src="match.team_b_image_thumb" alt="" />
                                    <div class="team-name">{{ match.team_b_en_name }}</div>
                                    <div class="site" :class="{home: match.homesite_b == '1'}" v-if="match.homesite_a == '1' || match.homesite_b == '1'">{{ match.homesite_b === '1' ? '主' : '客' }}</div>
                                    <div class="score" :class="{max: match.team_b_win > match.team_a_win}" v-show="match.status != '0'">{{ match.team_b_win }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="line" v-show="match.status != '0'"></div>
                        <div class="right-box">
                            <div class="btn-wrap" v-show="match.status == '2'">
                                <img class="video-btn" src="/static/images/video_icon.png" alt="" v-if="false" />
                                <img class="data-btn" src="/static/images/data_icon.png" @click="toDataDetail(match.matchID)" />
                            </div>
                            <div class="btn-wrap" v-show="match.status == '1'">
                                <div class="text-btn text-live-btn" @click="toMatchDetail(match.matchID)">文字直播</div>
                            </div>
                            <div class="btn-wrap" v-show="match.status == '0'">
                                <form @submit="matchAppointment" :report-submit="true">
                                    <input type="text" name="day" :value="i" style="display: none;" />
                                    <input type="text" name="tournament" :value="n" style="display: none;" />
                                    <input type="text" name="match" :value="m" style="display: none;" />
                                    <input type="text" name="matchId" :value="match.matchID" style="display: none;" />
                                    <button formType="submit" class="text-btn appointment-btn" :class="{appointment: match.is_remind == '1'}">{{ match.is_remind == '1' ? '已预约' : '预约' }}</button>
                                </form>
                            </div>
                        </div>
                        <div class="games" v-if="match.status == '0' && match.game_count">BO{{ match.game_count }}</div>
                    </li>
                </ul>
                <div class="no-data" v-show="!day.tournament_list.length">暂无赛事</div>
            </div>
            <Load :loading="false" />
            <div class="back-today" @click="backToday" v-show="!isDownRefresh && isBack">今天</div>
        </div>
        <auth-set-modal :show="isShowAuthSetModal" />
    </div>
</template>

<script>
  // import { formatTime } from '@/utils/index'
  import Api from '@/http/api'
  import Load from '@/components/Load'
  import PageLoad from '@/components/PageLoad'
  import AuthSetModal from '@/components/AuthSetModal'
  import Moment from 'moment'
  import { mapState, mapMutations } from 'vuex'

  export default {
    components: {
      Load,
      PageLoad,
      AuthSetModal
    },
    data () {
      return {
        loading: true,
        isUpLock: false,
        isBack: 0,
        matchList: [],
        prevDate: '',
        scrollTop: 0,
        isDownRefresh: false
      }
    },
    computed: {
      ...mapState(['member', 'isShowAuthSetModal', 'isLogin'])
    },
    methods: {
      ...mapMutations(['setShowAuthSetModal']),
      init () {
        this.loading = true
        this.isUpLock = false
        this.isBack = 0
        this.matchList = []
        this.prevDate = ''
        this.scrollTop = 0
        this.isDownRefresh = false
      },
      // 滚动到今天
      async backToday () {
        wx.pageScrollTo({scrollTop: this.scrollTop - 10})
        this.isBack = false
      },
      // 获取比赛列表，num 0:下一页 1:上一页
      async getWeekMatch (num) {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          page_op: num,
          last_match_start_time: this.prevDate,
          tournament_id: ''
        }
        return Api.ajax('GET', '/services/match/match_home_list.php', params).then(resp => {
          if (resp.code === '200') {
            let list = [].concat(resp.data.list || [])
            let len = list.length
            if (num === 1) {
              list.reverse().forEach((item, index) => {
                if (item.tournament_list && item.tournament_list.length) {
                  item.dateStr = Moment.unix(item.tournament_list[0].match_list[0].start_time, 'x').format('MM.DD')
                } else {
                  if (item.week === '今天') {
                    item.dateStr = Moment().format('MM.DD')
                  }
                }
                if (index === len - 1) {
                  this.prevDate = item.tournament_list[0].match_list[0].start_time
                }
                this.matchList.unshift(item)
              })
            } else {
              list.forEach((item, index) => {
                if (item.tournament_list && item.tournament_list.length) {
                  item.dateStr = Moment.unix(item.tournament_list[0].match_list[0].start_time, 'x').format('MM.DD')
                } else {
                  if (item.week === '今天') {
                    item.dateStr = Moment().format('MM.DD')
                  }
                }
                if (index === 0) {
                  this.prevDate = item.tournament_list[0].match_list[0].start_time
                }
                this.matchList.push(item)
              })
            }
          }
        }).catch(() => {
        })
      },
      formatMatchDataBak (data, num) {
        let list = []
        let dataStr = ''
        for (let key in data) {
          let item = {}
          let info = data[key].info || {}
          dataStr = key || ''
          item.today = data[key].today || false
          item.dateStr = dataStr.replace(/\./g, '-') || ''
          item.shortDateStr = Moment(item.dateStr).format('MM.DD') || ''
          item.weekday = Moment(item.dateStr).format('dddd')
          item.timestamp = Date.parse(item.dateStr) || ''
          item.info = []
          for (let k in info) {
            let infoItem = info[k]
            if (infoItem.list && infoItem.list[0]) {
              infoItem.tournamentinfo.round_name = infoItem.list[0].round_name || ''
            }
            item.info.push(infoItem)
            infoItem = null
          }
          list.push(item)
          item = null
        }

        let isMatch = list.some(function (item, index) {
          return item.info.length !== 0
        })
        return {
          list: list,
          isMatch: isMatch,
          week: num < 0 ? 'prev' : num > 0 ? 'next' : 'curr'
        }
      },
      // 比赛预约
      matchAppointment (e) {
        if (!this.isLogin) {
          this.setShowAuthSetModal(1)
          return false
        }
        let obj = e.mp.detail
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          match_id: obj.value.matchId || '',
          form_id: obj.formId
        }
        Api.ajax('GET', '/services/match/match_remind.php', params).then(resp => {
          if (resp.code === '200') {
            let item = this.matchList[obj.value.day].tournament_list[obj.value.tournament].match_list[obj.value.match] || {}
            if (item.matchID === obj.value.matchId) {
              if (item.is_remind === '1') {
                item.is_remind = '0'
                wx.showToast({title: '已取消', duration: 800, mask: true})
              } else {
                item.is_remind = '1'
                wx.showToast({title: '预约成功', duration: 800, mask: true})
              }
            }
            item = null
          }
        }).catch(() => {
        })
      },
      toMatchDetail (mid) {
        let matchID = mid || ''
        // let matchID = '2611'
        this.$router.push({path: '/pages/match/detail/main', query: { matchID }})
      },
      toDataDetail (mid) {
        let matchID = mid || ''
        this.$router.push({path: '/pages/match/data/main', query: { matchID }})
      },
      getQueryInfo () {
        let query = wx.createSelectorQuery()
        query.select('.today').boundingClientRect().exec((res) => {
          this.isDownRefresh = false
          this.scrollTop = res[0].top || 0
          if (!this.isBack) {
            wx.pageScrollTo({scrollTop: (this.scrollTop - 10)})
          }
        })
      }
    },
    async mounted () {
      await this.getWeekMatch(0)
      this.loading = false
      setTimeout(() => {
        this.getQueryInfo()
      }, 300)
    },
    onPageScroll (e) {
      // console.log(e)
      let diff = e.scrollTop - this.scrollTop
      // console.log(e.scrollTop - this.scrollTop)
      this.isBack = (diff > 500 || diff < -800) ? 1 : 0
    },
    onShareAppMessage (ops) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        // console.log(ops.target)
      }
      return {
        title: '全球英雄联盟赛程时间表',
        path: 'pages/match/main',
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
      if (this.isUpLock) return
      this.isUpLock = true
      this.isDownRefresh = true
      await this.getWeekMatch(1)
      wx.stopPullDownRefresh({success: () => {
        console.log('-------> down')
        setTimeout(() => {
          this.getQueryInfo()
        }, 300)
      }})
      this.isUpLock = false
    },
    created () {
      // const logs = (wx.getStorageSync('logs') || [])
      // this.logs = logs.map(log => formatTime(new Date(log)))
    }
  }
</script>

<style lang="stylus" scoped>
    .match-page {
        padding-top 18rpx
        padding-bottom 6rpx
    }
    .back-today {
        width: 120rpx
        height: 60rpx
        text-align center
        line-height 60rpx
        color #fff
        background rgba(13,141,252,0.8)
        border-radius 30rpx
        font-size 28rpx
        position fixed
        bottom 30rpx
        left calc(50% - 60rpx)
    }
    .no-data {
        width: 100%
        font-size 28rpx
        text-align center
        color #A8ABB3
        padding 10rpx 0 16rpx
    }
    .no-match {
        width 100%
        margin-top 18rpx
        background-color #fff
        box-shadow 0 0 0 2rpx #F0F1F2
        padding 24rpx 28rpx

        .date {
            height 58rpx
            line-height 58rpx
            font-size 48rpx
            font-weight normal
            margin-bottom 18rpx
            font-family Industry-Bold
        }
    }
    .week + .week {
        margin-top 18rpx
    }
    .day {
        width 100%
        background-color #fff
        box-shadow 0 0 0 2rpx #F0F1F2
        padding 24rpx 28rpx
        +.day {
            margin-top 18rpx
        }
        .tournament {
            +.tournament {
                margin-top 32rpx
            }
        }
        .date {
            margin-bottom 18rpx
            height 60rpx
            .md {
                display inline-block
                height 58rpx
                line-height 58rpx
                font-family Industry-Bold
                font-size 48rpx
                font-weight normal
            }
            .wd {
                display inline-block
                vertical-align 6rpx
                height 32rpx
                line-height 32rpx
                font-size 22rpx
                font-weight 400
                color #656973
                margin-left 20rpx
            }
        }

        .tournament {
            .t-title {
                height 48rpx
                line-height 48rpx
            }
            .t-icon {
                display block
                float left
                width 48rpx
                height 48rpx
                margin-right 6rpx
            }
            span {
                font-size 28rpx
                font-weight 600
            }
            .match {
                width: 100%
                height 140rpx
                background-color #fff
                box-shadow 0 4rpx 16rpx -4rpx rgba(0,0,0,0.04)
                border-radius 12rpx
                border 2rpx solid #F0F1F2
                margin-top 16rpx

                .left-box {
                    width 19%
                    height 100%
                    float left
                    text-align center
                    padding-top 34rpx
                    .time {
                        width 100%
                        height: 34 rpx
                        line-height 34rpx
                        font-size 28rpx
                        font-weight bold
                        margin-bottom 8rpx
                        font-family "Industry-Bold"
                    }
                    .status {
                        width 76rpx
                        height 32rpx
                        text-align center
                        line-height 32rpx
                        border-radius 16rpx
                        font-size 22rpx
                        color #A8ABB3
                        margin 0 auto
                    }
                    &.nosite {
                        padding-top 50rpx
                        .status {
                            display none
                        }
                    }
                }

                .line {
                    float left
                    width 2rpx
                    height 92rpx
                    background-color #F0F1F2
                    margin-top 24rpx
                }

                .mid-box {
                    width 40%
                    height 100%
                    float left
                    padding 16rpx 20rpx 30rpx
                    .team {
                        height 54rpx
                        line-height 54rpx
                        img {
                            width 54rpx
                            height 54rpx
                            float left
                            margin-right 10rpx
                        }
                        .team-name {
                            float left
                            height 54rpx
                            line-height 54rpx
                            font-size 28rpx
                            font-family Industry-Bold
                            font-weight normal
                            max-width 62%
                            white-space nowrap
                            overflow hidden
                            text-overflow ellipsis
                        }
                        .site {
                            float left
                            width 30rpx
                            height 30rpx
                            line-height 30rpx
                            border-radius 8rpx
                            text-align center
                            font-size 20rpx
                            color #fff
                            background-color #656973
                            margin-top 12rpx
                            margin-left 12rpx
                            &.home {
                                background-color #0D8DFC
                            }
                        }
                        .score {
                            float right
                            width 30rpx
                            height 54rpx
                            line-height 54rpx
                            font-size 32rpx
                            font-weight bold
                            color #A8ABB3
                            font-family Industry-Bold
                            text-align center
                            &.max {
                                color #0D8DFC
                            }
                        }
                    }
                }

                .games {
                    float right
                    height 100%
                    line-height 136rpx
                    font-size 26rpx
                    color #A8ABB3
                    margin-right 5%
                }

                .right-box {
                    height 100%
                    float right
                    padding-right 28rpx
                    .btn-wrap {
                        margin-top 44rpx
                        .video-btn, .data-btn {
                            width 64rpx
                            height 64rpx
                        }
                        .data-btn {
                            /*margin-left 20rpx*/
                            margin-right 40rpx
                        }
                        .text-btn {
                            height 52rpx
                            border-radius 26rpx
                            border 2rpx solid #0D8DFC
                            color #0D8DFC
                            line-height 52rpx
                            text-align center
                            font-size 26rpx
                            font-weight 500
                            background #fff
                            &.text-live-btn {
                                width 152rpx

                            }
                            &.appointment-btn {
                                width 120rpx
                                padding 0
                                margin 0
                                &:after {
                                    border none
                                }
                                &.appointment {
                                    background #0D8DFC
                                    color #fff
                                }
                            }
                        }

                    }
                }

                &.underway {
                    .left-box {
                        .status {
                            background linear-gradient(315deg,#FF5160 0%,#FF6579 100%)
                            color #fff
                        }
                    }
                    .mid-box {
                        width 51%
                        .team {
                            .score {
                                color #2D2F33
                            }
                        }
                    }
                }
                &.end {
                    .mid-box {
                        width 51%
                    }
                    .right-box {
                        .btn-wrap {
                            margin-top 38rpx
                        }
                    }
                }
            }
        }

        &.today {
            .date {
                .wd {
                    width: 56rpx;
                    background: linear-gradient(135deg,rgba(0,113,242,1) 0%,rgba(5,147,255,1) 100%);
                    border-radius:4rpx;
                    text-align center
                    color #fff
                }
            }
        }
    }
</style>
