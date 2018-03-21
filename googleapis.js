'use strict';

const got = require('got')
const handleError = require('./error-handler')
const crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'Pruzz#107';
const fs = require("fs");

module.exports = (req, res, driveId) => {
    function decrypt(text) {
        var decipher = crypto.createDecipher(algorithm, password)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
    var keyContent = fs.readFileSync('./array.txt').toString()
    var key = keyContent.split(",")
    var keys = key[Math.floor(Math.random() * key.length)];
    const sources = `https://www.googleapis.com/drive/v3/files/${driveId}?alt=media&key=${keys}`
    const headers = Object.assign({}, req.headers, { "Server": "CloudStorage" })
    delete headers.host
    delete headers.referer
    try {
        got.stream(sources, { headers })
            .on('response', (response) => {
                res.statusCode = response.statusCode
                Object.keys(response.headers).forEach(key => {
                    res.setHeader(key, response.headers[key])
                    res.setHeader("Content-Type", "video/mp4")
                })
            })
            .on('error', handleError)
            .pipe(res)
    } catch (error) {
        throw error
    }
}