import request from '@/utils/request';

export function addlike(data) {
    return request({
      url: '/munity/like',
      method: 'post',
      data
    })
  }