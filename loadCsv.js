var cv_json = require('convert-json');
var outputStream = {};
var cradle = require('cradle');
var db = new(cradle.Connection)().database('names');


cv_json({
        // now supporting csv, xls, xlsx, tsv, xml format
        input: __dirname + '/input/maleNamesAndNickNames.csv',
        output: null
    }, function(err, result) {
        if(err) {
            console.error(err);
        }else {
            outputStream.data = result;
            var length = outputStream.data.length;

            console.log(length)

            outputStream.type = 'names'
            outputStream.uri = 'male-names-w-nicknames'
            console.log(JSON.stringify(outputStream));

            db.save(outputStream.uri, outputStream,
                function (err, res) {
                    // Handle response
                });

        }

    }
);