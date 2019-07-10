<template>
    <div>
        <PageLoad :loading="pageLoading"/>
        <div class="main bg" v-show="!pageLoading">
            <div class="header-box">
                <div class="match-date">
                    <span>{{ details.start_time_string || '' }}</span>
                    <span class="week-day">{{ details.weeksDay || '' }}</span>
                    <span v-show="details.game_count">Bo{{ details.game_count }}</span>
                </div>
                <div class="team-info">
                    <div class="team">
                        <img class="team-icon" :src="details.team_a_image_thumb" />
                        <div class="team-name">{{ details.team_a_short_name || '' }}</div>
                        <div class="homesite" :class="{home: details.homesite_a == '1'}" v-show="details.homesite_a == '1' || details.homesite_b == '1'">{{ details.homesite_a == '1' ? '主场' : '客场'}}</div>
                    </div>
                    <div class="mid-wrap">
                        <div class="score-wrap">
                            <div class="score">{{ details.status != '0' ? details.team_a_win : '-' }}</div>
                            <div class="colon">:</div>
                            <div class="score">{{ details.status != '0' ? details.team_b_win : '-' }}</div>
                        </div>
                        <form @submit="matchAppointment" :report-submit="true" v-if="details.status == '0'">
                          <input type="text" name="matchId" :value="details.matchID" style="display: none;" />
                          <button formType="submit" class="btn appointment" :class="{have: details.is_remind == '1'}">{{ details.is_remind == '1' ? '已预约' : '预约提醒' }}</button>
                        </form>
                        <!--<div class="btn appointment" :class="{have: details.is_remind == '1'}" v-if="details.status == '0'" @click="matchAppointment">{{ details.is_remind == '1' ? '已预约' : '预约提醒' }}</div>-->
                        <div class="btn live" v-if="details.status == '1'">LIVE</div>
                        <div class="btn data" v-if="details.status == '2'" @click="toDataDetail">赛后数据</div>
                    </div>
                    <div class="team">
                        <img class="team-icon" :src="details.team_b_image_thumb" />
                        <div class="team-name">{{ details.team_b_short_name || '' }}</div>
                        <div class="homesite" :class="{home: details.homesite_b == '1'}" v-show="details.homesite_a == '1' || details.homesite_b == '1'">{{ details.homesite_b == '1' ? '主场' : '客场'}}</div>
                    </div>
                </div>
                <div class="support-wrap">
                    <div class="like red" :class="{support: details.teamID_a == details.support_team_id}" @click="supportTeam('a')"><text class="iconfont icon-good_left"></text></div>
                    <div class="bar">
                        <div class="inner-bar" :style="{width: details.team_a_support == details.team_b_support ? '50%' : details.team_a_support + '%'}"><div class="mask"></div></div>
                        <div class="left-support"><span class="t-name">{{ details.team_a_short_name || '' }}</span><span>{{ details.team_a_support }}%</span></div>
                        <div class="right-support"><span>{{ details.team_b_support }}%</span><span class="t-name">{{ details.team_b_short_name || '' }}</span></div>
                    </div>
                    <div class="like blue" :class="{support: details.teamID_b == details.support_team_id}" @click="supportTeam('b')"><text class="iconfont icon-good_right"></text></div>
                </div>
                <div class="tab-bar">
                    <div class="tab-item" :class="{active: tabIndex == 0, isData: details.status != '2'}" @click="switchTab(0)">赛事前瞻<text class="iconfont icon-circle_blue"></text></div>
                    <div class="tab-item" :class="{active: tabIndex == 1, isData: details.status != '2'}" @click="switchTab(1)">文字直播<text class="iconfont icon-circle_blue"></text></div>
                    <div class="tab-item chat" :class="{active: tabIndex == 2, isData: details.status != '2'}" @click="switchTab(2)">聊天室<text class="iconfont icon-circle_blue"></text></div>
                    <div class="tab-item" :class="{active: tabIndex == 3}" v-if="false" v-show="details.status == '2'" @click="switchTab(3)">赛后数据<text class="iconfont icon-circle_blue"></text></div>
                    <div class="tab-item" :class="{active: tabIndex == 4}" @click="switchTab(4)">视频<text class="iconfont icon-circle_blue"></text></div>
                </div>
            </div>
            <div class="tab-box" :class="{'live-box': tabIndex == 1 || tabIndex == 2}">
                <!--前瞻-->
                <div class="tab before-data" :class="{active: tabIndex == 0}">
                    <div class="winrate-wrap">
                        <TitleBar lineBackground="#0D8DFC" title="胜率对比" :rightBox="false" />
                        <div class="content">
                            <div class="charts-wrap">
                                <div class="charts">
                                    <CircleProgress :unit="winRate.size" :percent="winRate.leftPercent" canvasId="progressLeft" strokeType="round" :strokeWidth="winRate.width" strokeColor="#FF5C69">
                                        <span slot="txt">{{percent * 1000 / 10}}%</span>
                                    </CircleProgress>
                                </div>
                                <div class="text">总胜率</div>
                            </div>
                            <div class="charts-wrap">
                                <div class="charts">
                                    <CircleProgress :unit="winRate.size" :percent="winRate.midPercent" :win="winRate.win" canvasId="progressMid" strokeType="round" lineCapType="square" :strokeWidth="winRate.width" strokeColor="#0D8DFC" strokeBgColor="#FF5C69">
                                        <span slot="txt">{{win}}</span>
                                    </CircleProgress>
                                </div>
                                <div class="text">交手记录</div>
                            </div>
                            <div class="charts-wrap">
                                <div class="charts">
                                    <CircleProgress :unit="winRate.size" :percent="winRate.rightPercent" canvasId="progressRight" strokeType="round" :strokeWidth="winRate.width" strokeColor="#0D8DFC">
                                        <span slot="txt">{{percent * 1000 / 10}}%</span>
                                    </CircleProgress>
                                </div>
                                <div class="text">总胜率</div>
                            </div>
                        </div>
                    </div>
                    <div class="per-wrap">
                        <TitleBar lineBackground="#0D8DFC" title="赛季表现" :rightBox="false" />
                        <ul class="data-list">
                            <li class="item" v-for="(item, index) in perData" :key="index">
                                <div class="row-data">
                                    <div class="left"><div class="val" v-if="matchPer.team_a_per">{{ matchPer.team_a_per[item.field] }}{{item.field == 'SMALLDRAGON_RATE' || item.field == 'BIGDRAGON_RATE' ? '%' : ''}}</div><div class="data-bar" v-if="matchPer.team_b_per" :style="{width: matchPer.team_a_per[item.widthField]}"></div></div>
                                    <div class="mid"><img :src="'/static/images/' + item.icon + '.png'" /></div>
                                    <div class="right"><div class="data-bar" v-if="matchPer.team_b_per" :style="{width: matchPer.team_b_per[item.widthField]}"></div><div class="val" v-if="matchPer.team_b_per">{{ matchPer.team_b_per[item.field] }}{{item.field == 'SMALLDRAGON_RATE' || item.field == 'BIGDRAGON_RATE' ? '%' : ''}}</div></div>
                                </div>
                                <div class="row-text">{{ item.text }}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="history-wrap" v-if="details.near_ten">
                        <TitleBar lineBackground="#0D8DFC" title="最近10场交战" :rightBox="false" />
                        <ul class="vs-list">
                            <li class="vs-item" v-if="details.near_ten.length" v-for="(item, index) in details.near_ten" :key="index">
                                <div class="left"><span class="vs-date">{{item.start_time}}</span><span>{{item.tournament_short_name}}</span></div>
                                <div class="right">
                                    <div class="right-inner">
                                        <img class="team-icon" :src="item.team_image_thumb_a" />
                                        <div class="score">{{item.team_a_win || ''}}<span class="colon">:</span>{{item.team_b_win || ''}}</div>
                                        <img class="team-icon" :src="item.team_image_thumb_b" />
                                    </div>
                                </div>
                            </li>
                            <li class="no-data" v-if="!details.near_ten.length">暂无交战数据</li>
                        </ul>
                    </div>
                </div>
                <!--直播-->
                <div class="tab live-data" :class="{active: tabIndex == 1}">
                    <scroll-view class="scroll" scroll-y @scrolltoupper="liveUpper" @scrolltolower="liveLower" @scroll="liveScroll" :scroll-top="20" :scroll-into-view="liveData.toView" :scroll-with-animation="false">
                        <!--<Load :loading="liveData.loading" bgColor="transparent" />-->
                        <div class="live-item" v-for="(item, index) in liveData.list" :key="index" :id="'liveItem' + index">
                            <div class="avatar">
                                <img class="avatar-img" :src="item.avatar || '/static/images/default_avatar.jpg'" />
                                <!--<img class="sign-icon" src="/static/images/v.png" v-if="false && item.member_type == '1'" />-->
                                <!--<img class="sign-icon" src="/static/images/staff.png" v-if="false && item.member_type == '2'" />-->
                                <div class="sign">直播君</div>
                            </div>
                            <div class="comment-info">
                                <div class="c-username">{{ item.nickname || '' }}</div>
                                <div class="content">
                                    <img v-if="item.picture[0]" :src="item.picture[0].image_url + '?x-oss-process=image/resize,m_fill,w_' + item.picture[0].cut_w + ',h_' + item.picture[0].cut_h + ',limit_0'" mode="widthFix" />
                                    <div class="text" v-if="item.content" :class="{mt: item.picture[0]}">{{item.content}}</div>
                                </div>
                            </div>
                        </div>
                    </scroll-view>
                </div>
                <!--聊天-->
                <div class="tab chat-data" :class="{active: tabIndex == 2}">
                    <scroll-view class="scroll" scroll-y @scrolltoupper="chatUpper" @scrolltolower="chatLower" @scroll="chatScroll" :scroll-into-view="chatData.toView" :scroll-with-animation="false">
                        <!--<Load :loading="chatData.loading" bgColor="transparent" />-->
                        <div class="live-item" :class="{self: item.member_id == member_id, zhubo: item.member_type == 1}" v-for="(item, index) in chatData.list" :key="index" :id="'chatItem' + index">
                            <div class="avatar">
                                <img class="avatar-img" :src="item.avatar || '/static/images/default_avatar.jpg'" />
                                <img class="sign-icon" src="/static/images/v.png" v-if="item.member_type == '1'" />
                                <img class="sign-icon" src="/static/images/staff.png" v-if="item.member_type == '2'" />
                                <!--<div class="support-sign"><text class="iconfont icon-good_left"></text></div>-->
                            </div>
                            <div class="comment-info">
                                <div class="c-username">{{ item.nickname || '' }}</div>
                                <div class="content">
                                    <img v-if="item.picture[0]" :src="item.picture[0].image_url + '?x-oss-process=image/resize,m_fill,w_' + item.picture[0].cut_w + ',h_' + item.picture[0].cut_h + ',limit_0'" mode="widthFix" />
                                    <div class="text" v-if="item.content" :class="{mt: item.picture[0]}">{{item.content}}</div>
                                </div>
                            </div>
                        </div>
                    </scroll-view>
                    <div class="chat-send-wrap flex">
                        <input class="ipt" type="text" @confirm="commitMessage" @input="getIptValue" :value="chatData.iptMessages" confirm-type="send" :cursor-spacing="80" placeholder="我也说两句..." placeholder-class="textarea-placeholder" />
                        <div class="send-btn" @click="commitMessage">发送</div>
                    </div>
                </div>
                <!--视频-->
                <VideoListBox :tabIndex="tabIndex" :videoData="videoData" :mid="matchID" />
            </div>
        </div>
        <ClubTest :show="standard == '0' && isTest" v-on:update:test="isTest = $event" />
        <auth-set-modal :show="isShowAuthSetModal" />
    </div>
