import gio from '@/utils/gio-minp'
import Vue from 'vue'
import App from './App'
import Store from './store'
import MpvueRouterPatch from 'mpvue-router-patch'
import md5 from 'js-md5'

gio('init', 'b148d0812333fe32', 'wx3e03a5b431f7b7bd', { vue: Vue, version: '1.0', followShare: true })

Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
Vue.prototype.$store = Store
App.mpType = 'app'

Vue.prototype.clubTest = function (token, member) {
  let ts = Math.round(new Date() / 1000)
  let params = {
    memberId: member,
    tokenP: md5(token + 'FAMULEIENCODE2329' + ts),
    platform: 'weixin',
    ts: ts
  }
  return this.$router.push({path: '/pages/clubTest/main', query: params})
}

const app = new Vue(App)
app.$mount()
