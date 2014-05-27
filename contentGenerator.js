var async = require('async');
var cradle = require('cradle');
var Chance = require('chance');
fs = require('fs');
//var makeDirectory = require('mkdirp');
var valueGenerator = require('./dataGenerators/valueGenerator.js');
var configuration = require('./configuration/contentGeneratorConfiguration.json');
var documentSchemasDb = new (cradle.Connection)().database(configuration.dataStores.documentSchema.bucketName);
var populationDb = new (cradle.Connection)().database(configuration.dataStores.population.bucketName);
var chance = new Chance();


var generateValue = function (aPerson, anApproach, anInput) {
    if (anApproach === 'reference') {
        //console.log('creating referenced value: '+ JSON.stringify(anInput))
        input = anInput.path;
        return 'placeHolder'
        if (!anInput.path) {
            throw new Exception('cannot find reference path attribute')
        }
        var referenced = aPerson[input[0]]
        if (input.length > 1) {
            for (i = 1; i < input.length; i++) {
                if (referenced[input[i]]) {
                    referenced = referenced[input[i]]
                }
            }
        }
        //console.log('creating referenced value:'+referenced+' from input:'+JSON.stringify(input))
        return referenced;
    }
    else {
       // console.log(' generating approach: '+approach+' with input: '+JSON.stringify(anInput))
        //return valueGenerator[approach](anInput);
        return 'placeHolder'
    }
}

var generateDocument = function (aPerson, aSchema) {
 // console.log('aPerson: ' + JSON.stringify(aPerson));
 // console.log('aSchema: ' + JSON.stringify(aSchema));
    schema = aSchema.template;
    //console.log('list: ' + JSON.stringify(schema));
    var document = {};
    for (var i = 0; i < schema.length; i++) {

        if (schema[i].ElementName !== '') {
            value = generateValue(aPerson,
                schema[i].value.approach, schema[i].value.input);
            document[schema[i].ElementName] = value;
         //console.log('adding: ' + schema[i].ElementName + ' : ' + value);

        }
    }
    return document;
}
var generateStream = function (aSamplePopulation, aSchema) {
    stream = [];
    for (j = 0; j < aSamplePopulation.length; j++) {
        document = generateDocument(aSamplePopulation[j], aSchema);
        stream.push(document);
    }
    console.log('send stream:'+ stream.length)
    return stream
}

var generateContent = function (aSamplePopulation, aSchemas) {
    // console.log('SamplePopulation: ' + JSON.stringify(aSamplePopulation));
    // console.log('Schemas: ' + JSON.stringify(aSchemas));
    var contents = [];
    for (i = 0; i < aSchemas.length; i++) {
        stream = generateStream(aSamplePopulation, aSchemas[i])
        contents.push(stream);
        //console.log('pushing: ' + JSON.stringify(document));
    }
    return contents;
}