</template>

<script>
  import Api from '@/http/api'
  import Moment from 'moment'
  import CircleProgress from 'mini-circleprogress'
  import TitleBar from '@/components/TitleBar'
  import Load from '@/components/Load'
  import PageLoad from '@/components/PageLoad'
  import ClubTest from '@/components/ClubTest'
  import AuthSetModal from '@/components/AuthSetModal'
  import VideoListBox from '@/components/VideoListBox'
  import { mapState, mapMutations } from 'vuex'

  const week = {
    '0': '周日',
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六'
  }

  export default {
    components: {
      CircleProgress,
      TitleBar,
      Load,
      PageLoad,
      ClubTest,
      AuthSetModal,
      VideoListBox
    },

    data () {
      return {
        pageLoading: true,
        matchID: '',
        status: '1',
        details: {},
        matchPer: {},
        liveData: {
          firstPageKey: '',
          lastPageKey: '',
          isLock: false,
          loading: false,
          list: [],
          toView: '',
          isScroll: true,
          sort: 1,
          timer: null
        },
        chatData: {
          firstPageKey: '',
          lastPageKey: '',
          isLock: false,
          loading: false,
          list: [],
          toView: '',
          isScroll: true,
          sort: 1,
          iptMessages: '',
          timer: null
        },
        isTest: false,
        tabIndex: 0,
        percent: Math.random() / 100,
        winRate: {
          size: 230,
          width: 6,
          leftPercent: Math.random() / 100,
          midPercent: 0.5,
          rightPercent: Math.random() / 100,
          win: '0-0'
        },
        perData: [
          {text: 'KDA', icon: 'kda', field: 'KDA', widthField: 'KDA_W'},
          {text: '分均补刀', icon: 'hits', field: 'MINUTE_HITS', widthField: 'HITS_W'},
          {text: '分均经济', icon: 'money', field: 'MINUTE_MONEY', widthField: 'MONEY_W'},
          {text: '分均输出', icon: 'output', field: 'MINUTE_OUTPUT', widthField: 'OUTPUT_W'},
          {text: '控小龙率', icon: 'smalldragon', field: 'SMALLDRAGON_RATE', widthField: 'SMALLDRAGON_W'},
          {text: '控大龙率', icon: 'gigdragon', field: 'BIGDRAGON_RATE', widthField: 'BIGDRAGON_W'}
        ],
        videoData: {} // 视频数据
      }
    },
    computed: {
      ...mapState(['member', 'standard', 'isLogin', 'isShowAuthSetModal'])
    },
    onShareAppMessage (ops) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        console.log(ops.target)
      }
      let status = this.details.status
      let title = this.details.team_a_short_name + ' ' + (status == '0' ? '-' : this.details.team_a_win) + ' : ' + (status == '0' ? '-' : this.details.team_b_win) + ' ' + this.details.team_b_short_name + (status == '0' ? ' (未开始)' : status == '1' ? ' (进行中)' : ' (已结束)')
      return {
        title: title,
        path: '/pages/match/detail/main?matchID=' + this.matchID,
        success: function (res) {
          // 转发成功
          console.log('转发成功:' + JSON.stringify(res))
        },
        fail: function (res) {
          // 转发失败
          console.log('转发失败:' + JSON.stringify(res))
        }
      }
    },
    methods: {
      ...mapMutations(['setShowAuthSetModal']),
      init () {
        this.details = {}
        this.matchPer = {}
        this.status = '1'
        this.liveData.firstPageKey = ''
        this.liveData.lastPageKey = ''
        this.liveData.list = []
        this.liveData.toView = ''
        this.liveData.isScroll = true
        this.liveData.isLock = false
        this.liveData.sort = 1
        this.chatData.firstPageKey = ''
        this.chatData.lastPageKey = ''
        this.chatData.list = []
        this.chatData.toView = ''
        this.chatData.isScroll = true
        this.chatData.isLock = false
        this.chatData.sort = 1
        this.chatData.iptMessages = ''
        this.winRate.leftPercent = Math.random() / 100
        this.winRate.midPercent = Math.random() / 100
        this.winRate.rightPercent = Math.random() / 100
        this.win = '0-0'
        this.percent = Math.random() / 100
        this.isTest = false
      },
      switchTab (index) {
        switch (index) {
          case 0:
            this.tabIndex = 0
            break
          case 1:
            this.tabIndex = 1
            // this.liveData.isLock = true
            this.setToView('live')
            this.liveData.isScroll = true
            this.liveData.sort = this.liveData.list.length ? 0 : 1
            this.getLiveText()
            break
          case 2:
            this.tabIndex = 2
            // this.chatData.isLock = true
            this.setToView('chat')
            this.chatData.isScroll = true
            this.chatData.sort = this.chatData.list.length ? 0 : 1
            this.getChatData()
            break
          case 3:
            this.tabIndex = 3
            this.toDataDetail()
            break
          case 4:
            this.tabIndex = 4
            break
        }
      },
      // 滚动到顶部
      liveUpper (e) {
        if (!this.liveData.isLock) {
          this.liveData.isLock = true
          this.liveData.loading = true
          this.getPrevLiveData()
        }
      },
      // 滚动到底部
      liveLower (e) {
        this.liveData.isScroll = true
      },
      liveScroll (e) {
        // this.liveData.isLock = false
        this.liveData.isScroll = false
      },
      // 滚动到顶部
      chatUpper (e) {
        // console.log('顶部')
        if (!this.chatData.isLock) {
          this.chatData.isLock = true
          this.chatData.loading = true
          this.getPrevChatData()
        }
      },
      // 滚动到底部
      chatLower (e) {
        this.chatData.isScroll = true
      },
      chatScroll (e) {
        // this.chatData.isLock = false
        this.chatData.isScroll = false
      },
      toDataDetail () {
        let matchID = this.matchID || ''
        this.$router.push({path: '/pages/match/data/main', query: { matchID }})
      },
      setToView (type) {
        let key = type + 'Data'
        let n = this[key].list.length
        this[key].toView = n ? type + 'Item' + (n - 1) : ''
      },
      getIptValue (e) {
        this.chatData.iptMessages = e.target.value
      },
      // 比赛数据
      async getMatchDetail () {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          match_id: this.matchID
        }
        return Api.ajax('GET', '/services/match/match_info.php', params).then(resp => {
          if (resp.code === '200') {
            let data = resp.data || {}
            data.weeksDay = week[Moment.unix(data.start_time, 'x').weekday()]
            data.team_a_support = data.team_a_support === '0.0' ? '0' : data.team_a_support
            data.team_b_support = data.team_b_support === '0.0' ? '0' : data.team_b_support
            data.team_a_support = data.team_a_support === '100.0' ? '100' : data.team_a_support
            data.team_b_support = data.team_b_support === '100.0' ? '100' : data.team_b_support
            this.details = data
            let per = data.match_per || {}
            let rate = 60
            if (per.team_a_per && per.team_b_per) {
              let sumKDA = parseFloat(per.team_a_per.KDA) + parseFloat(per.team_b_per.KDA)
              let sumHITS = parseFloat(per.team_a_per.MINUTE_HITS) + parseFloat(per.team_b_per.MINUTE_HITS)
              let sumMONEY = parseFloat(per.team_a_per.MINUTE_MONEY) + parseFloat(per.team_b_per.MINUTE_MONEY)
              let sumOUTPUT = parseFloat(per.team_a_per.MINUTE_OUTPUT) + parseFloat(per.team_b_per.MINUTE_OUTPUT)
              per.team_a_per.KDA_W = (parseFloat(per.team_a_per.KDA) / sumKDA).toFixed(2) * rate + '%'
              per.team_b_per.KDA_W = (parseFloat(per.team_b_per.KDA) / sumKDA).toFixed(2) * rate + '%'

              per.team_a_per.HITS_W = (parseFloat(per.team_a_per.MINUTE_HITS) / sumHITS).toFixed(2) * rate + '%'
              per.team_b_per.HITS_W = (parseFloat(per.team_b_per.MINUTE_HITS) / sumHITS).toFixed(2) * rate + '%'

              per.team_a_per.MONEY_W = (parseFloat(per.team_a_per.MINUTE_MONEY) / sumMONEY).toFixed(2) * rate + '%'
              per.team_b_per.MONEY_W = (parseFloat(per.team_b_per.MINUTE_MONEY) / sumMONEY).toFixed(2) * rate + '%'

              per.team_a_per.OUTPUT_W = (parseFloat(per.team_a_per.MINUTE_OUTPUT) / sumOUTPUT).toFixed(2) * rate + '%'
              per.team_b_per.OUTPUT_W = (parseFloat(per.team_b_per.MINUTE_OUTPUT) / sumOUTPUT).toFixed(2) * rate + '%'

              per.team_a_per.SMALLDRAGON_W = per.team_a_per.SMALLDRAGON_RATE * rate / 100 + '%'
              per.team_b_per.SMALLDRAGON_W = per.team_b_per.SMALLDRAGON_RATE * rate / 100 + '%'

              per.team_a_per.BIGDRAGON_W = per.team_a_per.BIGDRAGON_RATE * rate / 100 + '%'
              per.team_b_per.BIGDRAGON_W = per.team_b_per.BIGDRAGON_RATE * rate / 100 + '%'
            }
            this.matchPer = per
            if (data.match_record_num.team_a_win_num === '0' && data.match_record_num.team_b_win_num === '0') {
              this.winRate.midPercent = 0.5
            } else {
              this.winRate.midPercent = parseInt(data.match_record_num.team_b_win_num) / (parseInt(data.match_record_num.team_a_win_num) + parseInt(data.match_record_num.team_b_win_num))
            }
            this.winRate.win = data.match_record_num.team_a_win_num + '-' + data.match_record_num.team_b_win_num
            this.winRate.leftPercent = data.team_vs && data.team_vs.team_a_per && data.team_vs.team_a_per.win_percentage / 100
            this.winRate.rightPercent = data.team_vs && data.team_vs.team_b_per && data.team_vs.team_b_per.win_percentage / 100
            if (data.status === '0' || data.status === '2') {
              this.tabIndex = 0
            } else if (data.status === '1') {
              this.tabIndex = 1
              this.getLiveText(1)
            }
          }
          this.pageLoading = false
        }).catch(() => {
          this.pageLoading = false
        })
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
            if (this.details.is_remind === '1') {
              this.details.is_remind = '0'
              wx.showToast({title: '已取消', duration: 800, mask: true})
            } else {
              this.details.is_remind = '1'
              wx.showToast({title: '预约成功', duration: 800, mask: true})
            }
          }
        }).catch(() => {
        })
      },
      // 直播
      getLiveText () {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          match_id: this.matchID,
          dynamic_id: this.details.dynamic_id,
          order_switch: this.liveData.sort,
          landlord_only: 1,
          limit: 20,
          last_page_key: this.liveData.lastPageKey
        }
        Api.ajax('GET', '/services/dynamic/dynamic_text_live.php', params).then(resp => {
          if (resp.code === '200') {
            let list = (resp.data.list || []).filter((item) => {
              return item.member_type == '1'
            })
            for (let i = 0; i < list.length; i++) {
              if (list[i].picture[0]) {
                list[i].picture[0].cut_w = Math.floor(list[i].picture[0].width / 3)
                list[i].picture[0].cut_h = Math.floor(list[i].picture[0].height / 3)
              }
              this.liveData.list.push(list[i])
            }
            let len = this.liveData.list.length
            if (len > 0) {
              this.liveData.firstPageKey = this.liveData.list[0].page_key
              this.liveData.lastPageKey = this.liveData.list[len - 1].page_key
            }
            this.liveData.sort = len ? 0 : 1
            if (this.liveData.isScroll) {
              this.setToView('live')
            } else {
              this.liveData.toView = ''
            }
            if (!this.details.status || this.details.status === '1') {
              this.throttle('liveData', this.getLiveText, 5000, this)
            }
          }
        }).catch(() => {
          if (!this.details.status || this.details.status === '1') {
            this.throttle('liveData', this.getLiveText, 5000, this)
          }
        })
      },
      getPrevLiveData () {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          match_id: this.matchID,
          dynamic_id: this.details.dynamic_id,
          order_switch: 1,
          landlord_only: 1,
          limit: 20,
          last_page_key: this.liveData.firstPageKey
        }
        Api.ajax('GET', '/services/dynamic/dynamic_text_live.php', params).then(resp => {
          if (resp.code === '200') {
            let list = resp.data.list || []
            let len = list.length
            if (len > 0) {
              list.reverse()
              this.liveData.firstPageKey = list[len - 1].page_key
            }
            list.forEach(item => {
              this.liveData.list.unshift(item)
            })
            if (len) {
              this.liveData.isLock = false
              this.liveData.toView = 'liveItem' + (len + 1)
            } else {
              // this.liveData.toView = ''
            }
            this.liveData.loading = false
          }
        })
      },
      // 聊天
      getChatData () {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          match_id: this.matchID,
          dynamic_id: this.details.dynamic_id,
          order_switch: this.chatData.sort,
          landlord_only: 0,
          limit: 20,
          last_page_key: this.chatData.lastPageKey
        }
        Api.ajax('GET', '/services/dynamic/dynamic_text_live.php', params).then(resp => {
          if (resp.code === '200') {
            let list = resp.data.list || []
            for (let i = 0; i < list.length; i++) {
              if (list[i].picture[0]) {
                list[i].picture[0].cut_w = Math.floor(list[i].picture[0].width / 3)
                list[i].picture[0].cut_h = Math.floor(list[i].picture[0].height / 3)
              }
              this.chatData.list.push(list[i])
            }
            let len = this.chatData.list.length
            if (len > 0) {
              this.chatData.firstPageKey = this.chatData.list[0].page_key
              this.chatData.lastPageKey = this.chatData.list[len - 1].page_key
            }
            this.chatData.sort = len ? 0 : 1
            if (this.chatData.isScroll) {
              this.setToView('chat')
            } else {
              this.chatData.toView = ''
            }
            this.throttle('chatData', this.getChatData, 5000, this)
          }
        }).catch(() => {
          this.throttle('chatData', this.getChatData, 5000, this)
        })
      },
      getPrevChatData () {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          match_id: this.matchID,
          dynamic_id: this.details.dynamic_id,
          order_switch: 1,
          landlord_only: 0,
          limit: 20,
          last_page_key: this.chatData.firstPageKey
        }
        Api.ajax('GET', '/services/dynamic/dynamic_text_live.php', params).then(resp => {
          if (resp.code === '200') {
            let list = resp.data.list || []
            let len = list.length
            if (len > 0) {
              list.reverse()
              this.chatData.firstPageKey = list[len - 1].page_key
            }
            list.forEach(item => {
              this.chatData.list.unshift(item)
            })
            if (len) {
              this.chatData.isLock = false
              this.chatData.toView = 'chatItem' + (len + 1)
            }
            this.chatData.loading = false
          }
        })
      },
      // 提交聊天
      commitMessage (e) {
        if (!this.isLogin) {
          this.setShowAuthSetModal(1)
        } else {
          if (this.standard !== '1') {
            this.isTest = true
          } else {
            this.isTest = false
            if (this.chatData.iptMessages) {
              let params = {
                member_id: this.member.member_id || '',
                token: this.member.f_token || '',
                dynamic_id: this.details.dynamic_id,
                content_html: this.chatData.iptMessages
              }
              Api.ajax('POST', '/services/dynamic/dynamic_comment_insert.php', params).then(resp => {
                if (resp.code === '200') {
                  this.chatData.isScroll = true
                  this.getChatData()
                } else {
                  wx.showToast({title: resp.message, duration: 800, mask: true})
                }
              })
              this.chatData.iptMessages = ''
            } else {
              wx.showToast({title: '说点什么吧', duration: 800, mask: true})
            }
          }
        }
      },
      // 支持队伍
      supportTeam (text) {
        let team = 'teamID_' + text
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          match_id: this.matchID,
          team_id: this.details[team]
        }
        Api.ajax('GET', '/services/match/match_support.php', params).then(resp => {
          if (resp.code === '200') {
            this.details.support_team_id = resp.data.support_team_id
            this.details.team_a_support = resp.data.team_a_support
            this.details.team_b_support = resp.data.team_b_support
          }
          wx.showToast({
            title: resp.message,
            duration: 800,
            mask: true
          })
        })
      },
      // 视频
      getVideo () {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          match_id: this.matchID
        }
        Api.ajax('GET', '/services/match/match_video_list.php', params).then(resp => {
          if (resp.code === '200') {
            this.videoData = resp.data || {}
          }
        }).catch(() => {})
      },
      throttle (type, fn, millisec, context) {
        clearTimeout(this[type].timer)
        this[type].timer = setTimeout(function () {
          fn.call(context)
        }, millisec)
      }
    },
    async mounted () {
      this.init()
      await this.getMatchDetail()
      this.getVideo()
    },
    onLoad (e) { // query需要在onLoad周期内获取
      this.matchID = e.matchID || this.$route.query.matchID
      // this.matchID = '4702'
      this.pageLoading = true
    },
    onUnload () {
      clearTimeout(this.liveData.timer)
      clearTimeout(this.chatData.timer)
    },
    async onPullDownRefresh () {
      await this.getMatchDetail()
      wx.stopPullDownRefresh()
    }
  }
