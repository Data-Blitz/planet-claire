var cv_json = require('convert-json');
var configuration = require('./configuration/populations/Population.json');
var Chance = require('chance'),
    chance = new Chance();
var cradle = require('cradle');
var db = new(cradle.Connection)().database(configuration.name);
var outputStream = {};


var basePopulationSize = configuration.count;
console.log('creating a '+basePopulationSize+' population:'+ configuration.name);



db.exists(function (err, exists) {
    if (err) {
        console.log('error', err);
    } else if (exists) {
        console.log('using existing db '+configuration.name );
    } else {
        console.log('database does not exists.');
        db.create(build);
        /* populate design documents */
    }
});

var build = function() {
var count = 0;
var chunk = 0;
    var buffer = [];
    for (var i = 0; i < configuration.count; i++) {
        var person = {};
        var details = {};
        details.age = chance.integer({'min': 5, 'max': 85});
        details.sex = chance.gender();
        details.firstName = chance.first();
        details.lastName = chance.last();
        details.address = chance.address();
        details.postalCode = chance.zip();
        details.state = chance.state();
        details.socialSecurityNumber = chance.integer({min: 0, max: 99999999});
        person.details = details
        person.identifiers = {};
        person.identifiers.id1="adsfasdad";
        person._id = '' + i + ''
        buffer.push(person);
        if (buffer.length > configuration.chunkSize) {
            process.nextTick(function() {
            console.log('chunking...');
            db.save(buffer, person,
                function (err, res) {
                    if (err) {
                        console.log('oh no, problems saving ' + i)
                    }
                    else {
                        console.log('chunked out:' +   chunk++)
                    }
                    count++;
                    //console.log('saved: ' + count)
                });
            buffer = []
            });
        }
    }
    console.log('done')
}

build();