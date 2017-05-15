const querystring = require("querystring");
const fs = require("fs");
const formidable = require("formidable");

function start(response) {
    console.log("Request handler 'start' was called.");


    var body = fs.readFileSync('./public/index.html', 'utf8')
    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(body);
    response.end();

}


function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function (error, fields, files) {
        console.log("parsing done");
        var oldpath = files.upload.path;
        var newpath = './uploads/' + files.upload.name;
        fs.rename(oldpath, newpath, function (error) {
            if (error) {
                fs.unlink("./tmp/test.png");
                fs.rename(files.upload.path, "./tmp/test.png");
            } else {
                response.write('File uploaded and moved!');
                response.end();
            }
        });
    });
}

function show(response, postData) {
    console.log("Request handler 'show' was called.");
    fs.readFile("./tmp/test.png", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {
                "Content-Type": "text/plain"
            });
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {
                "Content-Type": "image/png"
            });
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
