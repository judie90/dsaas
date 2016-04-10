var express = require('express');
var router = express.Router();
var SparqlClient = require('sparql-client');
var async = require('async');
var commons = require('./helpers/commons').commons;
var helperCommons = new commons();
var fs = require("fs")


router.get('/:uri', function(req, res, next){
	var endpoint = req.db + "/query";
	object = {};

	var id = req.params.uri.replace('.html','')
	async.series({
		demandInfo: function(callback){
			_getDemandInformation(id, endpoint, function(demandInfores){
				callback(null, demandInfores)
			})
		},
		secondedBy: function(callback){
			_getSecondedByInformation(id, endpoint, function(seconded){
				callback(null, seconded);
			})
		}
	},
	function(err, results) {
		object = results['demandInfo'];

		if (object['spatial'] != null)
			object['spatialPrefLabel'] = helperCommons.getGeoNameFromExternal(object['spatial']);
		else
			object['spatialPrefLabel'] = "Unknown Country"

		if (object['language'] != null)
			object['languagePrefLabel'] = helperCommons.getLanguageFromExternal(object['language']);
		else
			object['languagePrefLabel'] = "Unknown Language";

		object['secondedBy'] = results['secondedBy'];


		//res.send(object)
		res.render('demandDetails', object);
	});

});


_getDemandInformation = function(id, endpoint, callback){
	var selectAll = fs.readFileSync('./queries/getDemandDetails.sparql', 'utf8'); //reads the query into a string
	selectAll = selectAll.replace(/%%id%%/g, GLOBAL.payLevelDomain+"/demand/"+id);

	demand = {}
	_queryEndpoint(endpoint, selectAll, function(error,results){
		if (results == null) console.log(error)

		demand['demand'] = id;
		demand['language'] = results['results']['bindings'][0]['language']['value'];
		if(results['results']['bindings'][0]['license'] != null) {
			demand['license'] = results['results']['bindings'][0]['license']['value'];
			demand['licenseLabel'] = results['results']['bindings'][0]['licenseLabel']['value'];
			demand['licenseText'] = results['results']['bindings'][0]['licenseText']['value'];
		}

		if(results['results']['bindings'][0]['spatial'] != null) {
			demand['spatial'] = results['results']['bindings'][0]['spatial']['value'];
		}

		if(results['results']['bindings'][0]['tstart'] != null) {
			demand['temporalStart'] = results['results']['bindings'][0]['tstart']['value'];
		}
		if(results['results']['bindings'][0]['tend'] != null) {
			demand['temporalEnd'] = results['results']['bindings'][0]['tend']['value'];
		}

		demand['mediaType'] = results['results']['bindings'][0]['format']['value'];
		demand['description'] = results['results']['bindings'][0]['desc']['value'];
		demand['theme'] = results['results']['bindings'][0]['themes']['value'].split(",");
		demand['keyword'] = results['results']['bindings'][0]['keywords']['value'].split(",");
		if(results['results']['bindings'][0]['motivations'] != null) {
			demand['demandMotiv'] = results['results']['bindings'][0]['motivations']['value'].split(",");
		}

		if(results['results']['bindings'][0]['natureOfContent'] != null) {
			demand['natureOfContent'] = results['results']['bindings'][0]['natureOfContent']['value'].split(",");
		}

		demand['submitter'] = results['results']['bindings'][0]['name']['value'];
		demand['submitterUrl'] = results['results']['bindings'][0]['homepage']['value'];

		callback(demand); // letting the last asynch function finishing before sending
	});
}

_getSecondedByInformation = function(id, endpoint, callback){
	var selectAll = fs.readFileSync('./queries/getSecondedBy.sparql', 'utf8'); //reads the query into a string
	selectAll = selectAll.replace("%%id%%", GLOBAL.payLevelDomain+"/demand/"+id)

	secondedBy = []
	_queryEndpoint(endpoint, selectAll, function(error,results){
		if (results == null) console.log(error)


		for (idx in results['results']['bindings']){
			seconders = {};
			seconders['submitter'] = results['results']['bindings'][idx]['secondedName']['value'];
			seconders['submitterUrl'] = results['results']['bindings'][idx]['secondedURL']['value'];
			secondedBy.push(seconders);
		}
		callback(secondedBy);
	});
}


_queryEndpoint = function(endpoint, query, callback){
	var client = new SparqlClient(endpoint);
	client.query(query, function(error, results) {
		if (error === null) callback(null,results)
		else callback(error,null)
	})
}

module.exports = router;
