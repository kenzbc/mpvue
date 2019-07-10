function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

/**
 * 获取 location.search 参数
 * @param key: string
 * return 键值对对象 or 对应key的值
 */
export function getUrlParams (url, key) {
  let _url = typeof url === 'string' ? url : ''
  let n = url.indexOf('famulei.com')
  let m = url.indexOf('?')
  let qs = n !== -1 && m !== -1 ? _url.slice(m + 1) : ''
  let params = {}
  let items = qs.length ? qs.split('&') : []
  let len = items.length
  let item = null
  let _key = null
  let value = null
  for (var i = 0; i < len; i++) {
    item = items[i].split('=')
    _key = decodeURIComponent(item[0])
    value = decodeURIComponent(item[1])
    if (_key.length) {
      params[_key] = value
    }
  }

  if (typeof key === 'string') return params[key]
  return params
}

export function getQueryString (obj) {
  let o = obj || {}
  let search
  let arr = []
  for (let item in o) {
    let kv = item + '=' + 0[item]
    arr.push(kv)
  }
  search = arr.length ? '?' + arr.join('&') : ''
  return search
}

/**
*  将对象转变为class字符串
*/
export function classes (obj) {
  let classesStr = ''
  for (let className in obj) {
    if (obj.hasOwnProperty(className) && !!obj[className]) classesStr += className
  }
  return classesStr
}

