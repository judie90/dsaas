var N3 = require('n3');
var rdflib = require('rdflib');
var jsonld = require('jsonld');

var SparqlClient = require('sparql-client');


exports.ContentNegotiation = function() {
  this.getData = function(resource, endpoint, callback){
    var client = new SparqlClient(endpoint+"/query?output=text");
    var query = "CONSTRUCT { <%%id%%> ?p ?o . ?o ?x ?y} WHERE { <%%id%%> ?p ?o .OPTIONAL { ?o ?x ?y . } }";
    query = query.replace(/%%id%%/g, resource)

    client.query(query, function(error, results) {
      if (results == null) console.log(error)
      callback(results)
    });
  }

  this.getNXData = function(format,resource,endpoint,callback){
  	var parser = N3.Parser({ format: 'Turtle' });
  	var writer = N3.Writer({ format: format});

    this.getData(resource,endpoint,function(triples){
      parser.parse(triples, function (error, triple, prefixes){
  			if (triple){
  				writer.addTriple(triple);
  			}
  			else {
  				writer.end(function (error, result) {
  					callback(result);
  				});
  			}
  		});
    })
  }

  this.getJsonLDData = function(resource, endpoint, callback){
  	this.getNXData("application/n-quads",resource, endpoint, function(triples){
  		jsonld.fromRDF(triples, {format: 'application/nquads'}, function(err, doc) {
        console.log(err);
  		});
  	});
  };

  this.getRDFXmlData = function(resource, endpoint, callback){
  	source = 'text/turtle';
  	target = 'application/rdf+xml'

  	graph = new rdflib.IndexedFormula();
  	this.getData(resource,endpoint, function(triples){
  		srcData = rdflib.parse(triples,graph,GLOBAL.payLevelDomain,source);
  		targetData = rdflib.serialize(srcData, graph, GLOBAL.payLevelDomain, target);
  		callback(targetData);
  	});
  };
};
