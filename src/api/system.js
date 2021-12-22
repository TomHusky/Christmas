import request from '@/libs/request'

/**
 * 获取用户信息
 */
export const getCityInfo = () => {
  return request({
    url: 'https://api.map.baidu.com/location/ip?ak=Er8iGG4UMfSd3Ckuc6w8C56peI4ge1Ih',
    method: 'get'
  })
}