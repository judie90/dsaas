/*

var express = require('express');
var router = express.Router();
var fs = require('fs');

var ContentNegotiation  = require('./helpers/ContentNegotiation').ContentNegotiation;
var helperCN = new ContentNegotiation();
var commons = require('./helpers/commons').commons;
var helperCommons = new commons();


var SparqlClient = require('sparql-client');






var DSO_NS = "http://example.org/dso#"; // *****CHANGE NS ACCORDINGLY*****
var DCT_NS = "http://purl.org/dc/terms/";
var XSD_NS = "http://www.w3.org/2001/XMLSchema#";
var RDFS_NS = "http://www.w3.org/2000/01/rdf-schema#";
var OWL_NS = "http://www.w3.org/2002/07/owl#";
var FOAF_NS = "http://xmlns.com/foaf/0.1/";
var DB_NS = "http://dbpedia.org/ontology/";
var RDF_NS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
var DCAT_NS = "http://www.w3.org/ns/dcat#";
var SKOS_NS = "http://www.w3.org/2008/05/skos#";
var SCH_NS = "http://schema.org/";
var OA_NS = "http://www.w3.org/ns/oa#";
var DUV_NS = "http://www.w3.org/ns/duv#";
var GEONAMES_NS = "http://sws.geonames.org/";
var LANG_NS = "http://id.loc.gov/vocabulary/iso639-1/";
var SPAR_NS = "http://www.sparontologies.net/mediatype/";
var XSD_NS = "http://www.w3.org/2001/XMLSchema#";


// POST to match request to existing datasets
router.post('/', function(req, res) {
//get data
	//get query using data
	//return results
	
	var inputData = req.body;
	
	var title = inputData['title'];
	var keywords=[];
	var domains=[];
	
	for(domain in inputData['theme']){
		domains.push(inputData['theme'][domain]);	
	}
	
	for(key in inputData['keyword']){
		keywords.push(inputData['keyword'][key]);	
	}
	
	var query = fs.readFileSync('./queries/getRecommendation.sparql', 'utf8'); //reads the query into a string
	
  query = genericInsert.replace("%%TRIPLES%%",insertTriples);
	
	
	//for each domain in demand, compare to each domain in each dataset
	
	
	//for each domain in demand
		//for each dataset
			//for each domain in dataset
				//compare
				//if matched count+=1
	
	
	//for each keyword in demand, compare to each keyword in each dataset
	
	
	//for each keyword in demand
		//for each dataset
			//for each keyword in dataset
				//compare
				//if matched count+=1

		//similarity = 
	
	
	

});

*/