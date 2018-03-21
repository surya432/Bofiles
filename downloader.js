'use strict';
const got = require('got');
const fs = require("fs");
const crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'Pruzz#107';

module.exports = (json, docId, res, req ) => {
    function encrypt(text) {
        var cipher = crypto.createCipheriv(algorithm, password)
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    }
    res.setHeader('Content-Type', 'application/json; charset=utf8')
    const obj = JSON.parse(json);
    
    var keyContent = fs.readFileSync('./array.txt').toString()
    var key = keyContent.split(",")
    var keys = key[Math.floor(Math.random() * key.length)];
    const sources = `https://www.googleapis.com/drive/v3/files/${docId}?alt=media&key=${keys}`
    var resultsource = {
        status: "ok",
        via: "Downloaders",
        sources: [
            {
                label: "720p",
                type: 'video/mp4',
                file: `http://${process.env.VIRTUAL_HOST}:${process.env.PORT}/videos/apis/${encrypt(sources)}/video.mp4`,
            },
        ]
    }
    obj.data.map(function (element, index) {
        if (element.label == "360p") {
            const path = `${process.env.FOLDER_DIR}/${encrypt(docId)}.mp4`;
            console.log(element.src)
            if (!fs.existsSync(path)) {
                got.stream(element.src)
                .on('error', function (e) {
                    console.log(path + " Deleted");
                    fs.unlink(path);
                    throw e
                })
                .pipe(fs.createWriteStream(path), res)
            }
        }
    });
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf8')
    res.end(
        JSON.stringify(resultsource)
    ) 
}