// 赛高小子
let editorEmoji = [
    {
        alt: '爱你s', src: '//img1.famulei.com/common/images/emoji/emoji_saini.png'
    },{
        alt: '奥特曼s', src: '//img1.famulei.com/common/images/emoji/emoji_saoteman.png'
    },{
        alt: '拜拜s', src: '//img1.famulei.com/common/images/emoji/emoji_sbaibai.png'
    },{
        alt: '白眼s', src: '//img1.famulei.com/common/images/emoji/emoji_sbaiyan.png'
    },{
        alt: '宝宝s', src: '//img1.famulei.com/common/images/emoji/emoji_sbaobao.png'
    },{
        alt: '悲伤s', src: '//img1.famulei.com/common/images/emoji/emoji_sbeishang.png'
    },{
        alt: '鄙视s', src: '//img1.famulei.com/common/images/emoji/emoji_sbishi.png'
    },{
        alt: '闭嘴s', src: '//img1.famulei.com/common/images/emoji/emoji_sbizui.png'
    },{
        alt: '馋嘴s', src: '//img1.famulei.com/common/images/emoji/emoji_scanzui.png'
    },{
        alt: '羊驼s', src: '//img1.famulei.com/common/images/emoji/emoji_scaonima.png'
    },{
        alt: '吃惊s', src: '//img1.famulei.com/common/images/emoji/emoji_schijing.png'
    },{
        alt: '呆s', src: '//img1.famulei.com/common/images/emoji/emoji_sdai.png'
    },{
        alt: '大哭s', src: '//img1.famulei.com/common/images/emoji/emoji_sdaku.png'
    },{
        alt: '蛋糕s', src: '//img1.famulei.com/common/images/emoji/emoji_sdangao.png'
    },{
        alt: '大笑s', src: '//img1.famulei.com/common/images/emoji/emoji_sdaxiao.png'
    },{
        alt: 'doges', src: '//img1.famulei.com/common/images/emoji/emoji_sdoge.png'
    },{
        alt: '浮云s', src: '//img1.famulei.com/common/images/emoji/emoji_sfuyun.png'
    },{
        alt: '给力s', src: '//img1.famulei.com/common/images/emoji/emoji_sgeili.png'
    },{
        alt: 'goods', src: '//img1.famulei.com/common/images/emoji/emoji_sgood.png'
    },{
        alt: '拍手s', src: '//img1.famulei.com/common/images/emoji/emoji_sguzhang.png'
    },{
        alt: '哈哈s', src: '//img1.famulei.com/common/images/emoji/emoji_shaha.png'
    },{
        alt: '害羞s', src: '//img1.famulei.com/common/images/emoji/emoji_shaixiu.png'
    },{
        alt: '汗s', src: '//img1.famulei.com/common/images/emoji/emoji_shan.png'
    },{
        alt: '哈欠s', src: '//img1.famulei.com/common/images/emoji/emoji_shaqian.png'
    },{
        alt: '黑线s', src: '//img1.famulei.com/common/images/emoji/emoji_sheixian.png'
    },{
        alt: '囧s', src: '//img1.famulei.com/common/images/emoji/emoji_sheng.png'
    },{
        alt: '话筒s', src: '//img1.famulei.com/common/images/emoji/emoji_shuatong.png'
    },{
        alt: '互粉s', src: '//img1.famulei.com/common/images/emoji/emoji_shufen.png'
    },{
        alt: '好囧s', src: '//img1.famulei.com/common/images/emoji/emoji_sjiong.png'
    },{
        alt: '急眼s', src: '//img1.famulei.com/common/images/emoji/emoji_sjiyan.png'
    },{
        alt: '可爱s', src: '//img1.famulei.com/common/images/emoji/emoji_skeai.png'
    },{
        alt: '可怜s', src: '//img1.famulei.com/common/images/emoji/emoji_skelian.png'
    },{
        alt: '口水s', src: '//img1.famulei.com/common/images/emoji/emoji_skoushui.png'
    },{
        alt: '酷s', src: '//img1.famulei.com/common/images/emoji/emoji_sku.png'
    },{
        alt: '困s', src: '//img1.famulei.com/common/images/emoji/emoji_skun.png'
    },{
        alt: '来s', src: '//img1.famulei.com/common/images/emoji/emoji_slai.png'
    },{
        alt: '蜡烛s', src: '//img1.famulei.com/common/images/emoji/emoji_slazhu.png'
    },{
        alt: '泪s', src: '//img1.famulei.com/common/images/emoji/emoji_slei.png'
    },{
        alt: '礼物s', src: '//img1.famulei.com/common/images/emoji/emoji_sliwu.png'
    },{
        alt: '喵喵s', src: '//img1.famulei.com/common/images/emoji/emoji_smiaomiao.png'
    },{
        alt: '哼s', src: '//img1.famulei.com/common/images/emoji/emoji_sheng.png'
    },{
        alt: '鼓掌s', src: '//img1.famulei.com/common/images/emoji/emoji_sguzhang.png'
    },{
        alt: '挤眼s', src: '//img1.famulei.com/common/images/emoji/emoji_sjiyan.png'
    },{
        alt: '兔子s', src: '//img1.famulei.com/common/images/emoji/emoji_stuzi.png'
    },{
        alt: '怒骂s', src: '//img1.famulei.com/common/images/emoji/emoji_snuma.png'
    },{
        alt: '吐血s', src: '//img1.famulei.com/common/images/emoji/emoji_stuxue.png'
    },{
        alt: '阴险s', src: '//img1.famulei.com/common/images/emoji/emoji_syinxian.png'
    },{
        alt: '心s', src: '//img1.famulei.com/common/images/emoji/emoji_sxin.png'
    },{
        alt: '钱s', src: '//img1.famulei.com/common/images/emoji/emoji_sqian.png'
    },{
        alt: '微笑s', src: '//img1.famulei.com/common/images/emoji/emoji_sweixiao.png'
    },{
        alt: '弱s', src: '//img1.famulei.com/common/images/emoji/emoji_sruo.png'
    },{
        alt: '委屈s', src: '//img1.famulei.com/common/images/emoji/emoji_sweiqu.png'
    },{
        alt: '威武s', src: '//img1.famulei.com/common/images/emoji/emoji_sweiwu.png'
    },{
        alt: '嘻嘻s', src: '//img1.famulei.com/common/images/emoji/emoji_sxixi.png'
    },{
        alt: '怒s', src: '//img1.famulei.com/common/images/emoji/emoji_snu.png'
    },{
        alt: '脑残s', src: '//img1.famulei.com/common/images/emoji/emoji_snaocan.png'
    },{
        alt: '赞s', src: '//img1.famulei.com/common/images/emoji/emoji_szan.png'
    },{
        alt: '笑crys', src: '//img1.famulei.com/common/images/emoji/emoji_sxiaocry.png'
    },{
        alt: 'oks', src: '//img1.famulei.com/common/images/emoji/emoji_sok.png'
    },{
        alt: '嘘s', src: '//img1.famulei.com/common/images/emoji/emoji_sxu.png'
    },{
        alt: '围观s', src: '//img1.famulei.com/common/images/emoji/emoji_sweiguan.png'
    },{
        alt: '钟s', src: '//img1.famulei.com/common/images/emoji/emoji_szhong.png'
    },{
        alt: '晕s', src: '//img1.famulei.com/common/images/emoji/emoji_syun.png'
    },{
        alt: '生病s', src: '//img1.famulei.com/common/images/emoji/emoji_sshengbin.png'
    },{
        alt: '挖鼻s', src: '//img1.famulei.com/common/images/emoji/emoji_swabi.png'
    },{
        alt: '神马s', src: '//img1.famulei.com/common/images/emoji/emoji_sshenma.png'
    },{
        alt: '猪头s', src: '//img1.famulei.com/common/images/emoji/emoji_szhutou.png'
    },{
        alt: '思考s', src: '//img1.famulei.com/common/images/emoji/emoji_ssikao.png'
    },{
        alt: '熊猫s', src: '//img1.famulei.com/common/images/emoji/emoji_sxiongmao.png'
    },{
        alt: '右哼哼s', src: '//img1.famulei.com/common/images/emoji/emoji_syouhengheng.png'
    },{
        alt: '努力s', src: '//img1.famulei.com/common/images/emoji/emoji_snuli.png'
    },{
        alt: '抓狂s', src: '//img1.famulei.com/common/images/emoji/emoji_szhuakuang.png'
    },{
        alt: 'nos', src: '//img1.famulei.com/common/images/emoji/emoji_sno.png'
    },{
        alt: '耶s', src: '//img1.famulei.com/common/images/emoji/emoji_sye.png'
    },{
        alt: '太开心s', src: '//img1.famulei.com/common/images/emoji/emoji_staikaixin.png'
    },{
        alt: '亲亲s', src: '//img1.famulei.com/common/images/emoji/emoji_sqinqin.png'
    },{
        alt: '鲜花s', src: '//img1.famulei.com/common/images/emoji/emoji_sxianhua.png'
    },{
        alt: '伤心s', src: '//img1.famulei.com/common/images/emoji/emoji_sshangxin.png'
    },{
        alt: '左哼哼s', src: '//img1.famulei.com/common/images/emoji/emoji_szuohengheng.png'
    },{
        alt: '色s', src: '//img1.famulei.com/common/images/emoji/emoji_sse.png'
    },{
        alt: '偷笑s', src: '//img1.famulei.com/common/images/emoji/emoji_stouxiao.png'
    },{
        alt: '疑问s', src: '//img1.famulei.com/common/images/emoji/emoji_syiwen.png'
    },{
        alt: '睡s', src: '//img1.famulei.com/common/images/emoji/emoji_sshui.png'
    },{
        alt: '失望s', src: '//img1.famulei.com/common/images/emoji/emoji_sshiwang.png'
    },{
        alt: '衰s', src: '//img1.famulei.com/common/images/emoji/emoji_sshuai.png'
    },{
        alt: '吐s', src: '//img1.famulei.com/common/images/emoji/emoji_stu.png'
    },{
        alt: '吃瓜s', src: '//img1.famulei.com/common/images/emoji/emoji_chiguas.png'
    },
]
// 伐木累
let editorEmoji1 = [
    {
        alt: '鄙视', src: '//img1.famulei.com/common/images/emoji/emoji_bishi.png'
    },{
        alt: '呆', src: '//img1.famulei.com/common/images/emoji/emoji_dai.png'
    },{
        alt: '大哭', src: '//img1.famulei.com/common/images/emoji/emoji_daku.png'
    },{
        alt: '大笑', src: '//img1.famulei.com/common/images/emoji/emoji_daxiao.png'
    },{
        alt: '鼓掌', src: '//img1.famulei.com/common/images/emoji/emoji_guzhang.png'
    },{
        alt: '害羞', src: '//img1.famulei.com/common/images/emoji/emoji_haixiu.png'
    },{
        alt: '汗', src: '//img1.famulei.com/common/images/emoji/emoji_han.png'
    },{
        alt: '可爱', src: '//img1.famulei.com/common/images/emoji/emoji_keai.png'
    },{
        alt: '困', src: '//img1.famulei.com/common/images/emoji/emoji_kun.png'
    },{
        alt: '脑残', src: '//img1.famulei.com/common/images/emoji/emoji_naocan.png'
    },{
        alt: '努力', src: '//img1.famulei.com/common/images/emoji/emoji_nuli.png'
    },{
        alt: '钱', src: '//img1.famulei.com/common/images/emoji/emoji_qian.png'
    },{
        alt: '偷笑', src: '//img1.famulei.com/common/images/emoji/emoji_touxiao.png'
    },{
        alt: '吐血', src: '//img1.famulei.com/common/images/emoji/emoji_tuxue.png'
    },{
        alt: '微笑', src: '//img1.famulei.com/common/images/emoji/emoji_weixiao.png'
    },{
        alt: '鲜花', src: '//img1.famulei.com/common/images/emoji/emoji_xianhua.png'
    },{
        alt: '疑问', src: '//img1.famulei.com/common/images/emoji/emoji_yiwen.png'
    },{
        alt: '晕', src: '//img1.famulei.com/common/images/emoji/emoji_yun.png'
    },{
        alt: '赞', src: '//img1.famulei.com/common/images/emoji/emoji_zan.png'
    },{
        alt: 'doge', src: '//img1.famulei.com/common/images/emoji/emoji_doge.png'
    },{
        alt: '熊猫', src: '//img1.famulei.com/common/images/emoji/emoji_xiongmao.png'
    },{
        alt: '礼物', src: '//img1.famulei.com/common/images/emoji/emoji_liwu.png'
    },{
        alt: '吃惊', src: '//img1.famulei.com/common/images/emoji/emoji_chijing.png'
    },{
        alt: '亲亲', src: '//img1.famulei.com/common/images/emoji/emoji_qinqin.png'
    },{
        alt: '泪', src: '//img1.famulei.com/common/images/emoji/emoji_lei.png'
    },{
        alt: '嘻嘻', src: '//img1.famulei.com/common/images/emoji/emoji_xixi.png'
    },{
        alt: '色', src: '//img1.famulei.com/common/images/emoji/emoji_se.png'
    },{
        alt: '阴险', src: '//img1.famulei.com/common/images/emoji/emoji_yinxian.png'
    },{
        alt: '宝宝', src: '//img1.famulei.com/common/images/emoji/emoji_baobao.png'
    },{
        alt: '抓狂', src: '//img1.famulei.com/common/images/emoji/emoji_zhuakuang.png'
    },{
        alt: '威武', src: '//img1.famulei.com/common/images/emoji/emoji_weiwu.png'
    },{
        alt: '拜拜', src: '//img1.famulei.com/common/images/emoji/emoji_baibai.png'
    },{
        alt: 'no', src: '//img1.famulei.com/common/images/emoji/emoji_no.png'
    },{
        alt: '喵喵', src: '//img1.famulei.com/common/images/emoji/emoji_miaomiao.png'
    },{
        alt: '耶', src: '//img1.famulei.com/common/images/emoji/emoji_ye.png'
    },{
        alt: '挖鼻', src: '//img1.famulei.com/common/images/emoji/emoji_wabi.png'
    },{
        alt: '猪头', src: '//img1.famulei.com/common/images/emoji/emoji_zhutou.png'
    },{
        alt: '失望', src: '//img1.famulei.com/common/images/emoji/emoji_shiwang.png'
    },{
        alt: '闭嘴', src: '//img1.famulei.com/common/images/emoji/emoji_bizui.png'
    },{
        alt: '蛋糕', src: '//img1.famulei.com/common/images/emoji/emoji_dangao.png'
    },{
        alt: '蜡烛', src: '//img1.famulei.com/common/images/emoji/emoji_lazhu.png'
    },{
        alt: '话筒', src: '//img1.famulei.com/common/images/emoji/emoji_huatong.png'
    },{
        alt: '爱你', src: '//img1.famulei.com/common/images/emoji/emoji_aini.png'
    },{
        alt: 'ok', src: '//img1.famulei.com/common/images/emoji/emoji_ok.png'
    },{
        alt: '怒骂', src: '//img1.famulei.com/common/images/emoji/emoji_numa.png'
    },{
        alt: '哈哈', src: '//img1.famulei.com/common/images/emoji/emoji_haha.png'
    },{
        alt: '羊驼', src: '//img1.famulei.com/common/images/emoji/emoji_caonima.png'
    },{
        alt: '囧', src: '//img1.famulei.com/common/images/emoji/emoji_jiong.png'
    },{
        alt: '哼', src: '//img1.famulei.com/common/images/emoji/emoji_heng.png'
    },{
        alt: '挤眼', src: '//img1.famulei.com/common/images/emoji/emoji_jiyan.png'
    },{
        alt: '围观', src: '//img1.famulei.com/common/images/emoji/emoji_weiguan.png'
    },{
        alt: '吐', src: '//img1.famulei.com/common/images/emoji/emoji_tu.png'
    },{
        alt: '兔子', src: '//img1.famulei.com/common/images/emoji/emoji_tuzi.png'
    },{
        alt: '怒', src: '//img1.famulei.com/common/images/emoji/emoji_nu.png'
    },{
        alt: '思考', src: '//img1.famulei.com/common/images/emoji/emoji_sikao.png'
    },{
        alt: '笑cry', src: '//img1.famulei.com/common/images/emoji/emoji_xiaocry.png'
    },{
        alt: '太开心', src: '//img1.famulei.com/common/images/emoji/emoji_taikaixin.png'
    },{
        alt: '衰', src: '//img1.famulei.com/common/images/emoji/emoji_shuai.png'
    },{
        alt: '左哼哼', src: '//img1.famulei.com/common/images/emoji/emoji_zuohengheng.png'
    },{
        alt: '睡', src: '//img1.famulei.com/common/images/emoji/emoji_shui.png'
    },{
        alt: '生病', src: '//img1.famulei.com/common/images/emoji/emoji_shengbin.png'
    },{
        alt: '钟', src: '//img1.famulei.com/common/images/emoji/emoji_zhong.png'
    },{
        alt: 'good', src: '//img1.famulei.com/common/images/emoji/emoji_good.png'
    },{
        alt: '可怜', src: '//img1.famulei.com/common/images/emoji/emoji_kelian.png'
    },{
        alt: '来', src: '//img1.famulei.com/common/images/emoji/emoji_lai.png'
    },{
        alt: '哈欠', src: '//img1.famulei.com/common/images/emoji/emoji_haqian.png'
    },{
        alt: '嘘', src: '//img1.famulei.com/common/images/emoji/emoji_xu.png'
    },{
        alt: '给力', src: '//img1.famulei.com/common/images/emoji/emoji_geili.png'
    },{
        alt: '右哼哼', src: '//img1.famulei.com/common/images/emoji/emoji_youhengheng.png'
    },{
        alt: '奥特曼', src: '//img1.famulei.com/common/images/emoji/emoji_aoteman.png'
    },{
        alt: '浮云', src: '//img1.famulei.com/common/images/emoji/emoji_fuyun.png'
    },{
        alt: '弱', src: '//img1.famulei.com/common/images/emoji/emoji_ruo.png'
    },{
        alt: '馋嘴', src: '//img1.famulei.com/common/images/emoji/emoji_canzui.png'
    },{
        alt: '黑线', src: '//img1.famulei.com/common/images/emoji/emoji_heixian.png'
    },{
        alt: '酷', src: '//img1.famulei.com/common/images/emoji/emoji_ku.png'
    },{
        alt: '互粉', src: '//img1.famulei.com/common/images/emoji/emoji_hufen.png'
    },{
        alt: '心', src: '//img1.famulei.com/common/images/emoji/emoji_xin.png'
    },{
        alt: '悲伤', src: '//img1.famulei.com/common/images/emoji/emoji_beishang.png'
    },{
        alt: '白眼', src: '//img1.famulei.com/common/images/emoji/emoji_baiyan.png'
    },{
        alt: '伤心', src: '//img1.famulei.com/common/images/emoji/emoji_shangxin.png'
    },{
        alt: '委屈', src: '//img1.famulei.com/common/images/emoji/emoji_weiqu.png'
    },{
        alt: '神马', src: '//img1.famulei.com/common/images/emoji/emoji_shenma.png'
    },{
        alt: '口水', src: '//img1.famulei.com/common/images/emoji/emoji_koushui.png'
    },
]
// 小花狸
let editorEmoji2 = [
    {
        alt: '爱红包', src: '//img1.famulei.com/common/images/emoji/emoji_laihongbao.png'
    },{
        alt: '拜年了', src: '//img1.famulei.com/common/images/emoji/emoji_lbainianle.png'
    },{
        alt: '悲催', src: '//img1.famulei.com/common/images/emoji/emoji_lbeicui.png'
    },{
        alt: '被电', src: '//img1.famulei.com/common/images/emoji/emoji_lbeidian.png'
    },{
        alt: '崩溃', src: '//img1.famulei.com/common/images/emoji/emoji_lbengkui.png'
    },{
        alt: '别烦我', src: '//img1.famulei.com/common/images/emoji/emoji_lbiefanwo.png'
    },{
        alt: '冰桶挑战', src: '//img1.famulei.com/common/images/emoji/emoji_lbingtongtiaozhan.png'
    },{
        alt: '不好意思', src: '//img1.famulei.com/common/images/emoji/emoji_lbuhaoyisi.png'
    },{
        alt: '不想上班', src: '//img1.famulei.com/common/images/emoji/emoji_lbuxiangshangban.png'
    },{
        alt: '采访', src: '//img1.famulei.com/common/images/emoji/emoji_lcaifang.png'
    },{
        alt: '吃货', src: '//img1.famulei.com/common/images/emoji/emoji_lchihuo.png'
    },{
        alt: '吃元宵', src: '//img1.famulei.com/common/images/emoji/emoji_lchiyuanxiao.png'
    },{
        alt: '传火炬', src: '//img1.famulei.com/common/images/emoji/emoji_lchuanhuoju.png'
    },{
        alt: '大红灯笼', src: '//img1.famulei.com/common/images/emoji/emoji_ldahongdenglong.png'
    },{
        alt: '带感', src: '//img1.famulei.com/common/images/emoji/emoji_ldaigan.png'
    },{
        alt: '带着微博去旅行', src: '//img1.famulei.com/common/images/emoji/emoji_ldaizheweiboqulvxing.png'
    },{
        alt: '大南瓜', src: '//img1.famulei.com/common/images/emoji/emoji_ldanangua.png'
    },{
        alt: '德国加油', src: '//img1.famulei.com/common/images/emoji/emoji_ldeguojiayou.png'
    },{
        alt: '得瑟', src: '//img1.famulei.com/common/images/emoji/emoji_ldese.png'
    },{
        alt: '得意地笑', src: '//img1.famulei.com/common/images/emoji/emoji_ldeyidexiao.png'
    },{
        alt: '夺冠感动', src: '//img1.famulei.com/common/images/emoji/emoji_lduoguangandong.png'
    },{
        alt: '发表言论', src: '//img1.famulei.com/common/images/emoji/emoji_lfabiaoyanlun.png'
    },{
        alt: '发礼物', src: '//img1.famulei.com/common/images/emoji/emoji_lfaliwu.png'
    },{
        alt: '放鞭炮', src: '//img1.famulei.com/common/images/emoji/emoji_lfangbianpao.png'
    },{
        alt: '放电抛媚', src: '//img1.famulei.com/common/images/emoji/emoji_lfangdianpaomei.png'
    },{
        alt: '发红包', src: '//img1.famulei.com/common/images/emoji/emoji_lfanghongbao.png'
    },{
        alt: '放假啦', src: '//img1.famulei.com/common/images/emoji/emoji_lfangjiala.png'
    },{
        alt: '非常汗', src: '//img1.famulei.com/common/images/emoji/emoji_lfeichanghan.png'
    },{
        alt: '飞个吻', src: '//img1.famulei.com/common/images/emoji/emoji_lfeigewen.png'
    },{
        alt: '肥皂', src: '//img1.famulei.com/common/images/emoji/emoji_lfeizao.png'
    },{
        alt: '福到啦', src: '//img1.famulei.com/common/images/emoji/emoji_lfudaole.png'
    },{
        alt: '复活节', src: '//img1.famulei.com/common/images/emoji/emoji_lfuhuojie.png'
    },{
        alt: '赶火车', src: '//img1.famulei.com/common/images/emoji/emoji_lganhuoche.png'
    },{
        alt: '给劲', src: '//img1.famulei.com/common/images/emoji/emoji_lgeijin.png'
    },{
        alt: '光棍节', src: '//img1.famulei.com/common/images/emoji/emoji_lguanggunjie.png'
    },{
        alt: '冠军诞生', src: '//img1.famulei.com/common/images/emoji/emoji_lguanjundansheng.png'
    },{
        alt: '过年啦', src: '//img1.famulei.com/common/images/emoji/emoji_lguonianla.png'
    },{
        alt: '拍手', src: '//img1.famulei.com/common/images/emoji/emoji_lguzhang.png'
    },{
        alt: '好爱哦', src: '//img1.famulei.com/common/images/emoji/emoji_lhaoaio.png'
    },{
        alt: '好棒', src: '//img1.famulei.com/common/images/emoji/emoji_lhaobang.png'
    },{
        alt: '好激动', src: '//img1.famulei.com/common/images/emoji/emoji_lhaojidong.png'
    },{
        alt: '好囧', src: '//img1.famulei.com/common/images/emoji/emoji_lhaojiong.png'
    },{
        alt: '好喜欢', src: '//img1.famulei.com/common/images/emoji/emoji_lhaoxihuan.png'
    },{
        alt: '喝多了', src: '//img1.famulei.com/common/images/emoji/emoji_lheduole.png'
    },{
        alt: 'hold住', src: '//img1.famulei.com/common/images/emoji/emoji_lholdzhu.png'
    },{
        alt: '红包拿来', src: '//img1.famulei.com/common/images/emoji/emoji_lhongbaonalai.png'
    },{
        alt: '欢乐购车季', src: '//img1.famulei.com/common/images/emoji/emoji_lhuanlegoucheji.png'
    },{
        alt: '会员一周年', src: '//img1.famulei.com/common/images/emoji/emoji_lhuiyuanyizhounian.png'
    },{
        alt: '互相膜拜', src: '//img1.famulei.com/common/images/emoji/emoji_lhuxiangmobai.png'
    },{
        alt: '互相拍砖', src: '//img1.famulei.com/common/images/emoji/emoji_lhuxiangpaizhuan.png'
    },{
        alt: '江南style', src: '//img1.famulei.com/common/images/emoji/emoji_ljiangnanstyle.png'
    },{
        alt: '加油啊', src: '//img1.famulei.com/common/images/emoji/emoji_ljiayoua.png'
    },{
        alt: '杰克逊', src: '//img1.famulei.com/common/images/emoji/emoji_ljiekexun.png'
    },{
        alt: '挤火车', src: '//img1.famulei.com/common/images/emoji/emoji_ljihuoche.png'
    },{
        alt: '奥运金牌', src: '//img1.famulei.com/common/images/emoji/emoji_ljinpai.png'
    },{
        alt: '金元宝', src: '//img1.famulei.com/common/images/emoji/emoji_ljinyuanbao.png'
    },{
        alt: '纠结', src: '//img1.famulei.com/common/images/emoji/emoji_ljiujie.png'
    },{
        alt: '巨汗', src: '//img1.famulei.com/common/images/emoji/emoji_ljuhan.png'
    },{
        alt: '抠鼻屎', src: '//img1.famulei.com/common/images/emoji/emoji_lkoubishi.png'
    },{
        alt: '躁狂症', src: '//img1.famulei.com/common/images/emoji/emoji_lkuangzaozheng.png'
    },{
        alt: '困死了', src: '//img1.famulei.com/common/images/emoji/emoji_lkunsile.png'
    },{
        alt: '啦啦啦啦', src: '//img1.famulei.com/common/images/emoji/emoji_llalalala.png'
    },{
        alt: '雷锋', src: '//img1.famulei.com/common/images/emoji/emoji_lleifeng.png'
    },{
        alt: '泪流满面', src: '//img1.famulei.com/common/images/emoji/emoji_lleiliumanmian.png'
    },{
        alt: '立志青年', src: '//img1.famulei.com/common/images/emoji/emoji_llizhiqingnian.png'
    },{
        alt: '龙啸', src: '//img1.famulei.com/common/images/emoji/emoji_llongxiao.png'
    },{
        alt: '路过这儿', src: '//img1.famulei.com/common/images/emoji/emoji_lluguo.png'
    },{
        alt: '马上拜年', src: '//img1.famulei.com/common/images/emoji/emoji_lmashangbainian.png'
    },{
        alt: '玫瑰', src: '//img1.famulei.com/common/images/emoji/emoji_lmeigui.png'
    },{
        alt: '没人疼', src: '//img1.famulei.com/common/images/emoji/emoji_lmeirenteng.png'
    },{
        alt: '萌翻', src: '//img1.famulei.com/common/images/emoji/emoji_lmengfan.png'
    },{
        alt: '膜拜了', src: '//img1.famulei.com/common/images/emoji/emoji_lmobaile.png'
    },{
        alt: '牛', src: '//img1.famulei.com/common/images/emoji/emoji_lniu.png'
    },{
        alt: '噢耶', src: '//img1.famulei.com/common/images/emoji/emoji_louye.png'
    },{
        alt: '拍照', src: '//img1.famulei.com/common/images/emoji/emoji_lpaizhao.png'
    },{
        alt: '拍砖', src: '//img1.famulei.com/common/images/emoji/emoji_lpaizhuan.png'
    },{
        alt: '霹雳', src: '//img1.famulei.com/common/images/emoji/emoji_lpili.png'
    },{
        alt: '平安果', src: '//img1.famulei.com/common/images/emoji/emoji_lpinganguo.png'
    },{
        alt: '葡萄牙队加油', src: '//img1.famulei.com/common/images/emoji/emoji_lputaoyajiayou.png'
    },{
        alt: '瞧瞧', src: '//img1.famulei.com/common/images/emoji/emoji_lqiaoqiao.png'
    },{
        alt: '亲一口', src: '//img1.famulei.com/common/images/emoji/emoji_lqinyikou.png'
    },{
        alt: '丘比特', src: '//img1.famulei.com/common/images/emoji/emoji_lqiubite.png'
    },{
        alt: '求关注', src: '//img1.famulei.com/common/images/emoji/emoji_lqiuguanzhu.png'
    },{
        alt: '求红包', src: '//img1.famulei.com/common/images/emoji/emoji_lqiuhongbao.png'
    },{
        alt: '七夕', src: '//img1.famulei.com/common/images/emoji/emoji_lqixi.png'
    },{
        alt: '去旅行', src: '//img1.famulei.com/common/images/emoji/emoji_lqulvxing.png'
    },{
        alt: '群体围观', src: '//img1.famulei.com/common/images/emoji/emoji_lquntiweiguan.png'
    },{
        alt: '撒花', src: '//img1.famulei.com/common/images/emoji/emoji_lsahua.png'
    },{
        alt: '蛇年快乐', src: '//img1.famulei.com/common/images/emoji/emoji_lsheniankuaile.png'
    },{
        alt: '收藏', src: '//img1.famulei.com/common/images/emoji/emoji_lshoucang.png'
    },{
        alt: '耍花灯', src: '//img1.famulei.com/common/images/emoji/emoji_lshuahuadeng.png'
    },{
        alt: '甩甩手', src: '//img1.famulei.com/common/images/emoji/emoji_lshuaishuaishou.png'
    },{
        alt: '奥运铜牌', src: '//img1.famulei.com/common/images/emoji/emoji_ltongpai.png'
    },{
        alt: '同意', src: '//img1.famulei.com/common/images/emoji/emoji_ltongyi.png'
    },{
        alt: '偷乐', src: '//img1.famulei.com/common/images/emoji/emoji_ltoule.png'
    },{
        alt: '推荐', src: '//img1.famulei.com/common/images/emoji/emoji_ltuijian.png'
    },{
        alt: '吐血2', src: '//img1.famulei.com/common/images/emoji/emoji_ltuxue.png'
    },{
        alt: '微博三岁啦', src: '//img1.famulei.com/common/images/emoji/emoji_lweibosansuila.png'
    },{
        alt: '微公益爱心', src: '//img1.famulei.com/common/images/emoji/emoji_lweigongyiaixin.png'
    },{
        alt: '下班', src: '//img1.famulei.com/common/images/emoji/emoji_lxiaban.png'
    },{
        alt: '吓到了', src: '//img1.famulei.com/common/images/emoji/emoji_lxiadaole.png'
    },{
        alt: '想一想', src: '//img1.famulei.com/common/images/emoji/emoji_lxiangyixiang.png'
    },{
        alt: '笑哈哈', src: '//img1.famulei.com/common/images/emoji/emoji_lxiaohaha.png'
    },{
        alt: '西班牙队加油', src: '//img1.famulei.com/common/images/emoji/emoji_lxibanyajiayou.png'
    },{
        alt: '喜得金牌', src: '//img1.famulei.com/common/images/emoji/emoji_lxidejinpai.png'
    },{
        alt: '羞嗒嗒', src: '//img1.famulei.com/common/images/emoji/emoji_lxiudada.png'
    },{
        alt: '许愿', src: '//img1.famulei.com/common/images/emoji/emoji_lxuyuan.png'
    },{
        alt: '要礼物', src: '//img1.famulei.com/common/images/emoji/emoji_lyaoliwu.png'
    },{
        alt: '意大利队加油', src: '//img1.famulei.com/common/images/emoji/emoji_lyidalijiayou.png'
    },{
        alt: '奥运银牌', src: '//img1.famulei.com/common/images/emoji/emoji_lyinpai.png'
    },{
        alt: '右边亮了', src: '//img1.famulei.com/common/images/emoji/emoji_lyoubianliangle.png'
    },{
        alt: '有鸭梨', src: '//img1.famulei.com/common/images/emoji/emoji_lyouyali.png'
    },{
        alt: '圆蛋快乐', src: '//img1.famulei.com/common/images/emoji/emoji_lyuandankuaile.png'
    },{
        alt: '元宵快乐', src: '//img1.famulei.com/common/images/emoji/emoji_lyuanxiaokuaile.png'
    },{
        alt: '月儿圆', src: '//img1.famulei.com/common/images/emoji/emoji_lyueeryuan.png'
    },{
        alt: '愚人节', src: '//img1.famulei.com/common/images/emoji/emoji_lyurenjie.png'
    },{
        alt: '赞啊', src: '//img1.famulei.com/common/images/emoji/emoji_lzana.png'
    },{
        alt: '招财', src: '//img1.famulei.com/common/images/emoji/emoji_lzhaocai.png'
    },{
        alt: '震惊', src: '//img1.famulei.com/common/images/emoji/emoji_lzhengjing.png'
    },{
        alt: '真v5', src: '//img1.famulei.com/common/images/emoji/emoji_lzhenweiwu.png'
    },{
        alt: '中箭', src: '//img1.famulei.com/common/images/emoji/emoji_lzhongjian.png'
    },{
        alt: '转发', src: '//img1.famulei.com/common/images/emoji/emoji_lzhuanfa.png'
    },{
        alt: '走你', src: '//img1.famulei.com/common/images/emoji/emoji_lzouni.png'
    },{
        alt: '最右', src: '//img1.famulei.com/common/images/emoji/emoji_lzuiyou.png'
    },
]

const emoji = editorEmoji.concat(editorEmoji1, editorEmoji2)

/**
 *  转换文本中的表情符为图片
 */
export function emojiToImg (content) {
  let pattern1 = /\[(.+?)\]/g
  let pattern2 = /\[(.+?)\]/
  let str = (content || '').trim()
  let emojis = str.match(pattern1)
  if (emojis) {
    let i
    let j
    for (i = 0; i < emojis.length; i++) {
      for (j = 0; j < emoji.length; j++) {
        if ('[' + emoji[j].alt + ']' === emojis[i]) {
          if (emoji[j] && emoji[j].src) {
            str = str.replace(pattern2, '<img class="emoji-img" src="' + emoji[j].src + '" mode="widthFix" />')
          }
          break
        }
      }
    }
  }
  return str
}

export default {
  formatNumber,
  formatTime,
  getUrlParams,
  getQueryString,
  emojiToImg,
  classes
}
