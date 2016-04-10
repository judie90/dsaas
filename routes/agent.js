var express = require('express');
var router = express.Router();

var ContentNegotiation  = require('./helpers/ContentNegotiation').ContentNegotiation;
var helperCN = new ContentNegotiation();

/* Content Negotiation */
router.get('/:resource', function(req, res, next) {
	req.negotiate({
        	'text/html': function() {
            res.redirect(303,'/page/demand'+req.url+'.html');
        	},
	        'application/rdf+xml': function() {
            helperCN.getRDFXmlData(req.url.replace('/',''), req.db, function(triples){
                res.setHeader('content-type', 'application/rdf+xml');
                res.send(triples);
            });
          },
    			'text/turtle': function(){
            helperCN.getData(req.url.replace('/',''), req.db, function(triples){
                res.setHeader('content-type', 'text/turtle');
                res.send(triples);
            });
    			},
    			'application/trig': function(){
            helperCN.getNXData('application/trig', req.url.replace('/',''), req.db, function(triples){
              res.setHeader('content-type', 'application/trig');
              res.send(triples);
            });
    			},
    			'application/n-triples': function(){
            helperCN.getNXData('application/n-triples', req.url.replace('/',''), req.db, function(triples){
              res.setHeader('content-type', 'application/n-triples');
              res.send(triples);
            });
    			},
    			'application/n-quads': function(){
            helperCN.getNXData('application/n-quads', req.url.replace('/',''), req.db, function(triples){
              res.setHeader('content-type', 'application/n-quads');
              res.send(triples);
            });
    			},
    			'text/plain': function(){
            helperCN.getData(req.url.replace('/',''), req.db, function(triples){
              res.setHeader('content-type', 'text/plain');
              res.send(triples);
            });
    			},
    			'application/ld+json': function(){
            helperCN.getJsonLDData(req.url.replace('/',''), req.db, function(triples){
              res.setHeader('content-type', 'application/ld+json');
              res.send(triples);
            });
    			}
	});
});
