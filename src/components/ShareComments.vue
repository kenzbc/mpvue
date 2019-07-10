<template>
    <div>
        <div class="pop-layer flex" v-show="isShow" catchtouchmove="preventD">
            <div class="share-box">
                <canvas canvas-id="shareCanvas" style="width:276px;height:445px"></canvas>
                <div class="save-wrap">
                    <button class="set-btn" @tap="openSetting" v-if="!photoScope">授权保存</button>
                    <div class="save" v-show="photoScope && saveBtnIsShow" @tap="saveShare">保存到相册</div>
                    <div class="text" v-show="isSave">图片已保存到相册，可分享给好友</div>
                </div>
                <div class="close flex" @tap="closeShare"><img src="/static/images/share_close.png" /></div>
            </div>

        </div>
    </div>
</template>

<script>
  const ctx = wx.createCanvasContext('shareCanvas')
  export default {
    data () {
      return {
        saveBtnIsShow: false,
        isSave: false,
        photoScope: true,
        visibility: false
      }
    },
    props: {
      isShow: {
        type: Boolean,
        default: true
      },
      avatar: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      },
      circle: {
        type: String,
        default: 'score'
      },
      memberType: {
        type: String,
        default: ''
      }
    },
    computed: {
    },
    watch: {
      isShow (newVal, oldVal) {
        if (newVal !== oldVal) {
          if (newVal) {
            this.setCanvas()
          }
        }
      }
    },
    methods: {
      openSetting () {
        wx.openSetting({
          success: (res) => {
            this.photoScope = true
          }
        })
      },
      closeShare () {
        ctx.clearRect(0, 0, 276, 445)
        ctx.draw(true)

        this.$emit('update:isShow', false)
        setTimeout(() => {
          this.$emit('update:chart', true)
        }, 10)
        // this.visibility = false
      },
      saveShare () {
        wx.canvasToTempFilePath({
          canvasId: 'shareCanvas',
          success: (res) => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.showToast({
                  title: '已保存到相册',
                  duration: 800
                })
                this.saveBtnIsShow = false
                this.isSave = true
              },
              fail: () => {
                wx.getSetting({
                  success: (res) => {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                      this.photoScope = false
                    }
                  }
                })
              }
            })
          }
        })
      },
      setCanvas () {
        // const wxGetImageInfo = promisify(wx.getImageInfo)
        this.$emit('update:chart', false)
        wx.getImageInfo({ // 背景
          src: 'https://img1.famulei.com/active/wx_share/pic_comment_card.png',
          success: (res) => {
            // const ctx = wx.createCanvasContext('shareCanvas')
            ctx.drawImage(res.path, 0, 0, 276, 445)
            ctx.draw()
            wx.getImageInfo({ // 头像
              src: this.avatar,
              success: (res) => {
                // const ctx = wx.createCanvasContext('shareCanvas')
                // let mobile = wx.getSystemInfoSync()
                // let ratio = mobile.windowWidth / 375
                // let arcWidth = 26 * ratio
                // x-轴坐标
                // let xCoor = 21 * ratio
                // y-轴坐标
                // let yCoor = 32 * ratio
                ctx.save()
                ctx.beginPath()
                ctx.arc(102 + 70 / 2, 12 + 70 / 2, 70 / 2, 0, Math.PI * 2, false)
                ctx.clip()
                // ctx.drawImage(res.tempFilePath,xCoor, yCoor,arcWidth,arcWidth);
                ctx.drawImage(res.path, 102, 12, 70, 70)
                ctx.restore()
                ctx.setTextAlign('center')
                ctx.setFillStyle('#FFFFFF')
                ctx.setFontSize(14)
                ctx.fillText(this.name, 138, 100) // nickname
                ctx.draw(true)
                if (this.memberType === '1' || this.memberType === '2') {
                  wx.getImageInfo({
                    src: this.memberType === '1' ? 'https://img1.famulei.com/active/wx_share/member_v.png' : 'https://img1.famulei.com/active/wx_share/member_staff.png',
                    success: (res) => {
                      ctx.drawImage(res.path, 150, 56, 24, 24)
                      ctx.draw(true)
                      this.canvasBlock(ctx)
                    }
                  })
                } else {
                  this.canvasBlock(ctx)
                }
              }
            })
          }
        })
      },
      canvasBlock (ctx) {
        wx.getImageInfo({ // 标题
          src: 'https://img1.famulei.com/active/wx_share/icon_Re.png',
          success: (res) => {
            ctx.drawImage(res.path, 18, 135, 18, 18)

            ctx.setTextAlign('left')
            ctx.setFillStyle('#656973')
            ctx.setFontSize(14)
            ctx.lineWidth = 1
            let initTop = 150 // 绘制字体距离canvas顶部初始的距离
            let initLeft = 44 // 绘制字体距离canvas左边初始的距离
            let textWidth = 214 // 绘制文本的宽度
            this.drawText(ctx, this.title, initLeft, initTop, textWidth, 2) // 标题
            ctx.draw(true)

            wx.getImageInfo({ // 文本框
              src: 'https://img1.famulei.com/active/wx_share/comment_frame.png',
              success: (res) => {
                ctx.drawImage(res.path, 18, 181, 240, 120)
                ctx.setTextAlign('left')
                ctx.setFillStyle('#A8ABB3')
                ctx.setFontSize(14)
                ctx.lineWidth = 1
                let initTop = 216 // 绘制字体距离canvas顶部初始的距离
                let initLeft = 36 // 绘制字体距离canvas左边初始的距离
                let textWidth = 204 // 绘制文本的宽度
                this.drawText(ctx, this.content, initLeft, initTop, textWidth, 4) // content
                ctx.draw(true)
                wx.getImageInfo({ // 文本框
                  src: 'https://img1.famulei.com/active/wx_share/code.jpg',
                  success: (res) => {
                    wx.hideLoading()
                    let circle = '来自圈子: ' + this.circle
                    ctx.drawImage(res.path, 93, 330, 90, 90)
                    ctx.setTextAlign('center')
                    ctx.setFillStyle('#A8ABB3')
                    ctx.setFontSize(11)
                    ctx.fillText(circle, 138, 320) // circle
                    ctx.stroke()
                    ctx.draw(true)
                    this.saveBtnIsShow = true
                    /*
                    setTimeout(() => {
                      this.visibility = true
                    }, 20)
                    */
                  }
                })
              }
            })
          }
        })
      },
      drawText (ctx, str, initLeft, initTop, textWidth, rows) {
        let lineWidth = 0
        let lastSubStrIndex = 0 // 每次开始截取的字符串的索引
        let row = 1
        for (let i = 0; i < str.length; i++) {
          lineWidth += ctx.measureText(str[i]).width
          if (lineWidth > textWidth) {
            ctx.fillText(str.substring(lastSubStrIndex, i), initLeft, initTop) // 绘制截取部分
            initTop += 22 // 行高
            lineWidth = 0
            lastSubStrIndex = i
            row++
          }
          if (row > rows) {
            break
          }
          if (i === str.length - 1) { // 绘制剩余部分
            ctx.fillText(str.substring(lastSubStrIndex), initLeft, initTop)
          }
        }
      }
    },
    mounted () {},
    onUnload () {
      ctx.clearRect(0, 0, 276, 445)
      ctx.draw(true)
      this.$emit('update:isShow', false)
      // this.visibility = false
    }
  }
</script>

<style lang="stylus" scoped>
    .pop-layer {
        position fixed
        width 100%
        height 100vh
        top 0
        left 0
        background rgba(0,0,0, .6)
        align-items center
        justify-content center
        z-index 9
        /*visibility hidden*/
        &.show {
            z-index 9
            visibility visible
        }
    }
    .save-wrap {
        width 100%
        height 110rpx
        padding-top 20rpx
        .save {
            width 230rpx
            height 60rpx
            margin 0 auto
            background #0D8DFC
            border-radius 30rpx
            color #fff
            text-align center
            font-size 28rpx
            font-weight 400
            line-height 60rpx
        }
        .text {
            height 60rpx
            line-height 60rpx
            text-align center
            font-size 28rpx
            color #fff
        }
        .set-btn {
            width 200rpx
            height 60rpx
            border-radius 30rpx
            line-height 60rpx
            font-size 28rpx
            color #656973
        }
    }
    .close {
        width 84rpx
        height 84rpx
        align-items center
        justify-content center
        background #fff
        border-radius 50%
        margin 0 auto
        img {
            width 32rpx
            height 32rpx
        }
    }
</style>