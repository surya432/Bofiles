/*
* @Author: kimbui
* @Date:   2017-03-08 09:30:11
* @Last Modified by:   kimbui
* @Last Modified time: 2017-03-09 23:02:19
*/



'use strict';
require('dotenv').load();
var http = require('http')

// Create API Stream Video





//app.get('/videoplayback', require('./lib/videoplayback'))



module.exports = http.createServer((req, res) => {
    app(req, res, require('finalhandler')(req, res))
    // res.end()
})

module.exports.listen(process.env.PORT, function () {
    console.log(`Server running at http://${process.env.VIRTUAL_HOST}:${process.env.PORT}/`);
})
