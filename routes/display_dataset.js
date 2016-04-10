var express = require('express');
var router = express.Router();
var SparqlClient = require('sparql-client');
var async = require('async');
var fs = require("fs")

var commons = require('./helpers/commons').commons;
var helperCommons = new commons();


router.get('/:uri', function(req, res, next){
	var endpoint = req.db + "/query";
	object = {};
	var id = req.params.uri.replace('.html','')
	async.series({
		dsInfo: function(callback){
			_getDatasetInformation(id, endpoint, function(dsInfores){
				callback(null, dsInfores)
			})
		},
		distribInfo: function(callback){
			_getDistributionInformation(id, endpoint, function(distribInfoRes){
				callback(null, distribInfoRes)
			});
		},
		caseInfo: function(callback){
			_getUseCaseInformation(id, endpoint, function(caseInfoRes){
				callback(null, caseInfoRes)
			});
		}
},
	function(err, results) {
		//	{dsInfo: {}, distribInfo: {}}
		object = results['dsInfo'];

		if (object['spatial'] != null)
			object['spatialPrefLabel'] = helperCommons.getGeoNameFromExternal(object['spatial']);
		else
			object['spatialPrefLabel'] = "Unknown Country"

		object['distribution'] = results['distribInfo'];
		object['cases'] = results['caseInfo'];


		if (object['language'] != null)
			object['languagePrefLabel'] = helperCommons.getLanguageFromExternal(object['language'])
		else
			object['languagePrefLabel'] = "Unknown Language";

		res.render('details', object);
	});
});


_getDatasetInformation = function(id, endpoint, callback){
	var selectAll = fs.readFileSync('./queries/getPublisherDetails.sparql', 'utf8'); //reads the query into a string
	selectAll = selectAll.replace(/%%id%%/g, GLOBAL.payLevelDomain+"/dataset/"+id)

	_queryEndpoint(endpoint, selectAll, function(error,results){
		if (results == null) console.log(error)
		object['datasetId'] = id;
		object['title'] = results['results']['bindings'][0]['title']['value'];
		object['landing'] = results['results']['bindings'][0]['landingPage']['value'];
		object['themes'] = results['results']['bindings'][0]['themes']['value'].split(",");
		object['keywords'] = results['results']['bindings'][0]['keywords']['value'].split(",");
		object['pubUri'] = results['results']['bindings'][0]['publisherURL']['value'];
		object['pubName'] = results['results']['bindings'][0]['publisherName']['value'];
		object['language'] = results['results']['bindings'][0]['language']['value'];
		object['licenseLabel'] = results['results']['bindings'][0]['licenseLabel']['value'];
		object['licenseText'] = results['results']['bindings'][0]['licenseText']['value'];
		object['license'] = results['results']['bindings'][0]['license']['value'];
		if (results['results']['bindings'][0]['natureOfContent'] != null) {
			object['natureOfContent'] = results['results']['bindings'][0]['natureOfContent']['value'].split(",");
		}
		if (results['results']['bindings'][0]['dateIssued'] != null) {
			object['dateIssued'] = results['results']['bindings'][0]['dateIssued']['value'];
		}
		if (results['results']['bindings'][0]['dateModified'] != null) {
			object['dateModified'] = results['results']['bindings'][0]['dateModified']['value'];
		}
		if (results['results']['bindings'][0]['spatial'] != null) {
			object['spatial'] = results['results']['bindings'][0]['spatial']['value'];
		}
		if (results['results']['bindings'][0]['tStartDate'] != null) {
			object['tStartDate'] = results['results']['bindings'][0]['tStartDate']['value'];
		}
		if (results['results']['bindings'][0]['tEndDate'] != null) {
			object['tEndDate'] = results['results']['bindings'][0]['tEndDate']['value'];
		}
		object['desc'] = results['results']['bindings'][0]['datasetDescription']['value'];

		callback(object); // letting the last asynch function finishing before sending
	});
}

_getDistributionInformation = function(id, endpoint, callback){
	var distribution = fs.readFileSync('./queries/getDistributionsForDataset.sparql', 'utf8'); //reads the query into a string
	distribution = distribution.replace("%%id%%", GLOBAL.payLevelDomain+"/dataset/"+id)

	distribs = [];
	_queryEndpoint(endpoint, distribution, function(error,results){
		theResults = results['results']['bindings'];

		if (results['results']['bindings'].length > 0){
			console.log(results['results']['bindings'].length);
			for(idx in theResults){
					object = {};

					object['distributionURI'] = results['results']['bindings'][idx]['distributionURI']['value']; //resource uri (not website)
					object['distribTitle'] = results['results']['bindings'][idx]['title']['value'];
					if(results['results']['bindings'][idx]['modified'] != null){
						object['modified'] = results['results']['bindings'][idx]['modified']['value'];
					}
					object['mediaType'] = results['results']['bindings'][idx]['mediaType']['value'];
					object['accessURL'] = results['results']['bindings'][idx]['accessURL']['value'];
					if(results['results']['bindings'][idx]['downloadURL'] != null) {
						object['downloadURL'] = results['results']['bindings'][idx]['downloadURL']['value'];
					}
					if(results['results']['bindings'][idx]['distributorName'] != null) {
						object['distributorName'] = results['results']['bindings'][idx]['distributorName']['value'];
					}
					if(results['results']['bindings'][idx]['distributorHomePage'] != null) {
						object['distributorHomePage'] = results['results']['bindings'][idx]['distributorHomePage']['value'];
					}

					distribs.push(object)
			}
		}

		callback(distribs);
	});

}

_getUseCaseInformation = function(id, endpoint, callback){

	var usecase = fs.readFileSync('./queries/getUsecasesForDataset.sparql', 'utf8'); //reads the query into a string
	usecase = usecase.replace("%%id%%", GLOBAL.payLevelDomain+"/dataset/"+id)

	cases = [];
	_queryEndpoint(endpoint, usecase, function(error,results){
		theResultsUC = results['results']['bindings'];

		if (results['results']['bindings'][0]['title'] != null){
			for(idx in theResultsUC){
					object = {};

					object['caseTitle'] = results['results']['bindings'][idx]['title']['value'];
					object['useCase'] = results['results']['bindings'][idx]['useCase']['value']; //resource uri (not website)
					object['useCaseURL'] = results['results']['bindings'][idx]['useCaseURL']['value'];
					if(results['results']['bindings'][idx]['motivations'] != null) {
						object['motivation'] = results['results']['bindings'][idx]['motivations']['value'];
					}
					object['useCaseDesc'] = results['results']['bindings'][idx]['useCaseDesc']['value'];
					if(results['results']['bindings'][idx]['generatorName'] != null) {
						object['generatorName'] = results['results']['bindings'][idx]['generatorName']['value'];
					}
					object['generatorHomePage'] = results['results']['bindings'][idx]['generatorHomePage']['value'];
					object['distributionUsed'] = results['results']['bindings'][idx]['distribution']['value'];


					cases.push(object)
			}
		}
		callback(cases);
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
