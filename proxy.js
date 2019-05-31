/*
* @Author: kimbui
* @Date:   2017-03-08 13:06:19
* @Last Modified by:   kimbui
* @Last Modified time: 2017-03-10 01:54:33
*/

'use strict'

const base64 = require('base64url')
const urls = require('./proxy')

const createProxyVideo = (video, cookie) => {
  return Object.assign({}, video, {
    src: toProxyURL(video.originSrc, cookie)
  })
}

const toProxyURL = (url, cookie) => {
  const hash = base64(JSON.stringify({
    cookie,
    url
  }))
  return `${process.env.VIRTUAL_HOST}/googledrive/videoplayback?hash=${hash}`
}

module.exports = {
  createProxyVideo: createProxyVideo
}