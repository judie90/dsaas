var fs = require('fs');


exports.namespaces = function(){
  this.DSO_NS = "https://www.w3id.org/dso#";
  this.DCT_NS = "http://purl.org/dc/terms/";
  this.XSD_NS = "http://www.w3.org/2001/XMLSchema#";
  this.RDFS_NS = "http://www.w3.org/2000/01/rdf-schema#";
  this.OWL_NS = "http://www.w3.org/2002/07/owl#";
  this.FOAF_NS = "http://xmlns.com/foaf/0.1/";
  this.DB_NS = "http://dbpedia.org/ontology/";
  this.RDF_NS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
  this.DCAT_NS = "http://www.w3.org/ns/dcat#";
  this.SKOS_NS = "http://www.w3.org/2008/05/skos#";
  this.SCH_NS = "http://schema.org/";
  this.OA_NS = "http://www.w3.org/ns/oa#";
  this.DUV_NS = "http://www.w3.org/ns/duv#";
  this.GEONAMES_NS = "http://sws.geonames.org/";
  this.LANG_NS = "http://id.loc.gov/vocabulary/iso639-1/";
  this.SPAR_NS = "http://www.sparontologies.net/mediatype/";
  this.XSD_NS = "http://www.w3.org/2001/XMLSchema#";
}

exports.commons = function(){
  this.getLanguageFromExternal = function(languageURI){
    if (languageURI == null){
      return "Unknown Language"
    }

  	language = languageURI.replace("http://id.loc.gov/vocabulary/iso639-1/","");

  	var cnts = JSON.parse(fs.readFileSync('./public/languages.json', 'utf8'));
  	languagePrefLabel = "Unknown Language"
  	for (obj in cnts){
  		if (cnts[obj]["Code"] == language.toUpperCase()){
  			languagePrefLabel = cnts[obj]["Language"];
  			break;
  		}
  	}
  	return languagePrefLabel;
  }

  this.getGeoNameFromExternal = function(spatialURI){
    if (spatialURI == null){
      return "Unknown Country"
    }
		countryCode = spatialURI.replace("http://sws.geonames.org/","");
		var cnts = JSON.parse(fs.readFileSync('./public/countries.json', 'utf8'));
		spatialPrefLabel = "Unknown Country"
		for (obj in cnts){
			if (cnts[obj]["geonameId"] == countryCode){
				spatialPrefLabel = cnts[obj]["countryName"];
				break;
			}
		}
		return spatialPrefLabel;
  }
}
