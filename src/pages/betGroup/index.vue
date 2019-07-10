<template>
    <div>
        <PageLoad :loading="loading" />
        <div class="main bet">
            <div class="top-info">
                <div class="bet-title">{{betGroup.title}}</div>
                <div class="member flex">
                    <div class="avatar" :style="{backgroundImage: 'url(' + (betGroup.member_avatar || 'https://img1.famulei.com/active/wx_share/default_avatar.jpg') + ')'}">
                        <img class="sign-icon" src="/static/images/v.png" v-if="betGroup.member_type == '1'" />
                        <img class="sign-icon" src="/static/images/staff.png" v-if="betGroup.member_type == '2'" />
                    </div>
                    <div class="name">{{ betGroup.member_nickname }}</div>
                </div>
            </div>
            <div class="bet-list">
                <div class="item" v-if="betGroup.bet_items" v-for="(item, index) in betGroup.bet_items" :key="item.id">
                    <div class="row-1 flex">
                        <div class="left flex">
                            <img :src="item.tournament_image" />
                            <div class="t-name">{{item.tournament_name}}</div>
                            <div class="date">{{item.match_date}}</div>
                            <div class="team-vs" v-if="item.match_team_a && item.match_team_b">{{item.match_team_a}} vs {{item.match_team_b}}</div>
                        </div>
                        <div class="right flex" v-if="false" @tap="getItemDetail(item)"><text class="iconfont icon-menu"></text></div>
                    </div>
                    <div class="row-2">{{item.title}}</div>
                    <div class="row-3 flex">
                        <div>{{item.item_name}}({{item.odds}})</div>
                        <div class="guozi flex"><span>{{item.bet_guozi}}</span><img class="icon-gz" src="/static/images/guozi.png" mode="widthFix" /></div>
                        <div class="edit" @tap="editMoney(item)">修改金额</div>
                    </div>
                    <div class="row-4 flex">
                        <div class="left flex"><span>{{item.people_num}}人已投注{{item.total_price}}</span><img class="icon-gz" src="/static/images/guozi.png" mode="widthFix" /></div>
                        <div class="right">截止 {{item.endTimeStr}}</div>
                    </div>
                </div>
            </div>
            <div class="bottom-info flex">
                <div class="left-box flex">
                    <div class="guozi-count">
                        <div class="flex block"><span>投注消耗: {{result}}</span><img class="icon-gz" src="/static/images/guozi.png" mode="widthFix" /></div>
                        <div class="flex block"><span>我的果子: {{accountGuoZi}}</span><img class="icon-gz" src="/static/images/guozi.png" mode="widthFix" /></div>
                    </div>
                    <div class="guozi-reward">
                        <div class="block">全对奖励: {{betGroup.reward_double}}x</div>
                        <div class="block">最高可获: {{profit}}</div>
                    </div>
                </div>
                <div class="right-btn flex" :class="{disabled: !isBetting}" @tap="pushBet">一键跟投</div>
            </div>
            <!--修改金额-->
            <div class="pop-layer" :class="{show: isShowEditMoneyBox}" @tap="closeEditMoneyBox"></div>
            <div class="edit-gz" :class="{show: isShowEditMoneyBox}">
                <div class="title flex">{{betItem.item_name}} ({{betItem.odds}})</div>
                <div class="select-box flex">
                    <div class="num-item" :class="{active: item.active}" @tap="selectMoney(index)" v-for="(item, index) in selectMoneyList" :key="item.value">{{item.value}}</div>
                </div>
                <div class="flex other"><span>提示: 单项投注10果子起</span></div>
                <div class="flex bottom-box">
                    <div class="left-wrap flex">
                        <div class="flex block">可投: 1000<img class="icon-gz" src="/static/images/guozi.png" mode="widthFix" /></div>
                        <div class="flex block">可获: {{selectProfit}}<img class="icon-gz" src="/static/images/guozi.png" mode="widthFix" /></div>
                    </div>
                    <div class="ok-btn flex" :class="{disabled: !isSelect}" @tap="selectOk">确定</div>
                </div>
            </div>
            <div class="bet-item-detail" v-if="false">
                <div class="t-name"></div>
                <div class="title"></div>
                <scroll-view scroll-y style="height: 100px;"></scroll-view>
            </div>
        </div>
    </div>
</template>

