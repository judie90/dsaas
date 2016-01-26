function validatePublisher(event){
	
	save = true;
	urlcorrect = true;
	
	if ($('#formAddPub input#txtPubName').val() == null || $('#formAddPub input#txtPubName').val() =="") {
		save = false;
		$('#formAddPub input#txtPubName').css('border','solid red 2px');
	}else $('#formAddPub input#txtPubName').removeAttr('style');
	
	if ($('#formAddPub input#txtPubURL').val() ==null || $('#formAddPub input#txtPubURL').val()=="") {
		save = false;
		$('#formAddPub input#txtPubURL').css('border','solid red 2px');
		
	}else 
	{
		$('#formAddPub input#txtPubURL').removeAttr('style');
		if(!validateURL($('#formAddPub input#txtPubURL').val())) {
			urlcorrect = false;
			save = false
			$('#formAddPub input#txtPubURL').css('border','solid orange 2px');
			alert("Please enter full URL (including http://)");
		}
	}
	
	if (clean($('#formAddPub input#txtPubDomain').val()) ==null || 	clean($('#formAddPub input#txtPubDomain').val())=="") {
		save = false;
		$('#formAddPub input#txtPubDomain').next().css('border','solid red 2px');
	}else $('#formAddPub input#txtPubDomain').next().removeAttr('style');
	
	if (clean($('#formAddPub input#txtPubContent').val()) ==null || 	clean($('#formAddPub input#txtPubContent').val())=="") {
		save = false;
		$('#formAddPub input#txtPubContent').next().css('border','solid red 2px');
	}else $('#formAddPub input#txtPubContent').next().removeAttr('style');
	
	if (clean($('#formAddPub input#txtPubAPI').val()) ==null || 	clean($('#formAddPub input#txtPubAPI').val())=="") {
		save = false;
		$('#formAddPub input#txtPubAPI').next().css('border','solid red 2px');
	}else $('#formAddPub input#txtPubAPI').next().removeAttr('style');
	
	if ($('#formAddPub input#txtPubLicence').val() ==null || 	$('#formAddPub input#txtPubLicence').val()=="") {
		save = false;
		$('#formAddPub input#txtPubLicence').css('border','solid red 2px');
	}else $('#formAddPub input#txtPubLicence').removeAttr('style');
	if ($('#ddLanguage').val() ==null || 	$('#ddLanguage').val()=="") {
		save = false;
		$('#ddLanguage').css('border','solid red 2px');
	}else $('#ddLanguage').removeAttr('style');
							
	if (!save && urlcorrect){
		alert("Please fill in empty fields");
	}
	
	return save;
	
}

function validateURL(textval) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

function addPublisher(event){
	//validate publisher	
	save = validatePublisher(event);
	
	if(save){
		var addPublisher = {};
		
		addPublisher['publisher'] = $('#formAddPub input#txtPubName').val();
		addPublisher['uri'] = $('#formAddPub input#txtPubURL').val();
		addPublisher['domain'] = clean($('#formAddPub input#txtPubDomain').val());
		addPublisher['natureOfContent'] = clean($('#formAddPub input#txtPubContent').val());
		addPublisher['apiFormat'] = clean($('#formAddPub input#txtPubAPI').val());
		addPublisher['licence'] = $('#formAddPub input#txtPubLicence').val();
		addPublisher['language'] = $('#ddLanguage').val();
		addPublisher['notes'] = $('#formAddPub input#txtNotes').text();
	
		knownConsumers = [];
		$.each(consumers, function(k, e){
			c = {};
			c['consumer'] = e['consumer'];
			c['consumersAim'] = e['consumersAim'];
			c['consumersDescription'] = e['consumersDescription'] ;
			c['consumerUrl'] = e['consumerUrl'] ;
			
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
	}//end if save
	
	consumers=[];
}

var consumers = [];
function addConsumer(name, aim, description, url){
	consumer = {
		consumer : name ,
		consumersAim : clean(aim) ,
		consumersDescription : description,
		consumerUrl : url
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

function validateDemand(event){
	
	save = true;
	
	if ($('#formAddPub input#txtDomain').val() == null || $('#formAddPub input#txtDomain').val() =="") {
		save = false;
		$('#formAddPub input#txtDomain').css('border','solid red 2px');
	}else $('#formAddPub input#txtDomain').removeAttr('style');
	
	demandContentArray = clean($('#formAddPub input#txtDemandContent').val());
	if (demandContentArray.length == 0) {
		save = false;
		$('#formAddPub input#txtDemandContent').next().css('border','solid red 2px');
	}else $('#formAddPub input#txtDemandContent').next().removeAttr('style');
	
	demandAimArray = clean($('#formAddPub input#txtDemandAim').val());
	if (demandAimArray.length == 0) {
		save = false;
		$('#formAddPub input#txtDemandAim').next().css('border','solid red 2px');
	}else $('#formAddPub input#txtDemandAim').next().removeAttr('style');

	
	if ($('#formAddPub textArea#txtConDesc').val() == null || $('#formAddPub textArea#txtConDesc').val() =="") {
		save = false;
		$('#formAddPub textArea#txtConDesc').css('border','solid red 2px');
	}else $('#formAddPub textArea#txtConDesc').removeAttr('style');
							
	if (!save){
		alert("Please fill in empty fields");
	}
	
	return save;
	
}



function addNewDemand(event){
	save = validateDemand(event);
	
	if(save){
		addDemand = {};
		addDemand['domain'] = $('#formAddPub input#txtDomain').val();
		addDemand['natureOfContent'] = clean($('#formAddPub input#txtDemandContent').val());
		addDemand['aim'] = clean($('#formAddPub input#txtDemandAim').val());
		addDemand['description'] = $('#formAddPub textArea#txtConDesc').val();

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
						console.log(response.msg);			
						console.log(response);
	        }
	    });
	}
}

function saveConsumer(event){
	
	if(
		($("#txtConName").val()=="") || 
		($("#txtConAim").val()=="") || 
		($("#txtConDesc").val()=="") || 
		($("#txtConURL").val()=="")
	){
		alert("Please complete Consumer form");
	}
	else if (!validateURL($("#txtConURL").val())){
		alert("Please enter full URL (including http://)");
	}else{
		console.log("starting save process");
		
		label = '<span class="label label-primary">' + $("#txtConName").val() + '</span>'
		$("#txtConsumers").append(label); 
	
		addConsumer($("#txtConName").val(), 
						$("#txtConAim").val(), 
						$("#txtConDesc").val(), 
						$("#txtConURL").val() ); 
	
		$("#txtConName").val(""); 
		$("#txtConDesc").val("");
		$("#txtConAim").val("");
		//$("#txtConAim").next().children().remove('span');
		$("#txtConURL").val("");
		
	}
}

$(document).ready(function() {
	$.getJSON("languages.json", function(data){
		$.each(data, function(index,value) {
			$('#ddLanguage').append("<option 'value'"+ value.Code+">" + value.Language + "</option>");
			
		})		
	});
	
});

