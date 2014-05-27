/**
 * Created by paul on 5/15/14.
 */
//var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var Chance = require('chance'),
    chance = new Chance();




module.exports = {
    write: function(aGeneratedContent, aDocumentSchemas, aConfiguration,
                    anOutboundStreamIndex, aWriterIndex, anOutputPath, aTimeStampDirectoryName) {
        console.log('writing content to hoop : '+JSON.stringify(aGeneratedContent))

    }
}

