import fly from './config'
import qs from 'qs'
import config from '@/config'
import md5 from 'js-md5'

const ajaxHost = config.apiHost

/**
 * 接口模版====post
 *
 * export const test = params => {return fly.post(`${root}/xx/xx`, qs.stringify(params))};
 *
 * 接口模版====get
 *
 * export const test1 = function(){return fly.get(`${root}/api/getNewsList`)}
 *
 *
 * 用法：
 * 在 页面用引入 post
 * import { post } from '../../http/api.js'
 *
 * post(url, params).then(res=>{ console.log(res) })
 */

/**
 *  生成sign参数
 */
function getSign (params) {
  let _params = params || {}
  let keys = []
  let str = ''
  for (let key in _params) {
    keys.push(key)
  }
  keys.sort(function (val1, val2) {
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  })
  keys.forEach(item => {
    str += item + _params[item]
  })
  let sign = md5(str + 'FAMULEIENCODE2329')
  sign = (md5(sign.toUpperCase())).toUpperCase()
  return sign
}

// 通用的ajax请求
export const ajax = (type, url, params) => {
  const URL = typeof url === 'string' ? ajaxHost + url : ''
  let _type = (type === 'GET' || type === 'POST') ? type : 'GET'
  let _params = {
    ts: Math.round(new Date() / 1000),
    platform: 'weixin',
    api_version: '9.9.9',
    language_id: 1,
    gameID: 1,
    appid: 1
  }
  let pms = Object.prototype.toString.call(params) === '[object Object]' ? params : {}
  for (let key in pms) {
    _params[key] = pms[key]
  }

  _params.sign = getSign(_params)
  return fly.request(URL, qs.stringify(_params), {
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: _type,
    timeout: 5000
  })
}

// 通用的get请求
export const get = (url, params) => {
  const URL = typeof url === 'string' ? ajaxHost + url : ''
  let _params = {
    api_path: typeof url === 'string' ? url : '',
    platform: 'weixin',
    api_version: '9.9.9',
    language_id: 1,
    gameID: 1,
    appid: 1
  }
  let pms = Object.prototype.toString.call(params) === '[object Object]' ? params : {}
  for (let key in pms) {
    _params[key] = pms[key]
  }
  _params.sign = getSign(_params)
  return fly.get(URL, _params)
}

// 通用的post请求
export const post = (url, params) => {
  const URL = typeof url === 'string' ? ajaxHost + url : ''
  let _params = {
    api_path: typeof url === 'string' ? url : '',
    platform: 'weixin',
    api_version: '9.9.9',
    language_id: 1,
    gameID: 1,
    appid: 1
  }
  let pms = Object.prototype.toString.call(params) === '[object Object]' ? params : {}
  for (let key in pms) {
    _params[key] = pms[key]
  }
  _params.sign = getSign(_params)
  return fly.post(URL, qs.stringify(_params))
}

// 封装的登录请求，根据后台接收方式选择是否加qs.stringify
// export const login = params => {
//   return fly.post('/login', params)
// }

export function test (name) {
  console.log(name)
}

export default {
  post,
  get,
  ajax
}
