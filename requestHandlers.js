const querystring = require("querystring");
const fs = require("fs");
const formidable = require("formidable");
const url = require("url");
const mime = require("mime");

function start(response) {
    console.log("Request handler 'start' was called.");


    fs.readFile('./public/index.html', 'utf8', function (error, file) {
        if (error) {
            throw error;
        } else {
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            response.write(file);
            response.end();
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
        fs.mkdir(newpath, function (err) {
            if (err) {
                throw err;
            } else {
                fs.rename(oldpath, newpath + files.upload.name, function (error) {
                    if (error) {
                        throw error;
                    } else {
                        response.write('Your acces link: http://localhost:8888/download?' + link);
                        response.end();
                    }
                });
            }
        })

    });
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
                    var filestream = fs.createReadStream(file);
                    filestream.pipe(response);
                    //                    response.write(file);
                    //                    response.end();
                }
            });
        }
    });



    //    fs.readFile(path + items[i], function (error, file) {
    //                    if (error) {
    //                        throw error;
    //                    } else {
    //                        response.setHeader('Content-disposition', 'attachment; filename="' + items[i] + '"');
    //                        response.write('' + file.path);
    //                        response.end();
    //                    }
    //                });
    //    





    //    fs.readFile(path, "binary", function (error, file) {
    //        if (error) {
    //            response.writeHead(500, {
    //                "Content-Type": "text/plain"
    //            });
    //            response.write(error + "\n");
    //            response.end();
    //        } else {
    //            response.setHeader('Content-disposition', 'attachment; filename=111.txt');
    //            var filestream = fs.createReadStream(file);
    //            filestream.pipe(response);
    //
    //        }
    //    });
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
exports.download = download;
