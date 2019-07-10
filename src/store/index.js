import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/http/api'
// import { getUrlParams } from '@/utils/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    member: {},
    code: '',
    isShowVideo: 1, //  是否显示帖子详情页的视频
    authSetting: true, // 用户是否授权
    isLogin: 0, // 登录状态
    isShowAuthSetModal: 0, // 是否显示授权弹窗
    isShowClubTestModal: 0
  },
  mutations: {
    setIsLogin: (state, status) => {
      state.isLogin = status
    },
    setAuthSetting: (state, status) => {
      state.authSetting = status
    },
    setLoginInfo: (state, login) => {
      state.member = login
    },
    setCode: (state, code) => {
      state.code = code
    },
    setStandard: (state, standard) => {
      state.member.is_standard = standard
    },
    setShowVideo: (state, isShow) => {
      state.isShowVideo = isShow
    },
    setShowAuthSetModal: (state, status) => {
      state.isShowAuthSetModal = status
    },
    // 社区答题模块
    setShowClubTestModal: (state, status) => {
      state.isShowClubTestModal = status
    },
    // 修改果子数
    setGuoZi: (state, num) => {
      state.member.guozi1 = num
    },
    // 修改钻石数
    setDiamond: (state, num) => {
      state.member.diamond = num
    }
  },
  actions: {
    // 微信登录
    wxLogin: ({ commit, dispatch }) => {
      wx.login({
        success: (res) => {
          console.log('微信已登录')
          commit('setCode', res.code)
          // dispatch('getSetting')
        },
        fail: () => {
          console.log('登陆失败')
        }
      })
    },
    // 查看授权状态
    getSetting: ({ commit, dispatch }) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            commit('setAuthSetting', true)
            console.log('已授权')
            wx.getUserInfo({
              success: (res) => {
                dispatch('login', res)
              }
            })
          } else {
            commit('setAuthSetting', false)
            console.log('未授权')
            wx.reLaunch({
              url: '/pages/login/main'
            })
          }
        },
        fail: () => {
          commit('setAuthSetting', false)
        }
      })
    },
    // 用户授权后获取用户信息
    getUserInfo: ({ commit, dispatch, state }, e) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            commit('setAuthSetting', true)
            console.log('已授权')
            wx.getUserInfo({
              success: (res) => {
                dispatch('login', res)
              }
            })
          } else {
            commit('setAuthSetting', false)
            console.log('未授权')
            // wx.reLaunch({
            //   url: '/pages/login/main'
            // })
          }
        },
        fail: () => {
          commit('setAuthSetting', false)
        }
      })

      // if (e.target.userInfo) {
      //   // 允许授权
      //   dispatch('login', e.target)
      //   console.log('允许授权')
      // } else {
      //   // 拒绝授权
      //   console.log('拒绝授权')
      //   wx.showModal({
      //     title: '授权提示',
      //     content: '拒绝授权后，将无法完整使用功能，为了您更好的体验，请先同意授权！',
      //     showCancel: true,
      //     cancelText: '拒绝授权',
      //     confirmText: '返回授权',
      //     success: (res) => {
      //       if (res.confirm) {
      //         // console.log('返回授权')
      //       } else {
      //         if (!state.isShowAuthSetModal) {
      //           wx.switchTab({
      //             url: '/pages/news/main'
      //           })
      //         }
      //         commit('setShowAuthSetModal', 0)
      //         commit('setShowVideo', 1)
      //       }
      //     }
      //   })
      // }
    },
    // 登录
    login: ({ commit, state }, wxUserInfo) => {
      let params = {
        encryptedData: wxUserInfo.encryptedData,
        iv: wxUserInfo.iv,
        code: state.code
      }
      Api.ajax('POST', '/services/member/wx_sm_login.php', params).then(resp => {
        if (resp.code === '200') {
          // console.log(resp)
          commit('setLoginInfo', resp.data)
          commit('setIsLogin', 1)
          wx.showToast({title: '登录成功', duration: 1000, mask: true})
          // if (!state.isShowAuthSetModal) {
          //   wx.switchTab({
          //     url: '/pages/news/main'
          //   })
          // }
          commit('setShowAuthSetModal', 0)
        }
      }).catch(() => {
        commit('setShowAuthSetModal', 0)
        commit('setIsLogin', 0)
      })
      commit('setShowVideo', 1)
    },
    // 跳转比赛详情页
    toMatchDetail ({ commit }, mid) {
      let matchID = mid || ''
      if (matchID) {
        wx.navigateTo({
          url: '/pages/match/detail/main?matchID=' + matchID
        })
      }
    },
    // 跳转比赛数据详情页
    toDataDetail: ({ commit }, mid) => {
      let matchID = mid || ''
      if (matchID) {
        wx.navigateTo({
          url: '/pages/match/data/main?matchID=' + matchID
        })
      }
    }
  }
})

export default store
