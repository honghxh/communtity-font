import request from '@/utils/request';

export function personData(id) {
    return request({
      url: '/profile/'+id,
      method: 'get',
    })
  }
  export function follow(data) {
    return request({
      url: '/follow',
      method: 'post',
      data
    })
  }
  export function unfollow(data) {
    return request({
      url: '/unfollow',
      method: 'post',
      data
    })
  }

  export function getFollowee(userId) {
    return request({
      url: '/followees/'+userId,
      method: 'get',
    })
  }
  export function getFollower(userId) {
    return request({
      url: '/followers/'+userId,
      method: 'get',
    })
  }