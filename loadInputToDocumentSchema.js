var cv_json = require('convert-json');
var outputStream = {};
var cradle = require('cradle');
var Chance = require('chance');
var inputFilename = 'revenueCenterDetail.csv';
var bucketName =  'doc-templates';
var documentId = 'claims.revenue.center.detail.schema';
var db = new(cradle.Connection)().database('doc-templates');
var chance = new Chance();
cv_json({
    // now supporting csv, xls, xlsx, tsv, xml format
    input: __dirname + '/input/'+inputFilename,
   output: null
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
    	outputStream.template = result;
    	var length = outputStream.template.length;
    	
    	console.log(length)



    	for (var i = 0; i < length; i++) {
            var attribute = outputStream.template[i];
            choice = chance.integer({min:0, max: 2});
            if (choice === 0) {
                valueGenerationHint = { approach: 'random', input: {valueList: ['one', 'two', 'three']}}
            }
            else if (choice === 1) {
                valueGenerationHint = { approach: 'reference', input: {path
                    : ['providerClaim', 'CUR_CLM_UNIQ_ID']}}
            }
            else if (choice === 2) {
                valueGenerationHint = { approach: 'unique', input: {valueLength:13}}
            }
            else {
                valueGenerationHint = { approach: 'constant', input: {value:'CONSTANT'}}
            }
    		attribute.value = valueGenerationHint
    	
    	}
    	
    	outputStream.type = 'documentSchema'
    	outputStream.uri = documentId
        console.log(JSON.stringify(outputStream));
    	
    	  db.save(outputStream.uri, outputStream,
    			  function (err, res) {
    	      if (err) console.log('puke');
    	  });
      
    }

  }
  );