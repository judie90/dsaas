var express = require('express');
var router = express.Router();
var SparqlClient = require('sparql-client');
var fs = require('fs');

var ContentNegotiation  = require('./helpers/ContentNegotiation').ContentNegotiation;
var helperCN = new ContentNegotiation();

var commons = require('./helpers/commons').commons;
var helperCommons = new commons();

var namespaces = require('./helpers/commons').namespaces;
var ns = new namespaces();


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
 * POST to add dataset (including distributions and use cases).
 */
router.post('/add/dataset', function(req, res) {
  var endpoint = req.db + "/update";

	console.log(req.body);

	var inputData = req.body;
	var insertTriples = "";

	var datasetid   = "<"+GLOBAL.payLevelDomain+"/dataset/"+ guid() + ">";
	var publisherid = "<"+GLOBAL.payLevelDomain+"/agent/"+ guid() + ">";

	//create datasetID
	insertTriples += datasetid + " a <" + DCAT_NS + "Dataset> . \n";

	//title
	insertTriples += datasetid + " <"+DCT_NS+"title> \""+inputData['title']+"\"^^<"+XSD_NS+"string> . \n";

	//landing page
	insertTriples += datasetid + " <"+DCAT_NS+"landingPage> <"+inputData['landingPage']+"> . \n";

	//theme
	for(word in inputData['theme']){
		bnKey = "_:"+guid();
		insertTriples += datasetid + " <"+DCAT_NS+"theme> "+bnKey+" . \n";
		insertTriples += bnKey + " a <"+SKOS_NS+"Concept> . \n";
		insertTriples += bnKey + " <"+SKOS_NS+"prefLabel> \""+inputData['theme'][word]+"\"^^<"+XSD_NS+"string> . \n";
	}

	//keywords
	for(word in inputData['keyword']){
		insertTriples += datasetid + " <"+DCAT_NS+"keyword> \""+inputData['keyword'][word]+"\"^^<"+XSD_NS+"string> . \n";
	}

	//publisher
	insertTriples += datasetid + " <"+DCT_NS+"publisher> "+ publisherid + " . \n";
	insertTriples += publisherid + " a <" + DCT_NS + "Publisher> . \n";
	insertTriples += publisherid + " <"+FOAF_NS+"name> \""+inputData['publisher']+"\"^^<"+XSD_NS+"string> . \n";

	//publisher url
	insertTriples += publisherid + " <"+FOAF_NS+"homepage> <"+inputData['publisherUrl']+"> . \n";

	//language
	var tempLang = inputData['language'].toString();
	var lower = tempLang.toLowerCase();
	insertTriples += datasetid + " <"+DCT_NS+"language> <"+LANG_NS+lower+"> . \n";

	//license
	insertTriples += datasetid + " <"+DCT_NS+"license> <"+inputData['license']+"> . \n";

	//nature of content
	for(nature in inputData['natureOfContent'])
  	insertTriples += datasetid + " <"+DSO_NS+"content> <"+DSO_NS+inputData['natureOfContent'][nature]+"> . \n";

	//date issued
	if(inputData['dateIssued'] != null){
		insertTriples += datasetid + " <"+DCT_NS+"issued> \""+inputData['dateIssued']+"\"^^<"+XSD_NS+"dateTime> . \n";
	}

	//date modified
	if(inputData['dateModified'] != null){
			insertTriples += datasetid + " <"+DCT_NS+"modified> \""+inputData['dateModified']+"\"^^<"+XSD_NS+"dateTime> . \n";
	}

	//spatial
	if(inputData['spatial'] != null){
		insertTriples += datasetid + " <"+DCT_NS+"spatial> <"+GEONAMES_NS+inputData['spatial']+"> . \n";
	}

	//temporal
	if(inputData['temporalStart'] != null || inputData['temporalEnd'] != null){
		bnKey = "_:"+guid();
		insertTriples += datasetid + " <"+DCT_NS+"temporal> "+bnKey+" . \n";
		insertTriples += bnKey + " a <"+DCT_NS+"PeriodOfTime> . \n";

		if(inputData['temporalStart'] != null){
			insertTriples += bnKey + " <"+SCH_NS+"startDate> \""+inputData['temporalStart']+"\"^^<"+XSD_NS+"dateTime> . \n";
		}
		if(inputData['temporalEnd'] != null){
			insertTriples += bnKey + " <"+SCH_NS+"endDate> \""+inputData['temporalEnd']+"\"^^<"+XSD_NS+"dateTime> . \n";
		}
	}

	//description
	insertTriples += datasetid + " <"+DCT_NS+"description> \""+inputData['description'].replace(/\n/g,"\\n")+"\"^^<"+XSD_NS+"string> . \n";

	var useCaseDistributions = [];

	//use case data
	for(usecase in inputData['useCases']){
		var useCaseInstance = {};

    var generatorid   = "<"+GLOBAL.payLevelDomain+"/agent/"+ guid() + ">";
    var usecaseid = "<"+GLOBAL.payLevelDomain+"/usecase/"+ guid() + ">";

		insertTriples += usecaseid + " <"+DSO_NS+"usesDataset> "+datasetid+" . \n";
		insertTriples += usecaseid + " a <" + DSO_NS + "UseCase> . \n";

    insertTriples += usecaseid + " <"+DCT_NS+"title> \""+inputData['useCases'][usecase]['caseTitle']+"\"^^<"+XSD_NS+"string> . \n";


		//generator
		insertTriples += usecaseid + " <"+DSO_NS+"generator> "+ generatorid + " . \n";
		insertTriples += generatorid + " a <" + DCT_NS + "Consumer> . \n";

		if(inputData['useCases'][usecase]['generator'] != null){
			insertTriples += generatorid + " <"+FOAF_NS+"name> \""+inputData['useCases'][usecase]['generator']+"\"^^<"+XSD_NS+"string> . \n";
		}

		//generator url
		insertTriples += generatorid + " <"+FOAF_NS+"homepage> <"+inputData['useCases'][usecase]['generatorUrl']+"> . \n";

		//distribution (triple added in distribution section)
		useCaseInstance['caseid'] = usecaseid;
		useCaseInstance['distribTitle'] = inputData['useCases'][usecase]['distribution'];
		useCaseDistributions.push(useCaseInstance);

		//motivation
		for(motiv in inputData['useCases'][usecase]['useCaseMotiv']){
			insertTriples += usecaseid + " <"+DSO_NS+"useCaseMotivation> \""+inputData['useCases'][usecase]['useCaseMotiv'][motiv]+"\"^^<"+XSD_NS+"string> . \n";

		}

		//use case url
		insertTriples += usecaseid + " <"+DSO_NS+"useCaseURL> <"+inputData['useCases'][usecase]['useCaseUrl']+"> . \n";

		//description
		insertTriples += usecaseid + " <"+DSO_NS+"useCaseDescription> \""+inputData['useCases'][usecase]['description']+"\"^^<"+XSD_NS+"string> . \n";

	}

	//distribution data
	for(distribution in inputData['distributions']){
    var distributionid   = "<"+GLOBAL.payLevelDomain+"/distribution/"+ guid() + ">";
    var distributorid = "<"+GLOBAL.payLevelDomain+"/agent/"+ guid() + ">";

		insertTriples += distributionid + " a <" + DCAT_NS + "Distribution> . \n";
		insertTriples += datasetid + " <"+DCAT_NS+"distribution> "+distributionid+" . \n";

		//title
		insertTriples += distributionid + " <"+DCT_NS+"title> \""+inputData['distributions'][distribution]['distribTitle']+"\"^^<"+XSD_NS+"string> . \n";

		// //feedback **CREATE BLANK NODE****
		// insertTriples += distributionid + "<"+DUV_NS+"hasDistributionFeedback> "+/*blank node*/ +" . \n";
		// insertTriples += /*BLANK TRIPLE*/ + " a <" + DUV_NS + "USERFEEDBACK> . \n";
		// insertTriples += /*BLANK TRIPLE*/  + "<"+OA_NS+"hasBody> \""+inputData['temporalStart']+"\" . \n";

		//media type
		insertTriples += distributionid + " <"+DCAT_NS+"mediaType> <"+SPAR_NS+inputData['distributions'][distribution]['mediaType']+"> . \n";

		//access URL
		insertTriples += distributionid + " <"+DCAT_NS+"accessURL> <"+inputData['distributions'][distribution]['accessURL']+"> . \n";

		//download URL
		if(inputData['distributions'][distribution]['downloadURL'] != null){
			insertTriples += distributionid + " <"+DCAT_NS+"downloadURL> <"+inputData['distributions'][distribution]['downloadURL']+"> . \n";
		}

		//date modified
		if(inputData['distributions'][distribution]['dateModifiedDistrib'] != null){
			insertTriples += distributionid + " <"+DCT_NS+"modified> \""+inputData['distributions'][distribution]['dateModifiedDistrib']+"\"^^<"+XSD_NS+"dateTime> . \n";
		}

		//distributor
		if((inputData['distributions'][distribution]['distributor']) != null ||(inputData['distributions'][distribution]['distributorURL']) != null){
			insertTriples += distributionid + " <"+DSO_NS+"distributor> "+ distributorid + " . \n";
			insertTriples += distributorid + " a <" + DSO_NS + "Distributor> . \n";
			//distributor name
			if (inputData['distributions'][distribution]['distributor'] != null){
				insertTriples += distributorid + " <"+FOAF_NS+"name> \""+inputData['distributions'][distribution]['distributor']+"\"^^<"+XSD_NS+"string> . \n";
			}
			//distributor url
			if(inputData['distributions'][distribution]['distributorURL'] != null) {
				insertTriples += distributorid + " <"+FOAF_NS+"homepage> <"+inputData['distributions'][distribution]['distributorURL']+"> . \n";
			}
		}

		//adding triple for distribution used in use case
		for(instance in useCaseDistributions){
			distributionTitle = useCaseDistributions[instance]['distribTitle'];
			console.log(distributionTitle)

			if (distributionTitle == inputData['distributions'][distribution]['distribTitle']){
				caseid = useCaseDistributions[instance]['caseid'];
				insertTriples += caseid + " <"+DSO_NS+"usesDistribution> "+distributionid+" . \n";

			}
		}

	}

  insertStmt = genericInsert.replace("%%TRIPLES%%",insertTriples);
	console.log(insertStmt);


	//saving to fuseki
	var client = new SparqlClient(endpoint);

	client.query(insertStmt, function(error, results) {
		if (error != null) console.log("[ERROR] - "+ error);
    res.send(
        (error === null) ? { msg: '' } : { msg:error }
    );
	});


});

