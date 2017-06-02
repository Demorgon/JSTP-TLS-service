const querystring = require("querystring");
const fs = require("fs");
const formidable = require("formidable");
const url = require("url");
const mime = require("mime");

function start(response) {
    console.log("Request handler 'start' was called.");

    var path = './public/index.html';
    fs.readFile(path, 'utf8', function (error, file) {
        if (error) {
            throw error;
        } else {
            response.writeHead(200, {
                "Content-Type": "text/html"
            });

            var filestream = fs.createReadStream(path);
            filestream.pipe(response);
        }
    })
}


function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function (error, fields, files) {
        console.log("parsing done");
        var oldpath = files.upload.path;
        var link = keygen();
        var newpath = './uploads/' + link + '/';
        var html = '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" content="text/html; ' +
            'charset=UTF-8" />' +
            '<meta name="viewport" content="width=device-width, initial-scale=1">' +
            '<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700,900" rel="stylesheet">' +
            '<style>' +
            ' * {margin: 0; padding: 0; box-sizing: border-box;}' +
            'body {background-color: #dedede; width: 100%; height: 100vh; font-family: "Roboto", sans-serif; }' +
            'h1 {font-size: 200px; font-weight: 100; text-shadow: 5px 0px 0px rgb(102, 114, 212); color: #ffffff;}' +
            'p {font-size: 24px; font-weight: 400; color: #acacac; -webkit-transition: 0.5s; transition: 0.5s;}' +
            'a {font-size: 24px; font-weight: 400; color: #acacac; -webkit-transition: 0.5s; transition: 0.5s; text-decoration:none;}' +
            '.card_wrapper {width: 500px;height: 420px;background-color: aliceblue;border-radius: 12px;box-shadow: 0px 5px 5px rgba(41, 41, 41, 0.10);padding-bottom: 20px;}' +
            '.centered {display: -moz-flex;display: -ms-flex;display: -o-flex;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-pack: center;-ms-flex-pack: center;justify-content: center;-ms-align-items: center;-webkit-box-align: center;-ms-flex-align: center;align-items: center;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-direction: column;flex-direction: column;}' +
            '.horizontal {-webkit-box-orient: horizontal;-webkit-box-direction: normal;-ms-flex-direction: row;flex-direction: row;}' +
            '.logo {width: 500px;height: 300px;}' +
            '.text_container {width: 100%; height: auto; align-items: flex-start;text-align: center; padding: 0 10%;}' +
            '.text_block {width: 100%; height: 25%; margin: 0px 0%;}' +
            'img {height: 80%;}' +
            ' .grey {color: #acacac; transition: 0.5s;}' +
            '.red {color: rgb(209, 72, 72);}' +
            ' .overflow{overflow: auto;}' +
            ' </style>' +
            '</head>' +
            '<body class="centered">' +
            '<div class="card_wrapper centered">' +
            '<div class="logo centered">' +
            '<img src="https://lh5.googleusercontent.com/wBqEY6RUol9spgPSyHwt4zWtDN6Ot1D2nErEk2hiRU-JGnjq8pstERW9Ndp7rd-i1rcgH_lXl3cjGU4=w1440-h792" alt="Uploaded!">' +
            '</div>' +
            '<div class="text_container centered">' +
            '<div class="text_block centered">' +
            ' <p>Your file is available here:</p>' +
            '</div>' +
            '<div class="text_block centered overflow">' +
            '<a class="red" href="https://localhost:8888/6t5regn1f2?' + link + '">https://localhost:8888/6t5regn1f2?' + link + '</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</body>' +
            '</html>';
        fs.mkdir(newpath, function (err) {
            if (err) {
                throw err;
            } else {
                fs.rename(oldpath, newpath + files.upload.name, function (error) {
                    if (error) {
                        throw error;
                    } else {
                        response.writeHead(200, {
                            "Content-Type": "text/html"
                        });
                        response.write(html);
                        response.end();
                    }
                });
            }
        })

    });
}


function uploadShow(response) {
    console.log("Request handler 'upload_show' was called.");

    var path = './public/upload.html';
    fs.readFile(path, 'utf8', function (error, file) {
        if (error) {
            throw error;
        } else {
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            var filestream = fs.createReadStream(path);
            filestream.pipe(response);
        }
    })
}

function downloadShow(response) {
    console.log("Request handler 'download_show' was called.");

    var path = './public/download.html';
    fs.readFile(path, 'utf8', function (error, file) {
        if (error) {
            throw error;
        } else {
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            var filestream = fs.createReadStream(path);
            filestream.pipe(response);
        }
    })
}


function download(response, request) {
    console.log("Request handler 'download' was called.");
    var search = url.parse(request.url).search;
    search = search.slice(1);
    var path = './uploads/' + search + '/';

    var fileName = fs.readdir(path, function (error, items) {
        if (error) {
            throw error;
        } else {
            for (var i = 0; i < items.length; i++) {
                fileName = items[i];
            }
            console.log(fileName);
            fs.readFile(path + fileName, function (error, file) {
                if (error) {
                    throw error;
                } else {
                    response.setHeader('Content-disposition', 'attachment; filename="' + fileName + '"');
                    var filestream = fs.createReadStream(path + fileName);
                    filestream.pipe(response);
                }
            });
        }
    });
}

function keygen() {
    var array = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var key = '';

    for (var i = 0; i < 15; i++) {
        key += array[Math.floor(Math.random() * (array.length - 0)) + 0]
    }
    return key;
}

exports.start = start;
exports.upload = upload;
exports.uploadShow = uploadShow;
exports.download = download;
exports.downloadShow = downloadShow;
