function addPublisher(event){
	
	//TODO: validation
	addPublisher = {};
	addPublisher['publisher'] = $('#formAddPub input#txtPubName').val();
	addPublisher['uri'] = $('#formAddPub input#txtPubURL').val();
	addPublisher['domain'] = clean($('#formAddPub input#hidPubDomain').text());
	addPublisher['natureOfContent'] = clean($('#formAddPub input#hidPubContent').text());
	addPublisher['apiFormat'] = clean($('#formAddPub input#hidPubAPI').text());
	addPublisher['licence'] = $('#formAddPub input#txtPubLicence').val();
	
	
	knownConsumers = [];
	$.each(consumers, function(k, e){
		c = {};
		c['consumer'] = e['consumer'];
		c['consumersAim'] = e['consumersAim'];
		c['consumersDescription'] = e['consumersDescription'] ;

		knownConsumers.push(c);
	});
	addPublisher['knownConsumers'] = knownConsumers;
	
	console.log(addPublisher);
	
	
    //Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: JSON.stringify(addPublisher),
        url: '/publisher/add',
        dataType: 'JSON',
		contentType: "application/json",
		traditional: true
    }).done(function( response ) {
        // Check for successful (blank) response
		alert("Thank you for your contribution.");
		location.href = 'search';
        if (response.msg === '') {

        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });

	consumers=[];
}

var consumers = [];
function addConsumer(name, aim, description){
	consumer = {
		consumer : name ,
		consumersAim : clean(aim) ,
		consumersDescription : description
	};
	consumers.push(consumer);
}

function clean(array){
	var splitArray = array.split(",");
	var cleanedArray = [];
	$.each(splitArray, function(k,e){
		a = e.trim();
		if (a != "") cleanedArray.push(a);
	});
	return cleanedArray;
}

function getConsByPubId(id){
    $.ajax({
        type: 'GET',
        url: 'publisher/id/'+id,
        dataType: 'JSON',
		contentType: "application/json",
		traditional: true
    }).done(function( response ) {
		var allCons = [];
		for(var pub in response){
			var cns = response[pub]["knownConsumers"];
			for(var el in cns){
				consumer = {};
				consumer['consumer'] = cns[el]['consumer'];
				consumer['consumersAim'] = cns[el]['consumersAim'];
				consumer['consumersDescription'] = cns[el]['consumersDescription'];
				allCons.push(consumer);
			}
		}
		return allCons;
	});
}

function prepareLens(elmt) {
	var itemID = elmt.getAttribute("ex:itemID");
	$.ajax({
	        type: 'GET',
	        url: 'publisher/id/'+itemID,
	        dataType: 'JSON',
			contentType: "application/json",
			traditional: true
	}).done(function( response ) {
			for(var pub in response){
				var cns = response[pub]["knownConsumers"];
				for(var el in cns){
					$('div[ex\\:itemid="'+itemID+'"] > span.spnCons').html(cns[el]['consumer']);
					$('div[ex\\:itemid="'+itemID+'"] > span.spnAim').html(cns[el]['consumersAim']);
					$('div[ex\\:itemid="'+itemID+'"] > span.spnStory').html(cns[el]['consumersDescription']);
					// consumer['consumersAim'] = cns[el]['consumersAim'];
					// consumer['consumersDescription'] = cns[el]['consumersDescription'];
					// allCons.push(consumer);
				}
			}
    });
}

function addNewDemand(event){
	//TODO validation
	
	addDemand = {};
	addDemand['domain'] = $('#formAddPub input#txtDomain').val();
	addDemand['natureOfContent'] = clean($('#formAddPub input#hidDemandContent').text());
	addDemand['aim'] = clean($('#formAddPub input#hidAimContent').text());
	addDemand['description'] = $('#formAddPub input#txtConDesc').val();

    $.ajax({
        type: 'POST',
        data: JSON.stringify(addDemand),
        url: '/demand/add',
        dataType: 'JSON',
		contentType: "application/json",
		traditional: true
    }).done(function( response ) {
        // Check for successful (blank) response
		alert("Thank you for your contribution.");
		location.href = 'searchdemand';
        if (response.msg === '') {

        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
}