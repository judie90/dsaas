var express = require('express');
var router = express.Router();
var fs = require('fs');

var ContentNegotiation  = require('./helpers/ContentNegotiation').ContentNegotiation;
var helperCN = new ContentNegotiation();
var commons = require('./helpers/commons').commons;
var helperCommons = new commons();
var namespaces = require('./helpers/commons').namespaces;
var ns = new namespaces();

var SparqlClient = require('sparql-client');


var genericInsert = "INSERT DATA { %%TRIPLES%% }";

var DSO_NS = ns.DSO_NS;
var DCT_NS = ns.DCT_NS;
var XSD_NS = ns.XSD_NS;
var RDFS_NS = ns.RDFS_NS;
var OWL_NS =  ns.OWL_NS;
var FOAF_NS = ns.FOAF_NS;
var DB_NS = ns.DB_NS;
var RDF_NS = ns.RDF_NS;
var DCAT_NS = ns.DCAT_NS;
var SKOS_NS = ns.SKOS_NS;
var SCH_NS = ns.SCH_NS;
var OA_NS = ns.OA_NS;
var DUV_NS = ns.DUV_NS;
var GEONAMES_NS = ns.GEONAMES_NS;
var XSD_NS = ns.XSD_NS;
var LANG_NS = ns.LANG_NS;
var SPAR_NS = ns.SPAR_NS;


/*
 * POST to add demand
 */
router.post('/add', function(req, res) {
  var endpoint = req.db + "/update";

	console.log(req.body);

	var inputData = req.body;
	var insertTriples = "";

  var demandid   = "<"+GLOBAL.payLevelDomain+"/demand/"+ guid() + ">";
  var submitterid   = "<"+GLOBAL.payLevelDomain+"/agent/"+ guid() + ">";

	//create datasetID
	insertTriples += demandid + " a <" + DSO_NS + "DataRequest> . \n";

	//theme
	for(word in inputData['theme']){
		bnKey = "_:"+guid();
		insertTriples += demandid + " <"+DSO_NS+"theme> "+bnKey+" . \n";
		insertTriples += bnKey + " a <"+SKOS_NS+"Concept> . \n";
		insertTriples += bnKey + " <"+SKOS_NS+"prefLabel> \""+inputData['theme'][word]+"\"^^<"+XSD_NS+"string> . \n";
	}

	//keywords
	for(word in inputData['keyword']){
		insertTriples += demandid + " <"+DSO_NS+"keyword> \""+inputData['keyword'][word]+"\"^^<"+XSD_NS+"string> . \n";
	}

	//language
	var tempLang = inputData['language'].toString();
	var lower = tempLang.toLowerCase();
	insertTriples += demandid + " <"+DSO_NS+"language> <"+LANG_NS+lower+"> . \n";


	//license
	if(inputData['license'] != null){
		insertTriples += demandid + " <"+DSO_NS+"license> <"+inputData['license']+"> . \n";
	}

	//nature of content
	for(nature in inputData['natureOfContent'])
  	insertTriples += demandid + " <"+DSO_NS+"requestContent> <"+DSO_NS+inputData['natureOfContent'][nature]+"> . \n";

	//spatial
	if(inputData['spatial'] != null){
		insertTriples += demandid + " <"+DSO_NS+"spatialRange> <"+GEONAMES_NS+inputData['spatial']+"> . \n";
	}

	//temporal
	if(inputData['temporalStart'] != null || inputData['temporalEnd'] != null){
		bnKey = "_:"+guid();
		insertTriples += demandid + " <"+DSO_NS+"temporalRange> "+bnKey+" . \n";
		insertTriples += bnKey + " a <"+DCT_NS+"PeriodOfTime> . \n";

		if(inputData['temporalStart'] != null){
			insertTriples += bnKey + " <"+SCH_NS+"startDate> \""+inputData['temporalStart']+"\"^^<"+XSD_NS+"dateTime> . \n";
		}
		if(inputData['temporalEnd'] != null){
			insertTriples += bnKey + " <"+SCH_NS+"endDate> \""+inputData['temporalEnd']+"\"^^<"+XSD_NS+"dateTime> . \n";
		}
	}

	//motivation
	for(motiv in inputData['demandMotiv']){
		insertTriples += demandid + " <"+DSO_NS+"motivation> \""+inputData['demandMotiv'][motiv]+"\"^^<"+XSD_NS+"string> . \n";
	}

	//media type
	insertTriples += demandid + " <"+DSO_NS+"mediaType> <"+SPAR_NS+inputData['mediaType']+"> . \n";

	//description
	insertTriples += demandid + " <"+DSO_NS+"description> \""+inputData['description']+"\"^^<"+XSD_NS+"string> . \n";

	//Submitter
	//insertTriples += demandid + " <"+DSO_NS+"submitter> \""+inputData['contact']+"\"^^xsd:String . \n";
	insertTriples += demandid + " <"+DSO_NS+"submitter> "+ submitterid + " . \n";
	insertTriples += submitterid + " a <" + FOAF_NS + "Agent> . \n";
	insertTriples += submitterid + " <"+FOAF_NS+"name> \""+inputData['contact']+"\"^^<"+XSD_NS+"string> . \n";

	//Submitter url
	insertTriples += submitterid + " <"+FOAF_NS+"homepage> <"+inputData['submitterUrl']+"> . \n";

  insertStmt = genericInsert.replace("%%TRIPLES%%",insertTriples);
	console.log(insertStmt)

	// insert fuseki
	var client = new SparqlClient(endpoint);

	client.query(insertStmt, function(error, results) {
		if (error != null) console.log("[ERROR] - "+ error);
    res.send(
        (error === null) ? { msg: '' } : { msg:error }
    );
	});
});

