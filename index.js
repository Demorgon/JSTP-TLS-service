const server = require("./server.js");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/ghj2y5u6io"] = requestHandlers.upload;
handle["/upload"] = requestHandlers.uploadShow;
handle["/download"] = requestHandlers.downloadShow;
handle["/6t5regn1f2"] = requestHandlers.download;

server.start(router.route, handle);