<script>
  import Api from '@/http/api'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import Moment from 'moment'
  import PageLoad from '@/components/PageLoad'

  export default {
    data () {
      return {
        loading: true,
        betId: '',
        betGroup: {},
        betItem: {}, // 选中的竞猜项
        selectMoneyList: [
          {
            active: false,
            value: 10
          },
          {
            active: false,
            value: 50
          },
          {
            active: false,
            value: 100
          },
          {
            active: false,
            value: 200
          },
          {
            active: false,
            value: 500
          },
          {
            active: false,
            value: 1000
          }
        ],
        selectIndex: -1, // 选择金额的索引
        selectGuoZi: 0, // 选择的金额
        selectProfit: 0, // 选择金额后可得果子数
        bettingList: [], // 投注金额列表
        isShowEditMoneyBox: false, // 是否显示金额修改
        isSelect: false // 是否选择金额
      }
    },
    components: {
      PageLoad
    },
    computed: {
      ...mapState(['member']),
      // 账户果子数
      accountGuoZi () {
        return (this.member.guozi1 || 0)
      },
      // 是否可投注
      isBetting () {
        return parseInt(this.accountGuoZi) < this.result ? 0 : 1
      },
      // 投注果子数
      result () {
        let bet = this.betGroup.bet_items || []
        let count = 0
        bet.forEach((item) => {
          count += item.bet_guozi
        })
        return count
      },
      // 预估收益
      profit () {
        let multiply = parseFloat(this.betGroup.reward_double || 0)
        let bet = this.betGroup.bet_items || []
        let count = 0
        bet.forEach((item) => {
          count += item.bet_guozi * parseFloat(item.odds || 0)
        })
        return Math.ceil((count - this.result) * multiply + this.result)
      }
    },
    methods: {
      // ...mapActions(['']),
      ...mapMutations(['setGuoZi']),
      init () {
        this.loading = true
        this.betGroup = {}
        this.betItem = {}
        this.selectIndex = -1
        this.selectGuoZi = 0
        this.selectProfit = 0
        this.isShowEditMoneyBox = false
        this.isSelect = false
        this.selectMoneyList.forEach((item) => {
          item.active = false
        })
      },
      // 组合菠菜
      async getBet () {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          bet_group_id: this.betId
        }
        return Api.ajax('GET', '/services/bet/group_bet_info.php', params).then(resp => {
          if (resp.code === '200') {
            let list = resp.data.bet_items || []
            let guozi = 100
            let count = guozi * parseInt(resp.data.unknown_count || 0)
            if (count > parseInt(this.accountGuoZi)) {
              guozi = 10
            }
            list.forEach((item) => {
              if (item.bet_item_id === item.result_item_id) {
                item.bg_img = '/static/images/bet/bet_blue.png'
              } else {
                item.bg_img = '/static/images/bet/bet_red.png'
              }
              item.endTimeStr = Moment.unix(item.bet_end_time, 'x').format('MM-DD HH:mm')
              item.bet_guozi = guozi
            })
            this.betGroup = resp.data
            console.log(this.betGroup)
          }
        })
      },
      // 一键跟投
      pushBet () {
        console.log(this.isBetting)
        if (!this.isBetting) return
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          bet_group_id: this.betId,
          is_private: 0, // 是否私密 0:公开 1:私密
          bet_items: ''
        }
        // 生成bet_items参数
        if (this.betGroup.bet_items) {
          let betList = this.betGroup.bet_items.map((item) => {
            return {
              bet_id: item.bet_id,
              bet_item_id: item.bet_item_id,
              guozi_num: item.bet_guozi
            }
          })
          params.bet_items = JSON.stringify(betList)
        }
        console.log(params)
        return Api.ajax('GET', '/services/bet/group_follow.php', params).then(resp => {
          if (resp.code === '200') {
            if (resp.data.status == '0') {
              let total = this.accountGuoZi - this.result
              this.setGuoZi(total)
              wx.showToast({
                title: '跟投成功',
                duration: 800,
                mask: true
              })
            } else if (resp.data.status == '-5') {
              wx.showToast({
                title: '投注超过上限',
                duration: 800,
                mask: true
              })
            }
          }
        })
      },
      // 修改金额
      editMoney (item) {
        this.betItem = item
        if (this.selectIndex !== -1) {
          this.selectMoneyList[this.selectIndex].active = false
          this.selectIndex = -1
        }
        this.isShowEditMoneyBox = true
      },
      // 选择金额
      selectMoney (i) {
        if (this.selectIndex === -1) {
          this.selectIndex = i
        }
        this.selectMoneyList[this.selectIndex].active = false
        this.selectMoneyList[i].active = true
        this.selectGuoZi = this.selectMoneyList[i].value
        this.selectProfit = Math.round(this.selectGuoZi * parseFloat(this.betItem.odds || 0))
        this.selectIndex = i
        this.isSelect = true
      },
      // 确定选择的金额
      selectOk () {
        if (this.isSelect) {
          this.betItem.bet_guozi = this.selectGuoZi
          this.isShowEditMoneyBox = false
          this.isSelect = false
        } else {
          wx.showToast({
            title: '选择果子数',
            duration: 500,
            mask: true
          })
        }
      },
      // 关闭修改金额弹窗
      closeEditMoneyBox () {
        this.isShowEditMoneyBox = false
        this.isSelect = false
      },
      // 显示投注项详情
      getItemDetail (item) {}
    },
    async mounted () {
      await this.getBet()
      this.loading = false
    },
    onLoad (e) { // query需要在onLoad周期内获取
      this.betId = e.betId || this.$route.query.betId
      this.init()
    }
  }
