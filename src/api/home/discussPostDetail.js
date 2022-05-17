import request from '@/utils/request';

export function PostDetailComment (discussPostId,pageNum,pageSize) {
    return request({
      url: '/munity/discussPost/comment',
      method: 'get',
      params: {
        discussPostId,
        pageNum,
        pageSize
      },
    })
  }
  export function PostDetail (discussPostId) {
    return request({
      url: '/munity/discussPost/detail',
      method: 'get',
      params: {
        discussPostId,
      },
    })
  }
  export function addComment (data) {
    return request({
      url: '/munity/comment/add',
      method: 'post',
      data
    })
  }
  export function reply (data) {
    return request({
      url: '/munity/comment/addReply',
      method: 'post',
      data
    })
  }
  export function replyList (id) {
    return request({
      url: '/munity/comment/replyList',
      method: 'get',
      params:{
      id
    },
    })
  }