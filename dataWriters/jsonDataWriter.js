/**
 * Created by paul on 5/15/14.
 */
//var mkdirp = require('mkdirp');
var fs = require('fs-extra');

module.exports = {
    write: function(aGeneratedContent, aDocumentSchemas, aConfiguration,
                    anOutboundStreamIndex, aWriterIndex, anOutputPath, aTimeStampDirectoryName) {
        console.log('writing content: '+JSON.stringify(aGeneratedContent))
        //console.log('writing schemas: '+JSON.stringify(aDocumentSchemas))
        //console.log('writing configuration: '+JSON.stringify(aConfiguration))
        outputPath = aConfiguration.outboundDirectory+'/'+
            aConfiguration.batchId+'/'+aTimeStampDirectoryName+'/'+
            aConfiguration.outboundStreams[anOutboundStreamIndex]. writers[aWriterIndex].configuration.folder+'/';
        filename =  aConfiguration.outboundStreams[anOutboundStreamIndex].documentSchema+'.json';
        //console.log('write path'+ JSON.stringify(outputPath+filename))
        fs.outputFile(outputPath+filename, JSON.stringify(aGeneratedContent), function(err) {
         console.log('just wrote: '+ aGeneratedContent.length); //null

        })
    }
}

