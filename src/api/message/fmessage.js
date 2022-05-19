import request from '@/utils/request';

export function list(pageNum,pageSize) {
    return request({
      url: '/munity/message/list',
      method: 'get',
      params: {
        pageNum,
        pageSize
      },
    })
  }
  export function sendMessage (data) {
    return request({
      url: '/munity/message/letter/send',
      method: 'post',
      data
    })
  }

  export function converList(conversationId,pageNum,pageSize) {
    return request({
      url: '/munity/message/letter/detail',
      method: 'get',
      params: {
        conversationId,
        pageNum,
        pageSize
      },
    })
  }
  // restful风格地址+参数  ？+参数 是用param
  export function deletemessage(id) {
    return request({
      url: '/munity/message/letter/delete/'+id,
      method: 'get',
    })
  }

  export function getnoticelist(topic) {
    return request({
      url: '/munity/message/notice/detail/'+topic,
      method: 'get',
    })
  }