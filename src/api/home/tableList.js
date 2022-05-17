import request from '@/utils/request';

export function list(pageNum,pageSize) {
    return request({
      url: '/home',
      method: 'get',
      params: {
        pageNum,
        pageSize
      },
    })
  }

  export function editPost(data) {
    return request({
      url: '/munity/discussPost/add',
      method: 'post',
      data
    })
  }