router.post('/add/interest', function(req, res) {
  var endpoint = req.db + "/update";

  var inputData = req.body;
  var insertTriples = "";

  var submitterid   = "<"+GLOBAL.payLevelDomain+"/agent/"+ guid() + ">";

  insertTriples += " <"+GLOBAL.payLevelDomain+"/demand/"+inputData['demandId']  + "> <"+DSO_NS+"secondedBy> "+ submitterid+" . \n";
  insertTriples += submitterid + " a <" + FOAF_NS + "Agent> . \n";
  insertTriples += submitterid + " <"+FOAF_NS+"name> \""+inputData['submitter']+"\"^^<"+XSD_NS+"string> . \n";
  insertTriples += submitterid + " <"+FOAF_NS+"homepage> <"+inputData['submitterUrl']+"> . \n";

  insertStmt = genericInsert.replace("%%TRIPLES%%",insertTriples);
  console.log(insertStmt)
  var client = new SparqlClient(endpoint);

  client.query(insertStmt, function(error, results) {
    if (error != null) console.log("[ERROR] - "+ error);
    res.send(
        (error === null) ? { msg: '' } : { msg:error }
    );
  });

});

/* Get All Demands. */
router.get('/all', function(req, res, next) {
  	var endpoint = req.db;

	_getAllDemands(endpoint, function(results,err){
		res.send((err === null) ? results : { msg:error })
    });
});

/* Get All Demands for Exhibit. */
router.get('/exhibit/all', function(req, res, next) {
	  var endpoint = req.db;
		_getAllDemands(endpoint, function(results,err){
			var items = {};
			items['items'] = results;

			for(var i in items['items']){
				var id = items['items'][i]["demandId"];
				items['items'][i]['_id'] = id;
				items['items'][i]['label'] = "";

        if (items['items'][i]['mediaType'] != null)
          items['items'][i]['mediaType'] = items['items'][i]['mediaType'].replace('http://www.sparontologies.net/mediatype/','');

        if (items['items'][i]['spatial'] != null)
          items['items'][i]['spatial'] = helperCommons.getGeoNameFromExternal(items['items'][i]['spatial']);

        items['items'][i]['language'] = helperCommons.getLanguageFromExternal(items['items'][i]['language']);
			}
	   res.send(items);
		})

});

