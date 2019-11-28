"use strict";
require("dotenv").load();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const url = require("url");
const fs = require("fs");
var path = require("path");
const qs = require("querystring");
const base64 = require("base64url");
const got = require("got");
const handleError = require("./error-handler");
app.use(function(req, res, next) {
  var allowedOrigins = [
    "http://127.0.0.1:8020",
    "http://localhost:8020",
    "http://127.0.0.1:9000",
    "http://localhost:9000"
  ];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Origin", "http://jpfilms.com");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});
app.get("/mp4/:id/:filename", function(req, res) {
  const headers = Object.assign({}, req.headers, { Server: "HR-KU-1" });
  sources = "http://cdn2.dldramaid.xyz/pd/" + req.params.id + ".mp4";
  console.log(sources);
  got
    .stream(sources, { headers })
    .on("response", response => {
      delete response.headers.host;
      delete response.headers.referer;
      delete response.headers.server;
      res.statusCode = response.statusCode;
      Object.keys(response.headers).forEach(key => {
        res.setHeader(key, response.headers[key]);
        res.setHeader("X-Powered-By", "HAHOCloudStorage");
      });
    })
    .on("error", function(e) {
      console.log(e.message);
      res.sendStatus(503);
    })
    .pipe(res);
});
app.get("/api/googledrive/:id", function(req, res, next) {
  // Basic auth
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  if (query.token == `${process.env.TOKEN_AUTH}`) {
    const getVideo = require("./get-video");
    getVideo(req, res, req.params.id);
  } else {
    res.setHeader("Content-Type", "application/json; charset=utf8");
    const resultsource = {
      status: "FAIL",
      message: "ERROR FILE OR TOKEN"
    };
    res.end(JSON.stringify(resultsource));
  }
});
app.get("/api/proxy/:id", function(req, res, next) {
  // Basic auth
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  if (query.token) {
    const getVideo = require("./get-video-proxy");
    getVideo(req, res, req.params.id, query.videoName);
  } else {
    res.setHeader("Content-Type", "application/json; charset=utf8");
    const resultsource = {
      status: "FAIL",
      message: "ERROR TOKEN"
    };
    res.end(JSON.stringify(resultsource));
  }
});
app.get("/delete/googledrive/:id", function(req, res, next) {
  // Basic auth
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  if (query.token == `${process.env.TOKEN_AUTH}`) {
    const getVideo = require("./get-video");
    getVideo(req, res, req.params.id);
  } else {
    res.setHeader("Content-Type", "application/json; charset=utf8");
    const resultsource = {
      status: "FAIL",
      message: "ERROR FILE OR TOKEN"
    };
    res.end(JSON.stringify(resultsource));
  }
});
app.get("/videos/apis/:driveid/:videoname", function(req, res, next) {
  const getVideo = require("./googleapis");
  getVideo(req, res, req.params.driveid);
});
app.get("/mirror/:driveid/:videoname", function(req, res, next) {
  const getmirror = require("./rapidvideo");
  const uploadsDi2r = `${process.env.FOLDER_DIR}`;
var uploadsDir = __dirname + '/video/';
console.log(uploadsDir);
    fs.readdir(uploadsDir, function(err, files) {
    files.forEach(function(file, index) {
      fs.stat(path.join(uploadsDir, file), function(err, stat) {
        var endTime, now;
        if (err) {
          return console.error(err);
        }
        now = new Date().getTime();
        endTime = new Date(stat.ctime).getTime() + 3600000;
        if (now > endTime) {
          return rimraf(path.join(uploadsDir, file), function(err) {
            if (err) {
              return console.error(err);
            }
            console.log("successfully deleted");
          });
        }
      });
    });
  });
  getmirror(req, res, req.params.driveid, req.params.videoname);
});
app.get("/video/:filename", function(req, res) {
var path = __dirname + '/video/'+req.params.filename;
     const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head)
    fs.createReadStream(path).pipe(res)
  }
});
// hide all url from spiderbot
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.end("User-agent: *\nDisallow: /");
});
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World! I am Version 1.0.2");
});
app.get("/googledrive/videoplayback", require("./videoplayback"));

app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});
