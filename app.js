var express = require('express'),
    path = require('path'),
    readline =require('readline'),
    fs= require('fs'),
    _ = require('lodash');

var app = express();

app.use('/api/randomizedata/:filename', function (req, res, next) {
    try {
        var filename = req.params.filename,
            linecount = 0,
            outputfile_7 = "output70.csv",
            outputfile_3 = "output30.csv",
            percentage_7,
            percentage_3,
            readstream = fs.createReadStream(path.join(__dirname, filename)),
            writestream7 = fs.createWriteStream(path.join(__dirname, outputfile_7)),
            writestream3 = fs.createWriteStream(path.join(__dirname,  outputfile_3));

        var lineReader = readline.createInterface({
            input: readstream
        });
        lineReader.on('line', function (line) {
            //console.log('line is ',line)
            linecount++;
        });

        lineReader.on('close', function () {
            percentage_7 = Math.round(linecount * (0.7));
            percentage_3 = linecount - percentage_7;
            console.log('total count is ', linecount, percentage_7, percentage_3);
            var randomearray = [];
            for (var i = linecount; i > 0; i--) {
                if (i <= percentage_7) {
                    randomearray.push(true);
                } else {
                    randomearray.push(false);
                }

            }
            randomearray = _.shuffle(randomearray);
            // console.log(randomearray);
            var currentindex = 0;
            readstream = fs.createReadStream(path.join(__dirname, filename));
            lineReader = readline.createInterface({
                input: readstream
            });
            lineReader.on('line', function (line) {
                line = line + '\n';
                //console.log('libe is ',line)
                if (randomearray[currentindex]) {
                    writestream7.write(line)
                } else {
                    writestream3.write(line)
                }
                currentindex++;
            });

            lineReader.on('close', function () {
                res.status(200);
                res.send({message: filename + 'records randomized and splitted to ' + outputfile_7 + ' ' + outputfile_3});
            });
        });

    } catch (error) {
        res.status(400);
        res.send({message: error});
    }

});

app.listen(8000,function () {
    console.log(' listening on port 3000!')
});