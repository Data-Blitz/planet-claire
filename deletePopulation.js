var cv_json = require('convert-json');
var configuration = require('./configuration/populations/Population.json');
var cradle = require('cradle');
var db = new(cradle.Connection)().database(configuration.name);

db.destroy(function(err,data){
    if (!err) {
        console.log('destroyed '+ configuration.name);
    }
})