/*
var generateContent = function (aSamplePopulation, aSchemas) {
    var content = []
   // console.log('SamplePopulation: ' + JSON.stringify(aSamplePopulation));
   // console.log('Schemas: ' + JSON.stringify(aSchemas));
    var contents = [];
    for (j = 0; j < aSamplePopulation.length; j++) {
        //console.log('pushing list: ' + aSamplePopulation.length);
        //console.log('pushing number of streams: ' + aSchemas.length);
        aSamplePopulation[j] = addEventData(aSamplePopulation[j]);
        console.log('person:'+JSON.stringify( aSamplePopulation[j]))
        var content = []
        for (i = 0; i < aSchemas.length; i++) {
            document = generateDocument(aSamplePopulation[j], aSchemas[i])
            content.push(document);
            //console.log('pushing: ' + JSON.stringify(document));
        }
        contents.push(content);
    }
    return contents;
}
*/
/*
var generateContent = function (aSamplePopulation, aSchemas) {

   // console.log('SamplePopulation: ' + JSON.stringify(aSamplePopulation));
   // console.log('Schemas: ' + JSON.stringify(aSchemas));
    var contents = [];

    for (k = 0; k < aSamplePopulation.length; k++) {
        aSamplePopulation[k] = addEventData(aSamplePopulation[k]);
        //console.log('person:'+JSON.stringify( aSamplePopulation[k]))
    }
    for (i = 0; i < aSchemas.length; i++) {
        //console.log('pushing list: ' + aSamplePopulation.length);
        //console.log('pushing number of streams: ' + aSchemas.length);
        //aSamplePopulation[j] = addEventData(aSamplePopulation[j]);
        var content = []
        for (j = 0; j < aSamplePopulation.length; j++) {
            document = generateDocument(aSamplePopulation[j], aSchemas[i])
            content.push(document);
            console.log('pushing: ' + JSON.stringify(document));
        }
        contents.push(content);
    }
    return contents;
}
*/
async.parallel({
        samplePopulation: function (callback) {
            setTimeout(function () {
                samplePopulation = []
                populationDb.info(function (err, data) {
                    var populationSourceSize = data.doc_count;
                    var populationSize = configuration.dataStores.population.count;
                    var populationIds = [];
                    for (i = 0; i < populationSize; i++) {
                        randomId = chance.integer({min: 1, max: populationSourceSize});
                        id = '' + randomId + '';
                        populationIds.push(id);
                    }
                    populationDb.get(populationIds,
                        function (err, aPopulationStream) {
                            //console.log(JSON.stringify(aPopulationStream));
                            for (i = 0; i < aPopulationStream.length; i++) {
                                var doc = aPopulationStream[i].doc
                                samplePopulation.push(doc);
                            }

                            callback(null, samplePopulation);
                            //console.log(JSON.stringify(population))
                        });
                })

            }, 200);
        },
        documentSchemas: function (callback) {
            setTimeout(function () {
                schemas = [];
                for (i = 0; i < configuration.outboundStreams.length; i++) {
                    configuration.outboundStreams[i].documentSchema
                    documentSchemasDb.get(configuration.outboundStreams[i].documentSchema,
                        function (err, aSchemaDocument) {
                            //console.log('loading schema');
                            schemas.push(aSchemaDocument);
                        })
                }
                callback(null, schemas);
            }, 100);
        }
    },

// optional callback
    function (err, results) {
        console.log(JSON.stringify(results))
        async.series({
                generatedContent: function (callback) {
                    setTimeout(function () {
                        content = generateContent(results.samplePopulation, results.documentSchemas)
                        console.log('generated content: '+content.length+' documents');
                        documentSchemas = results.documentSchemas;
                        data = [content,results.documentSchemas ];
                        callback(null, data);
                    }, 600);
                }
            },
            function (err, results) {
                generatedContent = results.generatedContent[0];
                documentSchemas = results.generatedContent[1];
                console.log('attempting to write '+generatedContent.length+' documents ');
                writeContent(generatedContent, documentSchemas);

                //console.log(JSON.stringify(results))
            });
    });

var writeContent = function (aGeneratedContent, aDocumentSchemas) {
   // console.log('writeContent aGeneratedContent: '+JSON.stringify(aGeneratedContent))
   // console.log('writeContent  aDocumentSchemas: '+JSON.stringify(aDocumentSchemas))
    var timeStampDirectoryName = new Date().toISOString();
    var outputPath = configuration.outboundDirectory+'/'+ configuration.batchId+'/'+ timeStampDirectoryName;
  //  console.log('outputPath: '+ JSON.stringify(outputPath));
    for (i = 0; i < configuration.outboundStreams.length; i++) {
        for ( j = 0; j < configuration.outboundStreams[i].writers.length; j++) {
            dataWriter = require(configuration.outboundStreams[i].writers[j].dataWriter);
            if (dataWriter) {
                dataWriter.write(aGeneratedContent[i], aDocumentSchemas,
                    configuration, i, j, outputPath,timeStampDirectoryName);
            }
        }
    }
}



var addEventData = function (aPerson) {
    var events = configuration.events;
    for (i = 0; i < events.length; i++) {
        //console.log("EVENT: "+ JSON.stringify(events[i]))
        var mixInData = require(events[i].data);
        var attributes = mixInData.content.attributes;
        var eventName = mixInData.content.name;
       // console.log('addEventData-->'+attributes.length+' attributes: '+ JSON.stringify(attributes))
        var doc = {};
        for ( attributeIndex = 0; attributeIndex < attributes.length; attributeIndex++) {
            name = attributes[attributeIndex].name;
            approach = attributes[attributeIndex].approach;
            console.log('approach: '+ approach);
            value = valueGenerator[approach](attributes[attributeIndex].input);
            doc[name] = value;
            console.log(name+' : '+value)
        }
        aPerson[eventName] = doc;
    }
    return aPerson;
}
//  write: function(aGeneratedContent, aDocumentSchemas, aConfiguration, anOutboundStreamIndex, aWriterIndex) {