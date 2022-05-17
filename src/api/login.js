import request from '@/utils/request';

export function login(data) {
    return request({
      url: '/login',
      method: 'post',
      data
    })
  }
  export function regist(data) {
    return request({
      url: '/reigster',
      method: 'post',
      data
    })
  }