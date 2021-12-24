import request from '@/libs/request'

import {
  upload
} from '@/libs/request'



/**
 * 获取用户信息
 */
export const getCityInfo = () => {
  return request({
    url: 'https://api.map.baidu.com/location/ip?ak=Er8iGG4UMfSd3Ckuc6w8C56peI4ge1Ih',
    method: 'get'
  })
}

/**
 * 上传图片
 */
export const downloadComposeImg = (file, type) => {
  return upload({
    url: 'http://127.0.0.1:8011/tools/image/downloadComposeImg',
    file: file,
    type: type
  })
}