</script>

<style lang="stylus" scoped>
    .bet {
        min-height 100vh
        padding-bottom 106rpx
    }
    .icon-gz {
        width 24rpx
        height 24rpx
        display block
        margin-left 4rpx
    }
    .top-info {
        padding 20rpx 28rpx
        background #fff
        .bet-title {
            font-size 34rpx
        }
        .member {
            align-items center
            margin-top 20rpx
            .avatar {
                width 48rpx
                height 48rpx
                background-repeat no-repeat
                background-position center
                background-size cover
                position relative
                border-radius 50%

                .sign-icon {
                    width 30rpx
                    height 30rpx
                    position absolute
                    right -8rpx
                    bottom -8rpx
                }
            }
            .name {
                height 40rpx
                line-height 40rpx
                font-size 28rpx
                font-weight 600
                margin-left 18rpx
            }
        }
    }
    .bet-list {
        margin-top 20rpx
        .item {
            border-bottom 2rpx solid #F0F1FA
            padding 20rpx 28rpx
            background #fff
            .left {
                align-items center
                img {
                    width 30rpx
                    height: 30rpx
                    display block
                }
            }
            .row-1 {
                align-items center
                justify-content space-between
                .left {
                    font-size 28rpx
                    .t-name {
                        margin-left 16rpx
                    }
                    .date {
                        margin-left 16rpx
                    }
                    .team-vs {
                        margin-left 16rpx
                    }
                }
                .right {
                    width: 30rpx
                    height 30rpx
                    border 1rpx solid #656973
                    border-radius 50%
                    align-items center
                    justify-content center
                    .icon-menu {
                        font-size 12rpx
                        color #656973
                        display block
                    }
                }
            }
            .row-2 {
                font-size 32rpx
                font-weight 600
                margin-top 14rpx
            }
            .row-3 {
                align-items center
                justify-content space-between
                font-size 26rpx
                margin-top 20rpx
                .guozi {
                    align-items center
                }
            }
            .row-4 {
                align-items center
                justify-content space-between
                font-size 24rpx
                margin-top 20rpx
                .left {
                    color: #A8ABB3
                    .icon-gz {
                        width 24rpx
                        height 24rpx
                    }
                }
                .right {
                    color red
                }
            }
        }
    }

    .bottom-info {
        background #fff
        font-size 24rpx
        color #656973
        width 100%
        height 106rpx
        position fixed
        left 0
        bottom 0
        z-index 1
        .left-box {
            width 70%
            padding 6rpx 20rpx 20rpx
        }
        .guozi-count {
            width 55%
        }
        .guozi-reward {
            width 45%
        }
        .block {
            align-items center
            margin-top 10rpx
        }
        .right-btn {
            width 30%
            background #0D8DFC
            color #fff
            font-size 28rpx
            justify-content center
            align-items center
            &.disabled {
                background #ccc
            }
        }
    }
    .edit-gz {
        width 100%
        height 310rpx
        position fixed
        left 0
        bottom -310rpx
        z-index 3
        background #fff
        overflow hidden
        transition bottom .2s
        &.show {
            bottom 0
        }
        .title {
            height 60rpx
            border-bottom 2rpx solid #F0F1FA
            padding 0 20rpx
            font-size 28rpx
            align-items center
        }
        .select-box {
            padding 40rpx 20rpx 20rpx
            justify-content space-between
            .num-item {
                width 14%
                height 50rpx
                text-align center
                line-height 46rpx
                border 2rpx solid #F0F1FA
                border-radius 4rpx
                font-size 20rpx
                &.active {
                    background #0D8DFC
                    border 0
                    line-height 50rpx
                    color #fff
                }
            }
        }
        .other {
            font-size 24rpx
            color #A8ABB3
            border-bottom 2rpx solid #F0F1FA
            padding 15rpx 20rpx
        }
        .bottom-box {
            height 80rpx
            .block {
                font-size 24rpx
                color #A8ABB3
                align-items center
                margin-left 20rpx
                +.block {
                    margin-left 40rpx
                }
            }
            .left-wrap {
                width 70%
            }
            .ok-btn {
                width 30%
                background #0D8DFC
                font-size 24rpx
                color #fff
                align-items center
                justify-content center
                &.disabled {
                    background #ccc
                }
            }
        }
    }
    .pop-layer {
        width 100%
        height 100%
        position fixed
        left 0
        top 0
        background rgba(0,0,0, 0)
        opacity 0
        z-index -1
        visibility hidden
        transition .3s
        &.show {
            background rgba(0,0,0, .6)
            opacity 1
            z-index 1
            visibility visible
        }
    }
</style>
