/*
* @Author: kimbui
* @Date:   2017-03-08 23:59:32
* @Last Modified by:   kimbui
* @Last Modified time: 2017-03-10 00:48:03
*/

'use strict';

const getVideoLink = require('./get-video-link')
const extractVideos = require('./extract-video')
const proxy = require('./proxy')
const downloaders = require('./downloader')
const fs = require("fs");
const crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'Pruzz#107', iv = '60iP0h6vJoEa';
const base64 = require('base64url')
const wget = require('wget-improved');


module.exports = (req, res, docId) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  }
  const driveId = base64.decode(docId)
  const video360 = `${process.env.FOLDER_DIR}${docId}.mp4`
  if (!fs.existsSync(video360)) {
    var keyContent = fs.readFileSync('./array.txt').toString()
    var key = keyContent.split(",")
    var keys = key[Math.floor(Math.random() * key.length)];
    const sourcesdownload = `https://www.googleapis.com/drive/v3/files/${docId}?alt=media&key=AIzaSyAkfDYvgwPurHsSqZ7ssGg-E_4BxUHh070	`
    try {
      var download = wget.download(sourcesdownload, video360);
      download.on('error', function (error) {
        console.log(error)
        res.statusCode = 200
        return res.end(JSON.stringify({
          status: 'FAIL',
          reason: 'error proses download'
        }))
      });
      download.on('end', function (output) {
        console.log(output);
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf8')
        var resultsource = {
          status: "ok",
          via: "HDD",
          sources: []
        }
        if (fs.existsSync(video360)) {
          resultsource.sources.push({
            label: "360p",
//            type: 'video/mp4',
            default: true,
            file: `http://${process.env.VIRTUAL_HOST}/${process.env.URL_VIDEO}/${docId}.mp4${process.env.EXT_VIDEO}`,
          })
        }
        return res.end(
          JSON.stringify(resultsource)
        )
      });
    } catch (error) {
      console.log(error)
      // console.log(video360 + " Deleted");
      // fs.unlink(video360);
      res.statusCode = 200
      return res.end(JSON.stringify({
        status: 'FAIL',
        reason: 'Error Download '
      }))
    }
  } else {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf8')
    var resultsource = {
      status: "ok",
      via: "HDD",
      sources: []
    }
    if (fs.existsSync(video360)) {
      resultsource.sources.push({
        label: "360p",
//        type: 'video/mp4',
        default: true,
        file: `http://${process.env.VIRTUAL_HOST}/${process.env.URL_VIDEO}/${docId}.mp4${process.env.EXT_VIDEO}`,
      })
    }
    return res.end(
      JSON.stringify(resultsource)
    ) 
  }
}
