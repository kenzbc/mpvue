<template>
    <div>
        <div class="pop-layer" :class="{show: show}">
            <div class="modal">
                <AuthSet />
                <button class="set-btn cancel" @tap="close" type="">取消</button>
            </div>
        </div>
    </div>
</template>

<script>
  import AuthSet from '@/components/AuthSet'
  import { mapMutations } from 'vuex'

  export default {
    components: {
      AuthSet
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      ...mapMutations(['setShowVideo', 'setShowAuthSetModal']),
      close () {
        this.setShowAuthSetModal(0)
        this.setShowVideo(1)
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .pop-layer {
        width 100%
        height 100vh
        position fixed
        top 0
        left 0
        background rgba(0,0,0,.6)
        display none
        align-items center
        justify-content center
        z-index 9
        &.show {
            display flex
            display -webkit-flex
        }
    }
    .modal {
        width 70%
        height 400rpx
        background #fff
        border-radius 10rpx
        padding-top 80rpx
    }
    .set-btn {
        width 75%
        &.cancel {
            margin-top 60rpx
        }
    }
</style>