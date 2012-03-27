var http = require('http'),
    url = require('url'),
    request    = require('request'),
    sys     = require('sys'),
    _ = require('underscore')._,
    async = require('async');

    console.log("port: " + process.env.PORT + "\r\n");

http.createServer(function (req, res) {
    
    requestDispatch(req, res);
}).listen(process.env.PORT);
  
function normalWrite( httpRequest, httpResponse) 
{
  httpResponse.writeHead(200, {'Content-Type': 'text/html'});
  httpResponse.end("Default response, indexof '2' in [1 1 2 3 5] is " + _([1, 1, 2, 3, 5]).indexOf(2) + " \r\n");
}

function asyncWrite( httpRequest, httpResponse) 
{
  httpResponse.writeHead(200, {'Content-Type': 'text/html'});
  async.parallel([
    function () {for(var i = 0; i < 1000; i = i + 1) {httpResponse.write("<br>\r\nfunction 1: " + i); }},
    function () {for(var i = 0; i < 1000; i = i + 1) {httpResponse.write("<br>\r\nfunction 2: " + i); }}
    ],
    function () {}
  );
  httpResponse.end("<br>\r\nEnd of response\r\n");
}

function showLogo(httpRequest, httpResponse)
{
    request.get("http://nodejs.org/logo.png").pipe(httpResponse)
}

function requestDispatch( httpRequest, httpResponse)
{
  var parsedUrl = url.parse(httpRequest.url);
  if (parsedUrl.query && parsedUrl.query.length > 0)
  {
    if (parsedUrl.query.indexOf("logo") >= 0) 
    {
      showLogo( httpRequest, httpResponse);
    }
    else 
    {
      asyncWrite( httpRequest, httpResponse);
    }
  }
  else
  {
    normalWrite( httpRequest, httpResponse);
  }
}