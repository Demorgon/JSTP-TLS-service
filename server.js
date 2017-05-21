const https = require("https");
const url = require("url");
const fs = require("fs");

var options = {
    key: fs.readFileSync('./enc/server.key'),
    cert: fs.readFileSync('./enc/server.crt')
};

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        route(handle, pathname, response, request);
    }

    https.createServer(options, onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;