/* Content Negotiation */
router.get('/:resource', function(req, res, next) {
	req.negotiate({
        	'text/html': function() {
            res.redirect(303,'/dsaas/page/demand'+req.url+'.html');
        	},
	        'application/rdf+xml': function() {
            helperCN.getRDFXmlData(GLOBAL.payLevelDomain+"/demand"+req.url, req.db, function(triples){
                res.setHeader('content-type', 'application/rdf+xml');
                res.send(triples);
            });
          },
    			'text/turtle': function(){
            helperCN.getData(GLOBAL.payLevelDomain+"/demand"+req.url, req.db, function(triples){
                res.setHeader('content-type', 'text/turtle');
                res.send(triples);
            });
    			},
    			'application/trig': function(){
            helperCN.getNXData('application/trig', GLOBAL.payLevelDomain+"/demand"+req.url, req.db, function(triples){
              res.setHeader('content-type', 'application/trig');
              res.send(triples);
            });
    			},
    			'application/n-triples': function(){
            helperCN.getNXData('application/n-triples', GLOBAL.payLevelDomain+"/demand"+req.url, req.db, function(triples){
              res.setHeader('content-type', 'application/n-triples');
              res.send(triples);
            });
    			},
    			'application/n-quads': function(){
            helperCN.getNXData('application/n-quads', GLOBAL.payLevelDomain+"/demand"+req.url, req.db, function(triples){
              res.setHeader('content-type', 'application/n-quads');
              res.send(triples);
            });
    			},
    			'text/plain': function(){
            helperCN.getData(GLOBAL.payLevelDomain+"/demand"+req.url, req.db, function(triples){
              res.setHeader('content-type', 'text/plain');
              res.send(triples);
            });
    			},
    			'application/ld+json': function(){
            helperCN.getJsonLDData(GLOBAL.payLevelDomain+"/demand"+req.url, req.db, function(triples){
              res.setHeader('content-type', 'application/ld+json');
              res.send(triples);
            });
    			}
	});
});

_getAllDemands = function(endpoint, callback){
	var client = new SparqlClient(endpoint+"/query?output=json");

  var selectDemand = fs.readFileSync('./queries/getAllDemands.sparql', 'utf8'); //reads the query into a string


	client.query(selectDemand, function(error, results) {
		if (error != null)
			callback(null,error);

		items = [];
		theResults = results['results']['bindings'];

		for(binding in theResults){
			demand = {};
      demand['uri'] = results['results']['bindings'][binding]['demand']['value'];
 			demand['id'] = results['results']['bindings'][binding]['demand']['value'];
 			demand['language'] = results['results']['bindings'][binding]['language']['value'];
			if(results['results']['bindings'][binding]['license'] != null) {
				demand['license'] = results['results']['bindings'][binding]['license']['value'];
			}
      if(results['results']['bindings'][binding]['licenseLabel'] != null) {
        demand['licenseLabel'] = results['results']['bindings'][binding]['licenseLabel']['value'];
      }
			if(results['results']['bindings'][binding]['spatial'] != null) {
				demand['spatial'] = results['results']['bindings'][binding]['spatial']['value'];
			}
			if(results['results']['bindings'][binding]['tstart'] != null) {
				demand['temporalStart'] = results['results']['bindings'][binding]['tstart']['value'];
			}
			if(results['results']['bindings'][binding]['tend'] != null) {
				demand['temporalEnd'] = results['results']['bindings'][binding]['tend']['value'];
			}
			demand['mediaType'] = results['results']['bindings'][binding]['format']['value'];
			demand['description'] = results['results']['bindings'][binding]['desc']['value'];
			demand['theme'] = results['results']['bindings'][binding]['themes']['value'].split(",");
			demand['keyword'] = results['results']['bindings'][binding]['keywords']['value'].split(",");
			if(results['results']['bindings'][binding]['motivations'] != null) {
				demand['demandMotiv'] = results['results']['bindings'][binding]['motivations']['value'].split(",");
			}
			if(results['results']['bindings'][binding]['natureOfContent'] != null) {
				demand['natureOfContent'] = results['results']['bindings'][binding]['natureOfContent']['value'].split(",");
			}
			demand['submitter'] = results['results']['bindings'][binding]['name']['value'];
			demand['submitterUrl'] = results['results']['bindings'][binding]['homepage']['value'];

      demand['interested'] = results['results']['bindings'][binding]['interested']['value'];

			items.push(demand);
		}
		callback(items,error)
	});
}

// Create a UUID
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

module.exports = router;
