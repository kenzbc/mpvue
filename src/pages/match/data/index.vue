<template>
    <div>
        <div class="main">
            <web-view :src="src" @load="setTitle"></web-view>
        </div>
    </div>
</template>

<script>
  const _src = 'https://img1.famulei.com/active/match-data/mobile.html?matchID='
  export default {
    data () {
      return {
        matchID: '',
        url: ''
      }
    },
    computed: {
      src () {
        return this.matchID ? _src + this.matchID : this.url.indexOf('?') !== -1 ? this.url + '&platform=weixin' : this.url + '?platform=weixin'
      }
    },
    onShareAppMessage (ops) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        // console.log(ops.target)
      }
      return {
        title: 'score',
        path: '/pages/match/data/main?matchID=' + this.matchID,
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
    methods: {
      init () {},
      setTitle () {
        /*
        wx.setNavigationBarTitle({
          title: '赛后数据'
        })
        */
      }
    },
    mounted () {
      this.init()
    },
    onLoad (e) { // query需要在onLoad周期内获取
      this.matchID = e.matchID || this.$route.query.matchID
      this.url = e.url || this.$route.query.url
      if (e.redKey) {
        this.url += '?ssdb_key=' + e.redKey
      }
    }
  }
</script>

<style lang="stylus"></style>
