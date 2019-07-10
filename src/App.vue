<script>
  // import Api from '@/http/api'
  import {mapActions} from 'vuex'

  export default {
    computed: {
      // ...mapState(['code'])
    },
    methods: {
      // ...mapMutations(['setCode']),
      ...mapActions(['wxLogin'])
    },
    mounted() {
      this.wxLogin()
    }
  }
</script>

<style>
  @import "../static/font/iconfont.css";

  @font-face {
    font-family: 'Industry-Bold';
    src: url('https://img1.famulei.com/css/font/Industry-Bold.ttf') format('truetype')
  }

  .font-ib {
    font-family: "Industry-Bold", sans-serif;
  }
</style>
<style lang="stylus">
  view {
    box-sizing border-box
  }

  .main {
    width 100%
    min-height 100%
    color #2D2F33
    font-family 'PingFang SC', 'Microsoft Yahei', sans-serif
    background-color #fff
    &.match-page,
    &.bet {
      background-color #F7F8FA
    }
    &.bg {
      background-color #F7F8FA
    }
    &.post {
      padding-bottom 174 rpx
    }
  }

  .fl {
    float left
  }

  .fr {
    float right
  }

  .cl {
    overflow hidden
  }

  .flex {
    display -webkit-flex
    display flex
  }

  .flex-center-mid {
    display -webkit-flex
    display flex
    justify-content center
    align-items center
  }
</style>
