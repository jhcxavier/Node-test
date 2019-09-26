/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */
var express = require('express')
var bodyParser = require('body-parser')
var http= require('http')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
// import AWS object without services
var AWS = require('aws-sdk');

const request = require('request')
const sharp = require('sharp');
var _ = require('underscore')
var url = require("url")
// import individual service
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


/**********************
 * Example get method *
 **********************/

app.post('/images', function(req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
  //console.log(req.body);
  processJson(req.body);
});


async function processImage(image, size, maxwidth, maxheight) {

    var width = maxwidth;
    var height = maxheight;
    if (size == 'cropped' ||
        size == 'thumb' ||
        size == 'medium' ||
        size == 'standard' ||
        size == 'vertical_standard' ||
        size == 'vertical_medium' ||
        size == 'horizontal_medium') {
    
        const features = await sharp(image).metadata();
        var w_cropPixels = (features.width < features.height) ? features.width : features.height, 
            h_cropPixels = (features.width < features.height) ? features.width : features.height;
        var options;
        //
        switch (size) {
            case "thumb":
                options = {
                    width: maxwidth,
                    height: maxheight,
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                };
                break;
            case "medium":
                options = {
                    width: maxwidth,
                    height: maxheight,
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                };
                break;
            case "standard":
                options = {
                    width: maxwidth,
                    height: maxheight,
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                };
                break;
            case "horizontal_medium":
                options = {
                    width: maxwidth,
                    height: maxheight,
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                };
                break;
            case "vertical_medium":
                options = {
                    width: maxwidth,
                    height: maxheight,
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                };
                break;
            case "vertical_standart":
                options = {
                    width: maxwidth,
                    height: maxheight,
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                };
                break;
            default: {
                width = w_cropPixels;
                height = h_cropPixels;
            }
        }
        return sharp(image).resize(options).toBuffer();
        }
    //Else for the conditional started in line 5
    else {
        return sharp(image).resize(width, height).toBuffer();
    }
}
//console.log("cropping:" + size)



function processJson(o_JSON) {

  var quality = o_JSON.quality,
    folder = o_JSON.folder,
    catalog_id = o_JSON.catalogID || "",
    catalog_name = o_JSON.catalogName || "",
    merchant_id = o_JSON.merchantID || "",
    merchant_name = o_JSON.merchantName || "",
    returnAddr = o_JSON.returnAddr,
    sizes = o_JSON.sizes || [],
    images = o_JSON.images || []



  // client.on("error", function(err) {
  //     console.log("Error " + err);
  // });

  _.each(images, function(o_image) {
    var spath = `images/test/${folder}/${merchant_id}/${catalog_id}/${o_image.id}-`;


    _.each(sizes, function(o_size) {
      var s3path = saveFiletoS3(o_image.url, spath, o_size.name, o_size.maxWidth, o_size.maxHeight);
      //return url
      //return images.url;

      var imgJSON = {
        title: "Processing  " + catalog_name + " (" + catalog_id + " ) " + o_size.name + " of " + o_image.url,
        quality: quality,
        catalog_id: catalog_id,
        folder: folder,
        returnAddr: returnAddr,
        maxWidth: o_size.maxWidth,
        maxHeight: o_size.maxHeight,
        sizeName: o_size.name,
        id: o_image.id,
        url: o_image.url
      }

      imgJSON.url = s3path;
   //   console.log(imgJSON.url)
      // sendComplete(imgJSON.url, o_JSON.returnAddr, function(req, res) {
    });
  })
}


function getFileName(url) {
  //this gets the full url
  //this removes the anchor at the end, if there is one
  url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
  //this removes the query after the file name, if there is one
  url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
  //this removes everything before the last slash in the path
  url = url.substring(url.lastIndexOf("/") + 1, url.length);
  //return
  return url;
}

function saveFiletoS3(url, s3path, size, maxwidth, maxheight) {

  var s3 = new AWS.S3(); // Add your code here
  var options = {
    uri: url,
    encoding: null
  };
  s3path = s3path + size + '-' + getFileName(url);
  request(options, function(error, res, body) {
    if (error || res.statusCode !== 200) {
      console.log("failed to get image");
      console.log(error);
    }
    else {

      processImage(body, size, maxwidth, maxheight)
      .then(buffer =>
        s3.putObject({
          Body: buffer,
          Key: s3path,
          Bucket: 'cdn.catalogs.com',
          ACL: 'public-read'
        }, function(error, data) {
          if (error) {
            console.log(s3path+ ":error downloading image to s3");
          }
          else {
            console.log(s3path + ": success uploading to s3");
          
          }
        }));

    }
  });
  return s3path;
}
function sendComplete(a_JSON, s_returnAddr, cb) {


  var s_host = url.parse(s_returnAddr).host,
    s_path = url.parse(s_returnAddr).path

  var o_options = {
    host: s_host,
    port: 80,
    path: s_path,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  var req = http.request(o_options, function(res) {
    res.on('data', function(chunk) {
      if (typeof cb == "function") cb()
    });
  })

  req.on('error', function(err) {
    if (err) { cb(err); return }
  })

  //console.dir(o_options)
  //console.log("Sending")

  req.write(JSON.stringify({ JSON: a_JSON }))
  req.end()
}

//call to post json curl -X POST  -H "application/json" -d @ImageJSON.38225.json  http://images.d.catalogshub.com:3010/images

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
