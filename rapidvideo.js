'use strict';

const getVideoLink = require('./get-video-link')
const extractVideos = require('./extract-video')
const proxy = require('./proxy')
const downloaders = require('./downloader')
const fs = require("fs");
const crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'Pruzz#107', iv = '60iP0h6vJoEa';
const base64 = require('base64url')
const wget = require('wget-improved');
module.exports = (req, Response, docId, name_file) => {
    const video360 = `${process.env.FOLDER_DIR}/${name_file}`
    if (!fs.existsSync(video360)) {
        var keyContent = fs.readFileSync('./array.txt').toString()
        var key = keyContent.split(",")
        var keys = key[Math.floor(Math.random() * key.length)];
        const sourcesdownload = `https://www.googleapis.com/drive/v3/files/${docId}?alt=media&key=${keys}`
        try {
            var download = wget.download(sourcesdownload, video360);
            download.on('error', function (error) {
                console.log(error)
                Response.statusCode = 404
                return Response.end(JSON.stringify({
                    status: 'FAIL',
                    reason: 'error proses download'
                }))
            });
            download.on('end', function (output) {
                console.log(output);
                return Response.redirect(301, `http://${process.env.VIRTUAL_HOST}/${process.env.URL_VIDEO}/${name_file}`)
            });
        } catch (error) {
            console.log(error)
            console.log(video360 + " Deleted");
            fs.unlink(video360);
            Response.statusCode = 404
            return Response.end(JSON.stringify({
                status: 'FAIL',
                reason: 'Error Download '
            }))
        }
    } else {
        return Response.redirect(301, `http://${process.env.VIRTUAL_HOST}/${process.env.URL_VIDEO}/${name_file}`)
    }
}