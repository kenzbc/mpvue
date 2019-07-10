<template>
    <div class="avatar" :style="{'width': avatarWidth, 'height': avatarHeight}">
        <img class="avatar-img" :src="src || defaultAvatar" />
        <img class="sign-icon" src="/static/images/v.png" v-if="memberType == 1" />
        <img class="sign-icon" src="/static/images/staff.png" v-if="memberType == 2" />
    </div>
</template>

<script>
  const defaultAvatar = 'https://img1.famulei.com/active/wx_share/default_avatar.jpg'

  export default {
    data () {
      return {}
    },
    props: {
      src: {
        type: String,
        default: ''
      },
      memberType: {
        type: String,
        default: ''
      },
      avatarWidth: {
        type: String,
        default: '72rpx'
      },
      avatarHeight: {
        type: String,
        default: '72rpx'
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .avatar {
        position relative
        .avatar-img {
            width: 100%
            height: 100%
            border-radius 50%
        }
        .sign-icon {
            width 44%
            height 44%
            position absolute
            right -4rpx
            bottom -4rpx
        }
    }
</style>