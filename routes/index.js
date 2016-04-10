var express = require('express');
var router = express.Router();
var SparqlClient = require('sparql-client');
var async = require('async');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res, next){
	res.render('about');
});

router.get('/addDataset', function(req, res, next){
	res.render('addDataset');
});

router.get('/search', function(req, res, next){
	res.render('search');
});

router.get('/api', function(req, res, next){
	res.render('api');
});

router.get('/contact', function(req, res, next){
	res.render('contact');
});

router.get('/addDemand', function(req, res, next){
	res.render('addDemand');
});

router.get('/searchdemand', function(req, res, next){
	res.render('searchdemand');
});

router.post('/contactres', function(req, res, next){
	res.render('contactres');
});

router.get('/addDistribution', function(req, res, next){
	id = req.query;
	console.log ("Adding distribution to: "+ id['id']);

	if (id['id'] != null){
		endpoint = req.db + "/query?output=json"
		var getTitle = "SELECT ?title { <"+id['id']+"> <http://purl.org/dc/terms/title> ?title . }"
		_queryEndpoint(endpoint, getTitle, function(error,results){
			if (results === null){
				res.render('search')
			} else {
				if (results['results']['bindings'].length == 0){
					res.render('search');
				} else {
					title = results['results']['bindings'][0]['title']['value'];
					res.render('addDistribution',{datasetId: id['id'], datasetTitle: title});
				}
			}
		});
	} else {
		res.render('search')
	}
});

router.get('/addUseCase', function(req, res, next){
	id = req.query;
	console.log ("Adding usecase to: "+ id['id']);

  object = {};
	if (id['id'] != null){
		endpoint = req.db + "/query"

  async.series({
  		dsTitle: function(callback){
  			_getDatasetTitle(endpoint, id['id'], function(err,dsInfores){
  				callback(err, dsInfores)
  			})
  		},
  		distribInfo: function(callback){
  			_getDistributionInfo(endpoint, id['id'], function(err,distribInfoRes){
  				callback(err, distribInfoRes)
  			});
  		}
  },
  	function(err, results) {
      if (results === null){
        res.render('search')
      }

  		object = results['dsTitle'];
  		object['distribution'] = results['distribInfo'];

  		res.render('addUseCase', object);

  	});
	} else {
		res.render('search')
	}
});


_getDatasetTitle = function(endpoint, id, callback){
  var getTitle = "SELECT ?title { <"+id+"> <http://purl.org/dc/terms/title> ?title . }"
  _queryEndpoint(endpoint, getTitle, function(error,results){
    if (results === null){
        callback(error,null)
    } else {
      if (results['results']['bindings'].length == 0){
        callback(error,null)
      } else {
        title = results['results']['bindings'][0]['title']['value'];
        callback(null,{datasetId: id, datasetTitle: title});
      }
    }
  });
}

_getDistributionInfo = function(endpoint, id, callback){
  var getDistributions = "SELECT * { <"+id+"> 	<http://www.w3.org/ns/dcat#distribution> ?distribution .  ?distribution <http://purl.org/dc/terms/title> ?title}"
  distribs = [];
  _queryEndpoint(endpoint, getDistributions, function(error,results){
    if (results === null){
        callback(error,null)
    } else {
      if (results['results']['bindings'].length == 0){
        callback(error,null)
      } else {
        theResults = results['results']['bindings'];

        for(idx in theResults){
            object = {};
            object['distributionURI'] = results['results']['bindings'][idx]['distribution']['value']; //resource uri (not website)
            object['title'] = results['results']['bindings'][idx]['title']['value'];
            distribs.push(object)
        }
        callback(null,distribs);
      }
    }
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
