var fs = require('fs');
var csv_json = require('node-csv-json');
var xls_json = require('xls-to-json');
var xlsx_json = require('xlsx-to-json');
var xml_json = require('xml-to-json');
var tsv_json = require('node-tsv-json');


module.exports = CV_json;

function CV_json (config, callback) {

	if(!config.input) {
		console.error("You have to have an input file");
		process.exit(1);
	}

	var cv = new _CV_json(config, callback);
}

_CV_json = function(config, callback) {
	var exten = this._getExtension(config.input).toLowerCase();
	switch(exten) {
		case 'csv': 
			return this.cvCSV(config, callback);
			break;
		case 'tsv':
			return this.cvTSV(config, callback);
			break;
		case 'xls':
			return this.cvXLS(config, callback);
			break;
		case 'xlsx':
			return this.cvXLSX(config, callback);
			break;
		case 'xml':
			return this.cvXML(config, callback);
		default:
			if(config.type==='csv' && config.input)
				return this.cvCSV(config, callback);
			else
				return callback('Not Support');
	}
}

_CV_json.prototype._getExtension = function(filename) {
	return filename.split('.').pop();
}

_CV_json.prototype.cvCSV = function(config, callback) {
	csv_json({
		input: config.input, 
		output: config.output
	}, function(err, result){
		if(err) {
			callback(err)
		}else {
			callback(null, result)
		}
	});
	
}

_CV_json.prototype.cvTSV = function(config, callback) {
	tsv_json({
		input: config.input, 
		output: config.output
	}, function(err, result){
		if(err) {
			callback(err)
		}else {
			callback(null, result)
		}
	});
}
	

_CV_json.prototype.cvXLS = function(config, callback) {
	xls_json({
		input: config.input, 
		output: config.output
	}, function(err, result){
		if(err) {
			callback(err)
		}else {
			callback(null, result)
		}
	});
}

_CV_json.prototype.cvXLSX = function(config, callback) {
	xlsx_json({
		input: config.input, 
		output: config.output
	}, function(err, result){
		if(err) {
			callback(err)
		}else {
			callback(null, result)
		}
	});
}

_CV_json.prototype.cvXML = function(config, callback) {
	xml_json({
		input: config.input, 
		output: config.output
	}, function(err, result){
		if(err) {
			callback(err)
		}else {
			callback(null, result)
		}
	});
}
