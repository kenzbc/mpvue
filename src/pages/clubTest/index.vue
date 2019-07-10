<template>
    <div>
        <div class="main">
            <web-view :src="url" @message="updateStandard"></web-view>
        </div>
    </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import config from '@/config'
  const host = config.host
  const _url = host + '/club_test/club_test.html?'
//  const _url = 'https://www.famulei.com/club_test/club_test.html?'
  export default {
    data () {
      return {
        memberId: '',
        tokenP: '',
        platform: '',
        ts: ''
      }
    },
    computed: {
      url () {
        return _url + 'member_id=' + this.memberId + '&tokenp=' + this.tokenP + '&platform=' + this.platform + '&ts=' + this.ts + '&appid=1&language_id=1&scoregg=1' + '#wechat_redirect'
      }
    },
    methods: {
      // ...mapActions(['setStandard']),
      ...mapMutations(['setShowVideo', 'setStandard']),
      updateStandard (e) {
        let status = e.mp.detail.data[0].isTest + '' || '0'
        this.setStandard(status)
        this.setShowVideo(1)
      }
    },
    mounted () {},
    onLoad () { // query需要在onLoad周期内获取
      this.memberId = this.$route.query.memberId
      this.tokenP = this.$route.query.tokenP
      this.platform = this.$route.query.platform
      this.ts = this.$route.query.ts
    }
  }
</script>

<style lang="stylus"></style>
