var express = require('express');
var router = express.Router();

/* Get All Publishers. */
router.get('/all', function(req, res, next) {
    var db = req.db;
    var collection = db.get('publishers');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/*
 * POST to add publisher.
 */
router.post('/add', function(req, res) {
    var db = req.db;
    var collection = db.get('publishers');
	
	console.log(req.body);
	collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* Get All Publishers for Exhibit. */
router.get('/exhibit/all', function(req, res, next) {
    var db = req.db;
    var collection = db.get('publishers');
    collection.find({},{},function(e,docs){
		var items = {};
		items['items'] = docs;
		
		for(var i in items['items']){
			var id = items['items'][i]["_id"];
			items['items'][i]['id'] = id;
			
			var label = items['items'][i]["publisher"];
			items['items'][i]['label'] = label;
		}
		
		items['properties'] = { "knownConsumers" : { "valueType" : "item" }, "consumer" : { "valueType" : "text" } };
        res.json(items);
    });
});

router.get('/exhibit/consumers', function(req, res, next) {
    var db = req.db;
    var collection = db.get('publishers');
    collection.find({},{},function(e,docs){
		var allCons = [];
		for(var pub in docs){
			var cns = docs[pub]["knownConsumers"];
			for(var el in cns){
				consumer = {};
				consumer['consumer'] = cns[el]['consumer'];
				consumer['consumersAim'] = cns[el]['consumersAim'];
				consumer['consumersDescription'] = cns[el]['consumersDescription'];
				allCons.push(consumer);
			}
		}
	
		var items = {};
		items['items'] = allCons;
		res.json(items);
    });
});


/* Find Publisher by ID */
router.get('/id/:idNumber', function(req, res, next) {
    var db = req.db;
    var collection = db.get('publishers');
	var id = req.params.idNumber;
	
	var query = {};
	query["_id"] = id;
	
	console.log(query);
    collection.find(query,{},function(e,docs){
        res.json(docs);
    });
});

/* Find Publisher by Field */
router.get('/:field/:domain', function(req, res, next) {
    var db = req.db;
    var collection = db.get('publishers');
	var field = req.params.field;
	var domain = req.params.domain;
	
	var query = {};
	var regex = new RegExp('^' + domain + '+', 'i');
	query[field] = regex;
	
	console.log(query);
    collection.find(query,{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;