/*
 * POST to add Distribution
 */
router.post('/add/distribution', function(req, res) {
 	var endpoint = req.db + "/update";

	console.log(req.body);

	var inputData = req.body;
	var insertTriples = "";

	var datasetid = "<" + inputData['datasetID'] + ">";

  var distributionid   = "<"+GLOBAL.payLevelDomain+"/distribution/"+ guid() + ">";
	var distributorid = "<"+GLOBAL.payLevelDomain+"/agent/"+ guid() + ">";

	insertTriples += datasetid + " <"+DCAT_NS+"distribution> "+distributionid+" . \n";
	insertTriples += distributionid + " a <" + DCAT_NS + "Distribution> . \n";

	//title
	insertTriples += distributionid + " <"+DCT_NS+"title> \""+inputData['distribTitle']+"\"^^<"+XSD_NS+"string> . \n";


	// //feedback **CREATE BLANK NODE****
	// insertTriples += distributionid + "<"+DUV_NS+"hasDistributionFeedback> "+/*blank node*/ +" . \n";
	// insertTriples += /*BLANK TRIPLE*/ + " a <" + DUV_NS + "USERFEEDBACK> . \n";
	// insertTriples += /*BLANK TRIPLE*/  + "<"+OA_NS+"hasBody> \""+inputData['temporalStart']+"\" . \n";

	//media type
	insertTriples += distributionid + " <"+DCAT_NS+"mediaType> <"+SPAR_NS+inputData['mediaType']+"> . \n";

	//access URL
	insertTriples += distributionid + " <"+DCAT_NS+"accessURL> <"+inputData['accessURL']+"> . \n";

	//download URL
	if(inputData['downloadURL'] != null){
		insertTriples += distributionid + " <"+DCAT_NS+"downloadURL> <"+inputData['downloadURL']+"> . \n";
	}

	//date modified
	if(inputData['dateModifiedDistrib'] != null){
		insertTriples += distributionid + " <"+DCT_NS+"modified> \""+inputData['dateModifiedDistrib']+"\"^^<"+XSD_NS+"dateTime> . \n";
	}

	//distributor
	if(inputData['distributor'] != null || inputData['distributorURL'] != null){
		insertTriples += distributionid + " <"+DSO_NS+"distributor> "+ distributorid + " . \n";
		insertTriples += distributorid + " a <" + DSO_NS + "Distributor> . \n";


		//distributor name
		if (inputData['distributor'] != null){
			insertTriples += distributorid + " <"+FOAF_NS+"name> \""+inputData['distributor']+"\"^^<"+XSD_NS+"string> . \n";
		}
		//distributor url
		if(inputData['distributorURL'] != null) {
			insertTriples += distributorid + " <"+FOAF_NS+"homepage> <"+inputData['distributorURL']+"> . \n";
		}

	}

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

	//TODO validation
	// collection.insert(req.body, function(err, result){
	//         res.send(
	//             (err === null) ? { msg: '' } : { msg: err }
	//         );
	//     });
});