</script>

<style lang="stylus">
    .header-box {
        background-color #fff
        height 412rpx
        .match-date {
            width 360rpx
            height 44rpx
            line-height 44rpx
            border-radius 22rpx
            background-color #F7F8FA
            text-align center
            color #656973
            font-size 22rpx
            font-weight 600
            margin 0 auto
            padding 0 28rpx
            .week-day {
                margin 0 8rpx
            }
        }
        .team-info {
            display flex
            justify-content space-between
            align-items center
            margin-top 16rpx
            padding 0 28rpx
            .team {
                text-align center
                width 35%
                height 184rpx
            }
            .team-icon {
                width 100rpx
                height 100rpx
            }
            .team-name {
                height: 42rpx;
                font-size: 34rpx;
                font-weight: bold;
                color: #2D2F33
                line-height: 42rpx;
                font-family Industry-Bold
            }
            .homesite {
                height: 32rpx;
                font-size: 22rpx;
                font-weight: 600;
                color: #A8ABB3
                line-height: 32rpx;
                &.home {
                    color: #2D2F33
                }
            }
            .score-wrap {
                display flex
                justify-content space-between
                font-size 56rpx
                font-weight bold
                .score {
                    padding 0 8rpx
                    font-family Industry-Bold
                }
                .colon {
                    padding 0 6rpx
                    line-height 68rpx
                }
            }
            .btn {
                text-align center
                &.appointment {
                    width: 170rpx;
                    height: 52rpx;
                    border-radius: 26rpx;
                    border: 2rpx solid #0D8DFC;
                    line-height 48rpx
                    font-size 26rpx
                    color #0D8DFC
                    font-weight 500
                    margin-top 30rpx
                    background-color #fff
                    padding: 0
                    outline none
                    &.have {
                        background-color #0D8DFC
                        color #fff
                    }
                }
                &.live {
                    width: 130rpx;
                    height: 40rpx;
                    background: linear-gradient(135deg,rgba(13,126,255,1) 0%,rgba(15,151,255,1) 100%);
                    border-radius: 20rpx;
                    line-height 38rpx
                    color #fff
                    font-size 28rpx
                    font-weight 500
                    font-family Industry-Bold
                    margin-top 30rpx
                }
                &.data {
                    width: 170rpx;
                    height: 52rpx;
                    border-radius: 26rpx;
                    border: 2rpx solid #0D8DFC;
                    line-height 48rpx
                    font-size 26rpx
                    color #0D8DFC
                    font-weight 500
                    margin-top 30rpx
                }
            }
        }
        .support-wrap {
            display flex
            justify-content space-between
            align-items center
            padding 0 32rpx
            margin-top 20rpx
            .like {
                width: 56rpx
                height 56rpx
                line-height 46rpx
                text-align center
                .iconfont {
                    font-size 26rpx
                }
                &.red {
                    background: rgba(255,245,246,1);
                    border-radius: 28rpx;
                    border:2rpx solid rgba(255,235,236,1);
                    .icon-good_left {
                        color #FF5C69
                    }
                    &.support {
                        background: #FF5C69
                    }
                }
                &.blue {
                    background: rgba(245,250,255,1);
                    border-radius: 28rpx;
                    border: 2rpx solid rgba(235,244,255,1);
                    .icon-good_right {
                        color #0D8DFC
                    }
                    &.support {
                        background: #0D8DFC
                    }
                }
                &.support {
                    border: 0
                    .iconfont {
                        color #FFF
                    }
                }
            }
            .bar {
                width calc(100% - 140rpx)
                height 8rpx
                background-color #0D8DFC
                border-radius 4rpx
                position relative
                .inner-bar {
                    height: 100%
                    border-radius 4rpx 0 0 4rpx
                    background-color #FF5C69
                    position relative
                    .mask {
                        width 4rpx
                        height 10rpx
                        position absolute
                        top -2rpx
                        right -2rpx
                        background-color #fff
                        transform: rotate(12deg)
                        -webkit-transform:rotate(12deg)
                    }
                }
                .left-support {
                    height 26rpx
                    line-height 26rpx
                    font-size 22rpx
                    color #FF5C69
                    font-weight bold
                    position absolute
                    bottom -30rpx
                    left 0
                    .t-name {
                        margin-right 10rpx
                    }
                }
                .right-support {
                    height 26rpx
                    line-height 26rpx
                    font-size 22rpx
                    font-weight bold
                    color #0D8DFC
                    position absolute
                    bottom -30rpx
                    right 0
                    .t-name {
                        margin-left 10rpx
                    }
                }
            }
        }
        .tab-bar {
            height 72rpx
            display flex
            justify-content space-between
            align-items center
            padding 0 40rpx
            margin-top 20rpx
            box-shadow:0 4rpx 8rpx 0 rgba(0,0,0,0.02),0 2rpx 0 0 rgba(0,0,0,0.03)
            .tab-item {
                // width 25%
                text-align center
                color #A8ABB3
                line-height 72rpx
                font-size 30rpx
                position relative
                .iconfont {
                    visibility hidden
                    font-size 24rpx
                    color #0D8DFC
                    position absolute
                    top -6rpx
                    right -24rpx
                }
                &.active {
                    color #2D2F33
                    font-weight bold
                    .iconfont {
                        visibility visible
                    }
                }
                /*
                &.chat {
                    .iconfont {
                        right 16rpx
                    }
                }
                */
            }
        }
    }
    .tab-box {
        margin-top 20rpx
        min-height calc(100vh - 412rpx - 20rpx)
        &.live-box {
            height calc(100vh - 412rpx - 20rpx)
        }
        .tab {
            display none
            .scroll {
                height 100%
                .live-item {
                    padding 24rpx 28rpx
                    overflow hidden
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
            &.active {
                display block
            }
            &.before-data {
                .winrate-wrap {
                    width 100%
                    height 360rpx
                    background #fff
                    .content {
                        display flex
                        justify-content space-between
                        align-items center
                        padding 0 40rpx
                    }
                    .charts-wrap {
                        .text {
                            width 100%
                            height 32rpx
                            line-height 32rpx
                            font-size 22rpx
                            font-weight 600
                            text-align center
                            color #2D2F33
                        }
                    }
                    .charts {
                        width 230rpx
                        height 230rpx
                    }
                }
                .per-wrap {
                    width 100%
                    height 644rpx
                    background #fff
                    margin-top 20rpx
                    .data-list {
                        margin-top 38rpx
                    }
                    .item {
                        +.item {
                            margin-top 12rpx
                        }
                        .row-data {
                            display flex
                            justify-content space-between
                            align-items center
                        }
                        .row-text {
                            height: 28 rpx
                            line-height 28rpx
                            font-size 20rpx
                            font-weight 600
                            text-align center
                            margin-top 6rpx
                        }
                        .data-bar {
                            width 0
                            height 12rpx
                            border-radius 6rpx
                            margin-top 6rpx
                        }
                        .val {
                            font-size 28rpx
                            font-family Industry-Bold
                        }
                        .left {
                            display flex
                            justify-content flex-end
                            align-items center
                            width calc((100% - 66rpx) / 2)
                            color #FF5C69
                            .data-bar {
                                background: linear-gradient(225deg,rgba(255,76,106,1) 0%,rgba(255,107,137,1) 100%);
                                margin-left 12rpx
                            }
                        }
                        .mid {
                            width: 66rpx
                            height 40rpx
                            text-align center
                            padding-top 4rpx
                            img {
                                width 40rpx
                                height 40rpx
                            }
                        }
                        .right {
                            display flex
                            justify-content flex-start
                            align-items center
                            width calc((100% - 66rpx) / 2)
                            color #0D8DFC
                            .data-bar {
                                background: linear-gradient(135deg,rgba(13,126,255,1) 0%,rgba(15,151,255,1) 100%)
                                margin-right 12rpx
                            }
                        }
                    }
                }
                .history-wrap {
                    background #fff
                    margin-top 20rpx
                    .vs-list {
                        padding 24rpx 28rpx
                    }
                    .vs-item {
                        width: 100%
                        height: 72rpx;
                        background: #FAFBFC;
                        border-radius: 36rpx;
                        border: 1rpx solid #F0F1F2
                        overflow hidden
                        +.vs-item {
                            margin-top 20rpx
                        }
                        .left {
                            width 63%
                            line-height 72rpx
                            color #656973
                            font-size 26rpx
                            font-weight 500
                            padding-left 36rpx
                            float left
                        }
                        .right {
                            width: 37%
                            height: 100%
                            background #fff
                            float right
                            -webkit-transform: skew(-15deg);
                            -moz-transform: skew(-15deg);
                            -o-transform: skew(-15deg);
                            -ms-transform: skew(-15deg);
                            transform: skew(-15deg);
                            border-left 1rpx solid #F0F1F2
                            .right-inner {
                                width: 100%
                                height: 100%
                                display flex
                                justify-content center
                                align-items center
                                -webkit-transform: skew(15deg);
                                -moz-transform: skew(15deg);
                                -o-transform: skew(15deg);
                                -ms-transform: skew(15deg);
                                transform: skew(15deg);
                                color #2D2F33
                                font-size 26rpx
                                font-weight 600
                                .team-icon {
                                    width: 48rpx
                                    height 48rpx
                                    margin 0 16rpx
                                }
                                .colon {
                                    margin 0 10rpx
                                }
                            }
                        }
                        .vs-date {
                            margin-right 24rpx
                        }
                    }
                    .no-data {
                        text-align center
                        font-size 26rpx
                        color #A8ABB3
                        padding 4rpx 0
                    }
                }
            }
            &.live-data, &.chat-data {
                height 100%
            }
            &.chat-data {
                .scroll {
                    height calc(100% - 108rpx)
                    .live-item {
                        .avatar {
                            .support-sign {
                                width 32rpx
                                height 32rpx
                                background #fff
                                border-radius 50%
                            }
                        }
                        .comment-info {
                            .content {
                                width auto
                                min-width 30%
                                max-width 70%
                                background #fff
                                box-shadow 0 0 0 1rpx #F0F1F2
                                float left
                                .text {
                                    color #2D2F33
                                }
                            }
                        }
                        &.zhubo {
                            .comment-info {
                                .content {
                                    background #0D8DFC
                                    .text {
                                        color #FFF
                                    }
                                }
                            }
                        }
                        &.self {
                            .avatar {
                                float right
                            }
                            .comment-info {
                                margin-left 0
                                margin-right 90rpx
                                .c-username {
                                    text-align right
                                }
                                .content {
                                    float right
                                    background #5C6373
                                    .text {
                                        color #FFF
                                    }
                                }
                            }
                        }
                    }
                }
            }

            .chat-send-wrap {
                width 100%
                height 108rpx
                box-shadow 0 0 0 1rpx #F0F1F2
                /*padding-top 20rpx*/
                background #fff
                align-items center
                justify-content space-between
                padding 0 28rpx
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
                .textarea-placeholder {
                    color #D2D4D9
                }
                .send-btn {
                    width: 120rpx
                    height: 64rpx
                    background: #0D8DFC
                    border-radius: 32rpx
                    color #fff
                    line-height 64rpx
                    font-weight 600
                    text-align center
                    font-size 28rpx
                }
            }
            .section {
                width 100%
                height 200rpx
                background #fff
                padding 0 20rpx
                .tools-bar {
                    padding 12rpx 0
                    display flex
                    display -webkit-flex
                    justify-content space-between
                    .btn {
                        width 100rpx
                        height 50rpx
                        line-height 50rpx
                        text-align center
                        font-size 28rpx
                    }
                }
                .text-area {
                    width 100%
                    height 110rpx
                    background #f7f8fA
                    margin 0 auto
                    font-size 28rpx
                }
            }

            &.video {
                background #fff
                .video-list {
                    padding 10rpx 28rpx 28rpx
                    justify-content space-between
                    flex-wrap wrap
                    .video-item {
                        width 49%
                        /*height 240rpx*/
                        margin-top 20rpx
                        .video-bg {
                            width 100%
                            height 240rpx
                            background-repeat no-repeat
                            background-position center
                            background-size cover
                            border-radius 8rpx
                            align-items center
                            justify-content center
                        }
                        .play-icon {
                            width 60rpx
                            height 60rpx

                        }
                    }
                }
            }
        }
    }
</style>