/*
 * POST to add Use Case
 */
router.post('/add/usecase', function(req, res) {
 	var endpoint = req.db + "/update";

	console.log(req.body);

	var inputData = req.body;
	var insertTriples = "";

	var datasetid = "<" + inputData['datasetID'] + ">";

  var generatorid   = "<"+GLOBAL.payLevelDomain+"/agent/"+ guid() + ">";
  var usecaseid = "<"+GLOBAL.payLevelDomain+"/usecase/"+ guid() + ">";


	insertTriples += usecaseid + " <"+DSO_NS+"usesDataset> "+datasetid+" . \n";
	insertTriples += usecaseid + " a <" + DSO_NS + "UseCase> . \n";

	//distribution id
	insertTriples += usecaseid + " <"+DSO_NS+"usesDistribution> <"+inputData['distribution']+"> . \n";


	//title
	insertTriples += usecaseid + " <"+DCT_NS+"title> \""+inputData['caseTitle']+"\"^^<"+XSD_NS+"string> . \n";

	//generator
	insertTriples += usecaseid + " <"+DSO_NS+"generator> "+ generatorid + " . \n";
	insertTriples += generatorid + " a <" + DSO_NS + "Consumer> . \n";

	if(inputData['generator'] != null){
		insertTriples += generatorid + " <"+FOAF_NS+"name> \""+inputData['generator']+"\"^^<"+XSD_NS+"string> . \n";
	}
	//generator url
	insertTriples += generatorid + " <"+FOAF_NS+"homepage> <"+inputData['generatorUrl']+"> . \n";

	//distribution
	insertTriples += usecaseid + " <"+DSO_NS+"usesDistribution> <"+inputData['distribution']+"> . \n";

	//motivation
	for(motiv in inputData['useCaseMotiv'])
		insertTriples += usecaseid + " <"+DSO_NS+"useCaseMotivation> \""+inputData['useCaseMotiv'][motiv]+"\"^^<"+XSD_NS+"string> . \n";

	//use case url
	insertTriples += usecaseid + " <"+DSO_NS+"useCaseURL> <"+inputData['useCaseUrl']+"> . \n";

	//description
	insertTriples += usecaseid + " <"+DSO_NS+"useCaseDescription> \""+inputData['description']+"\"^^<"+XSD_NS+"string> . \n";

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


/* Get All Publishers. */
router.get('/all', function(req, res, next) {
    var endpoint = req.db;

	_getAllPublishers(endpoint, function(results,err){
		res.send((err === null) ? results : { msg:error })
	})
});


/* Get All Publishers for Exhibit. */
router.get('/exhibit/all', function(req, res, next) {
	  var endpoint = req.db;
		_getAllPublishers(endpoint, function(results,err){
			var items = {};
			items['items'] = results;

			for(var i in items['items']){
				var id = items['items'][i]["id"];
				items['items'][i]['_id'] = id;

        if (items['items'][i]['access'] != null)
          items['items'][i]['access'] = items['items'][i]['access'].replace('http://www.sparontologies.net/mediatype/','');

        if (items['items'][i]['spatial'] != null)
          items['items'][i]['spatial'] = helperCommons.getGeoNameFromExternal(items['items'][i]['spatial']);

        items['items'][i]['language'] = helperCommons.getLanguageFromExternal(items['items'][i]['language']);

				var label = items['items'][i]["title"];
				items['items'][i]['label'] = label;
			}

	   res.send(items);
		})
});

router.get('/:resource', function(req, res, next) {
	req.negotiate({
        	'text/html': function() {
	            res.redirect(303,'/dsaas/page/dataset'+req.url+'.html');
        	},
	        'application/rdf+xml': function() {
            helperCN.getRDFXmlData(GLOBAL.payLevelDomain+"/dataset"+req.url, req.db, function(triples){
                res.setHeader('content-type', 'application/rdf+xml');
                res.send(triples);
            });
          },
    			'text/turtle': function(){
            helperCN.getData(GLOBAL.payLevelDomain+"/dataset"+req.url, req.db, function(triples){
                res.setHeader('content-type', 'text/turtle');
                res.send(triples);
            });
    			},
    			'application/trig': function(){
            helperCN.getNXData('application/trig', GLOBAL.payLevelDomain+"/dataset"+req.url, req.db, function(triples){
              res.setHeader('content-type', 'application/trig');
              res.send(triples);
            });
    			},
    			'application/n-triples': function(){
            helperCN.getNXData('application/n-triples', GLOBAL.payLevelDomain+"/dataset"+req.url, req.db, function(triples){
              res.setHeader('content-type', 'application/n-triples');
              res.send(triples);
            });
    			},
    			'application/n-quads': function(){
            helperCN.getNXData('application/n-quads', GLOBAL.payLevelDomain+"/dataset"+req.url, req.db, function(triples){
              res.setHeader('content-type', 'application/n-quads');
              res.send(triples);
            });
    			},
    			'text/plain': function(){
            helperCN.getData(GLOBAL.payLevelDomain+"/dataset"+req.url, req.db, function(triples){
              res.setHeader('content-type', 'text/plain');
              res.send(triples);
            });
    			},
    			'application/ld+json': function(){
            helperCN.getJsonLDData(GLOBAL.payLevelDomain+"/dataset"+req.url, req.db, function(triples){
              res.setHeader('content-type', 'application/ld+json');
              res.send(triples);
            });
    			}
	});
});


/********************/
/* HELPER FUNCTIONS */
/********************/

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

_getAllPublishers = function(endpoint, callback){
	var client = new SparqlClient(endpoint+"/query?output=json");

		var selectAll = fs.readFileSync('./queries/getAllPublishersDetails.sparql', 'utf8'); //reads the query into a string

		client.query(selectAll, function(error, results) {
		if (error != null)
			callback(null,error);

		items = [];
		theResults = results['results']['bindings'];

		for(binding in theResults){
			pub = {};
      pub['uri'] = results['results']['bindings'][binding]['dataset']['value'];
			pub['id'] = results['results']['bindings'][binding]['dataset']['value'];
			pub['title'] = results['results']['bindings'][binding]['title']['value'];
			pub['landingPage'] = results['results']['bindings'][binding]['landingPage']['value'];
			pub['themes'] = results['results']['bindings'][binding]['themes']['value'].split(",");
			pub['keywords'] = results['results']['bindings'][binding]['keywords']['value'].split(",");
			pub['publisherURI'] = results['results']['bindings'][binding]['publisherURL']['value'];
			pub['language'] = results['results']['bindings'][binding]['language']['value'];
      pub['license'] = results['results']['bindings'][binding]['license']['value'];
			pub['licenseLabel'] = results['results']['bindings'][binding]['licenseLabel']['value'];

      if (results['results']['bindings'][binding]['natureOfContent'] != null) {
				pub['natureOfContent'] = results['results']['bindings'][binding]['natureOfContent']['value'].split(",");
			}

			if(results['results']['bindings'][binding]['dateIssued'] != null) {
				pub['dateIssued'] = results['results']['bindings'][binding]['dateIssued']['value'];
			}

      if(results['results']['bindings'][binding]['dateModified'] != null) {
				pub['dateModified'] = results['results']['bindings'][binding]['dateModified']['value'];
			}

			if(results['results']['bindings'][binding]['spatial'] != null) {
				pub['spatial'] = results['results']['bindings'][binding]['spatial']['value'];
			}

			if(results['results']['bindings'][binding]['tStartDate'] != null) {
				pub['tStartDate'] = results['results']['bindings'][binding]['tStartDate']['value'];
			}

			if(results['results']['bindings'][binding]['tEndDate'] != null) {
				pub['tEndDate'] = results['results']['bindings'][binding]['tEndDate']['value'];
			}

			pub['datasetDescription'] = results['results']['bindings'][binding]['datasetDescription']['value'];
			pub['publisherName'] = results['results']['bindings'][binding]['publisherName']['value'];
			if(results['results']['bindings'][binding]['accessMethod'] != null) {
				pub['access'] = results['results']['bindings'][binding]['accessMethod']['value'];
			}

			items.push(pub);
		}
		callback(items,error)
	});
}








module.exports = router;
