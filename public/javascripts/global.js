

//function to add a distribution (to a Dataset)
var arr_distributions=[];
function addDistribution(event){

	//validate distribution
	save = validateDistribution(event);

	if(save){

		var addDistribution = {};
		addDistribution['distribTitle'] = $('#formAddDistribution #txtTitle').val();
		addDistribution['datasetID'] = $('#datasetId').val();
		addDistribution['mediaType'] = $('#ddMediaType').val();
		addDistribution['accessURL'] = $('#formAddDistribution input#txtAccessURL').val();
		if($('#formAddDistribution input#txtDownloadURL').val() != "") {
				addDistribution['downloadURL'] = $('#formAddDistribution input#txtDownloadURL').val();
		}
		if($('#formAddDistribution input#dateModifiedDistrib').val() != "") {
			addDistribution['dateModifiedDistrib'] = $('#formAddDistribution input#dateModifiedDistrib').val();
		}
		if($('#formAddDistribution input#txtDistName').val() != "") {
			addDistribution['distributor'] = $('#formAddDistribution input#txtDistName').val();
		}
		if($('#formAddDistribution input#txtDistURL').val() != "") {
			addDistribution['distributorURL'] = $('#formAddDistribution input#txtDistURL').val();
		}

		//adding addDistribution object to 'distributions' array
		arr_distributions.push(addDistribution);
		console.log("starting save process");

		label = '<span class="label label-primary">' + $("#formAddDistribution #txtTitle").val() + '</span>'
		$("#txtDistribution").append(label);

		$('#dd_ucDistributionType').append('<option value="'+ $('#formAddDistribution #txtTitle').val() +'">' + $('#formAddDistribution #txtTitle').val() + '</option>');

		//clearing form
		$('#ddMediaType').val("");
		$('#formAddDistribution input#txtTitle').val("");
		$('#formAddDistribution input#txtAccessURL').val("");
		$('#formAddDistribution input#txtDownloadURL').val("");
		$('#formAddDistribution input#dateModifiedDistrib').val("");
		$('#formAddDistribution input#txtDistName').val("");
		$('#formAddDistribution input#txtDistURL').val("");

	}

	return save;
}

//function to save a new distribution (distribution page)
function saveDistribution(event) {

	save = addDistribution(event);

	if (save) {
		console.log(arr_distributions[0]); //arr_distributions since I only have one usecase in the array

//		arr_useCases[0]['datasetId'] = datasetid_uri; -> get dataset id from some hidden field from jade (for example)

		var type = 'POST';
		var url = 'dataset/add/distribution';

		persist(type, url, arr_distributions[0]);

	}//end if save

	//cleaning arrays
	arr_distributions=[];

}

function validateDistribution(event){

	save = true;
	urlcorrect = true;

	//title
	if ($('#formAddDistribution input#txtTitle').val() == null || $('#formAddDistribution input#txtTitle').val() =="") {
		save = false;
		$('#formAddDistribution input#txtTitle').css('border','solid red 2px');
	}else $('#formAddDistribution input#txtTitle').removeAttr('style');

	//access method (media type)
	if ($('#formAddDistribution #ddMediaType').val() == null || $('#formAddDistribution #ddMediaType').val() == -1) {
		save = false;
		$('#formAddDistribution #ddMediaType').css('border','solid red 2px');
	}else $('#formAddDistribution #ddMediaType').removeAttr('style');

	//access url
	if ($('#formAddDistribution input#txtAccessURL').val() == null || $('#formAddDistribution input#txtAccessURL').val() =="") {
		save = false;
		$('#formAddDistribution input#txtAccessURL').css('border','solid red 2px');
	}else {
		$('#formAddDistribution input#txtAccessURL').removeAttr('style');

		if(!validateURL($('#formAddDistribution input#txtAccessURL').val())) {
			urlcorrect = false;
			save = false;
			$('#formAddDistribution input#txtAccessURL').css('border','solid orange 2px');
			alert("Please enter full URL for Dataset Access URL field (including http://)");
		}
	}

	//Download url
	if(($('#formAddDistribution input#txtDownloadURL').val() !="")&&(!validateURL($('#formAddDistribution input#txtDownloadURL').val()))) {
		urlcorrect = false;
		save = false;
		$('#formAddDistribution input#txtDownloadURL').css('border','solid orange 2px');
		alert("Please enter full URL for Dataset Download URL field (including http://)");
	}else {
		$('#formAddDistribution input#txtDownloadURL').removeAttr('style');
	}

	//Distributor url
	if(($('#formAddDistribution input#txtDistURL').val() !="")&&(!validateURL($('#formAddDistribution input#txtDistURL').val()))) {
		urlcorrect = false;
		save = false;
		$('#formAddDistribution input#txtDistURL').css('border','solid orange 2px');
		alert("Please enter full URL for Distributor URL field (including http://)");
	}else {
		$('#formAddDistribution input#txtDistURL').removeAttr('style');
	}

	if (!save && urlcorrect){
		alert("Please fill in empty fields");
	}

	return save;

}

//function to add a use case (to a Dataset)
var arr_useCases=[];
function addUsecase(event) {

	//validate usecase
	save = validateUsecase(event);

	console.log(save);

	if(save){

		var addUseCase = {};
		//link from use case to consumer to distribution
		//addUseCase['consumer'] = $('#formAddUseCase input#txtConName').val(); //a distribution has a consumer
		//addUseCase['consumerUrl'] = $('#formAddUseCase input#txtConURL').val();

		addUseCase['datasetID'] = $('#datasetId').val();
		addUseCase['caseTitle'] = $('#formAddUseCase #txtTitle').val();
		if($('#formAddUseCase input#txtConName').val() != "") {
			addUseCase['generator'] = $('#formAddUseCase input#txtConName').val(); //a use case has a generator
		}
		addUseCase['generatorUrl'] = $('#formAddUseCase input#txtConURL').val();
		motivations = clean($('#formAddUseCase input#txtConAim').val());
		if (motivations.length != 0){
			addUseCase['useCaseMotiv'] = clean($('#formAddUseCase input#txtConAim').val());
		}
		if($('#formAddUseCase input#txtCaseURL').val() != "") {
			addUseCase['useCaseUrl'] = $('#formAddUseCase input#txtCaseURL').val();
		}
		if($('#formAddUseCase input#txtCaseDesc').val() != "") {
			addUseCase['description'] = $('#formAddUseCase textarea#txtCaseDesc').val();
		}

		addUseCase['distribution'] = $('#formAddUseCase #dd_ucDistributionType').val();

		//adding addUseCase object to 'useCases' array
		arr_useCases.push(addUseCase);

		console.log("starting save process");
		console.log(clean($('#formAddUseCase input#txtConAim').val()));

		label = '<span class="label label-primary">' + $("#formAddUseCase #txtTitle").val() + '</span>'
		$("#txtUseCase").append(label);

		//clearing form
		$('#formAddUseCase input#txtTitle').val("");
		$('#formAddUseCase input#txtConName').val("");
		$('#formAddUseCase input#txtConURL').val("");
		$('#formAddUseCase input#txtConAim').val("");
		$('#formAddUseCase input#txtCaseURL').val("");
		$('#formAddUseCase textarea#txtCaseDesc').val("");
		$('#formAddUseCase #txtConAim').tagsinput('removeAll')
		$('#formAddUseCase #dd_ucDistributionType').val("");
	}
	return save;

}

//function to save a new useCase (use case page) COMING HERE FROM ADDUSECASE.JADE
function saveUsecase(event) {

	save = addUsecase(event);

	if (save) {
		console.log(arr_useCases[0]); //arr_useCases[0] -> peres li ed tissevja just one usecase ma andekx alfejn tuza JSON array

//		arr_useCases[0]['datasetId'] = datasetid_uri; -> get dataset id from some hidden field from jade (for example)
		var type = 'POST';
		var url = 'dataset/add/usecase'; //dataset.js / function

		persist(type, url, arr_useCases[0]);

	}//end if save

	//cleaning arrays
	arr_useCases=[];

}

//function to validate input data on usecase
function validateUsecase(event){

	save = true;
	urlcorrect = true;

	//title
	if ($('#formAddUseCase input#txtTitle').val() == null || $('#formAddUseCase input#txtTitle').val() =="") {
		save = false;
		$('#formAddUseCase input#txtTitle').css('border','solid red 2px');
	}else $('#formAddUseCase input#txtTitle').removeAttr('style');


	//Generator url
	if ($('#formAddUseCase input#txtConURL').val() == null || $('#formAddUseCase input#txtConURL').val() =="") {
		save = false;
		$('#formAddUseCase input#txtConURL').css('border','solid red 2px');
	}else {
		$('#formAddUseCase input#txtConURL').removeAttr('style');

		if(!validateURL($('#formAddUseCase input#txtConURL').val())) {
			urlcorrect = false;
			save = false;
			$('#formAddUseCase input#txtConURL').css('border','solid orange 2px');
			alert("Please enter full URL for Consumer URL field (including http://)");
		}
	}

	//Usecase url
	if ($('#formAddUseCase input#txtCaseURL').val() == null || $('#formAddUseCase input#txtCaseURL').val() =="") {
		save = false;
		$('#formAddUseCase input#txtCaseURL').css('border','solid red 2px');
	}else {
		$('#formAddUseCase input#txtCaseURL').removeAttr('style');

		if(!validateURL($('#formAddUseCase input#txtCaseURL').val())) {
			urlcorrect = false;
			save = false;
			$('#formAddUseCase input#txtCaseURL').css('border','solid orange 2px');
			alert("Please enter full URL for Use Case URL field (including http://)");
		}
	}

	//description (if no distribution is entered)
	if (window.location.href.indexOf("addDataset") > -1){
		if (arr_distributions.length ==0){
			save = false;
			$('#formAddUseCase #dd_ucDistributionType').css('border','solid orange 2px');
			alert("Please add a distribution in the above form, then select it in the 'Distribution Method used')");
		}
	}

	//distribution method used (if no distribution is selected)
	if ($('#formAddUseCase #dd_ucDistributionType').val() ==-1) {
		save = false;
		$('#formAddUseCase #dd_ucDistributionType').css('border','solid red 2px');
	}else $('#formAddUseCase #dd_ucDistributionType').removeAttr('style');

	//description
	if ($('#formAddUseCase textArea#txtCaseDesc').val() == null || $('#formAddUseCase textArea#txtCaseDesc').val() =="") {
		save = false;
		$('#formAddUseCase textArea#txtCaseDesc').css('border','solid red 2px');
	}else $('#formAddUseCase textArea#txtCaseDesc').removeAttr('style');

	if (!save && urlcorrect){
		alert("Please fill in empty fields");
	}

	return save;

}

//function to create a new Dataset object (/add page)
function addDataset(event){
	save = validateDataset(event);

	if(save){
		var addDataset = {};
		addDataset['title'] = $('#formAddDataset input#txtTitle').val();
		addDataset['landingPage'] = $('#formAddDataset input#txtDatasetURL').val();
		addDataset['theme'] = clean($('#formAddDataset input#txtTheme').val());
		addDataset['keyword'] = clean($('#formAddDataset input#txtKeyword').val());
		addDataset['publisher'] = $('#formAddDataset input#txtPubName').val();
		addDataset['publisherUrl'] = $('#formAddDataset input#txtPubURL').val();
		addDataset['language'] = $('#formAddDataset #ddLanguage').val();
		addDataset['license'] = $('#formAddDataset #ddLicense').val();
		addDataset['natureOfContent'] = [];
		if ($('input#checkboxImages').is(":checked"))
			addDataset['natureOfContent'].push("Images");
		if ($('input#checkboxText').is(":checked"))
			addDataset['natureOfContent'].push("Text");
		if ($('input#checkboxNumeric').is(":checked"))
			addDataset['natureOfContent'].push("Numeric");
		if ($('input#checkboxDocuments').is(":checked"))
			addDataset['natureOfContent'].push("Documents");
		if ($('input#checkboxApplications').is(":checked"))
			addDataset['natureOfContent'].push("Applications");
		if($('#formAddDataset input#dateIssued').val() != "") {
			addDataset['dateIssued'] = $('#formAddDataset input#dateIssued').val();
		}
		if($('#formAddDataset input#dateModified').val() != "") {
			addDataset['dateModified'] = $('#formAddDataset input#dateModified').val();
		}
		if ($('#formAddDataset #ddCountry').val() != -1) {
			addDataset['spatial'] = $('#formAddDataset #ddCountry').val();
		}
		if($('#formAddDataset input#StartDate').val() != "") {
			addDataset['temporalStart'] = $('#formAddDataset input#StartDate').val();
		}
		if($('#formAddDataset input#EndDate').val() != "") {
			addDataset['temporalEnd'] = $('#formAddDataset input#EndDate').val()
		}
		addDataset['description'] = $('#formAddDataset textarea#txtDescription').val();


		//adding distributions and useCases arrays
		addDataset['distributions'] = arr_distributions;
		addDataset['useCases'] = arr_useCases;

		console.log(addDataset);

		var type = 'POST';
		var url = 'dataset/add/dataset';

		persist(type, url, addDataset);

		//cleaning arrays
		arr_useCases=[];
		arr_distributions=[];

	}//end if save
}

//function to validate input data on dataset
function validateDataset(event){

	save = true;
	urlcorrect = true;

	//title
	if ($('#formAddDataset input#txtTitle').val() == null || $('#formAddDataset input#txtTitle').val() =="") {
		save = false;
		$('#formAddDataset input#txtTitle').css('border','solid red 2px');
	}else $('#formAddDataset input#txtTitle').removeAttr('style');

	//dataset url
	if ($('#formAddDataset input#txtDatasetURL').val() == null || $('#formAddDataset input#txtDatasetURL').val() =="") {
		save = false;
		$('#formAddDataset input#txtDatasetURL').css('border','solid red 2px');
	}else {
		$('#formAddDataset input#txtDatasetURL').removeAttr('style');

		if(!validateURL($('#formAddDataset input#txtDatasetURL').val())) {
			urlcorrect = false;
			save = false;
			$('#formAddDataset input#txtDatasetURL').css('border','solid orange 2px');
			alert("Please enter full URL for Dataset URL field (including http://)");
		}
	}

	//domain
	domainArray = clean($('#formAddDataset input#txtTheme').val());
	if (domainArray.length == 0) {
		save = false;
		$('#formAddDataset input#txtTheme').next().css('border','solid red 2px');
	}else $('#formAddDataset input#txtTheme').next().removeAttr('style');

	//keywords
	keyArray = clean($('#formAddDataset input#txtKeyword').val());
	if (keyArray.length == 0) {
		save = false;
		$('#formAddDataset input#txtKeyword').next().css('border','solid red 2px');
	}else $('#formAddDataset input#txtKeyword').next().removeAttr('style');

	//dataset name
	if ($('#formAddDataset input#txtPubName').val() == null || $('#formAddDataset input#txtPubName').val() =="") {
		save = false;
		$('#formAddDataset input#txtPubName').css('border','solid red 2px');
	}else $('#formAddDataset input#txtPubName').removeAttr('style');

	//dataset url
	if ($('#formAddDataset input#txtPubURL').val() == null || $('#formAddDataset input#txtPubURL').val() =="") {
		save = false;
		$('#formAddDataset input#txtPubURL').css('border','solid red 2px');
	}else {
		$('#formAddDataset input#txtPubURL').removeAttr('style');

		if(!validateURL($('#formAddDataset input#txtPubURL').val())) {
			urlcorrect = false;
			save = false;
			$('#formAddDataset input#txtPubURL').css('border','solid orange 2px');
			alert("Please enter full URL for dataset URL field (including http://)");
		}
	}

	//language
	if ($('#formAddDataset #ddLanguage').val() == null || $('#formAddDataset #ddLanguage').val() ==-1) {
		save = false;
		$('#formAddDataset #ddLanguage').css('border','solid red 2px');
	}else $('#formAddDataset #ddLanguage').removeAttr('style');

	//license
	if ($('#formAddDataset #ddLicense').val() == null || $('#formAddDataset #ddLicense').val() ==-1) {
		save = false;
		$('#formAddDataset #ddLicense').css('border','solid red 2px');
	}else $('#formAddDataset #ddLicense').removeAttr('style');

	//description
	if ($('#formAddDataset textArea#txtDescription').val() == null || $('#formAddDataset textArea#txtDescription').val() =="") {
		save = false;
		$('#formAddDataset textArea#txtDescription').css('border','solid red 2px');
	}else $('#formAddDataset textArea#txtDescription').removeAttr('style');

	if (!save && urlcorrect){
		alert("Please fill in empty fields");
	}

	return save;

}

//function to recommend based on entries
/*
function recommend(event){
	save = validateDemand(event);

	if(save){
   	var addDemand = {};
		addDemand['theme'] = clean($('#formAddDemand input#txtTheme').val());
		addDemand['keyword'] = clean($('#formAddDemand input#txtKeyword').val());
		addDemand['language'] = $('#formAddDemand #ddLanguage').val();
		if ($('#formAddDemand #ddLicense').val() != -1) {
			addDemand['license'] = $('#formAddDemand #ddLicense').val();
		}
		addDemand['natureOfContent'] = [];
		if ($('input#checkboxImages').is(":checked"))
			addDemand['natureOfContent'].push("Images");
		if ($('input#checkboxText').is(":checked"))
			addDemand['natureOfContent'].push("Text");
		if ($('input#checkboxNumeric').is(":checked"))
			addDemand['natureOfContent'].push("Numeric");
		if ($('input#checkboxDocuments').is(":checked"))
			addDemand['natureOfContent'].push("Documents");
		if ($('input#checkboxApplications').is(":checked"))
			addDemand['natureOfContent'].push("Applications");
		if ($('#formAddDemand #ddCountry').val() != -1) {
			addDemand['spatial'] = $('#formAddDemand #ddCountry').val();
		}
		if($('#formAddDemand input#StartDate').val() != "") {
			addDemand['temporalStart'] = $('#formAddDemand input#StartDate').val();
		}
		if($('#formAddDemand input#EndDate').val() != "") {
			addDemand['temporalEnd'] = $('#formAddDemand input#EndDate').val();
		}
		if ($('#formAddDemand input#txtAim').val() != null && $('#formAddDemand input#txtAim').val() !="") {
			addDemand['demandMotiv'] = clean($('#formAddDemand input#txtAim').val());
		}
		addDemand['mediaType'] = $('#formAddDemand #ddMediaType').val();
		addDemand['description'] = $('#formAddDemand textarea#txtDescription').val();
		addDemand['contact'] = $('#formAddDemand input#txtContact').val();
		addDemand['submitterUrl'] = $('#formAddDemand input#txtContactURL').val();

		recommendations = match(addDemand);

		//console.log(addDemand);

		var type = 'POST';
		var url = '/recommend';

		//persist(type, url, addDemand);


	//match theme
	//match keywords
	//match language
	//media type


	}//end save
}
*/

//function to create a new Dataset Request (/demand page)
function addNewDemand(event){
	save = validateDemand(event);

	if(save){

	   	var addDemand = {};
			addDemand['theme'] = clean($('#formAddDemand input#txtTheme').val());
			addDemand['keyword'] = clean($('#formAddDemand input#txtKeyword').val());
			addDemand['language'] = $('#formAddDemand #ddLanguage').val();
			if ($('#formAddDemand #ddLicense').val() != -1) {
				addDemand['license'] = $('#formAddDemand #ddLicense').val();
			}
			addDemand['natureOfContent'] = [];
			if ($('input#checkboxImages').is(":checked"))
				addDemand['natureOfContent'].push("Images");
			if ($('input#checkboxText').is(":checked"))
				addDemand['natureOfContent'].push("Text");
			if ($('input#checkboxNumeric').is(":checked"))
				addDemand['natureOfContent'].push("Numeric");
			if ($('input#checkboxDocuments').is(":checked"))
				addDemand['natureOfContent'].push("Documents");
			if ($('input#checkboxApplications').is(":checked"))
				addDemand['natureOfContent'].push("Applications");
			if ($('#formAddDemand #ddCountry').val() != -1) {
				addDemand['spatial'] = $('#formAddDemand #ddCountry').val();
			}
			if($('#formAddDemand input#StartDate').val() != "") {
				addDemand['temporalStart'] = $('#formAddDemand input#StartDate').val();
			}
			if($('#formAddDemand input#EndDate').val() != "") {
				addDemand['temporalEnd'] = $('#formAddDemand input#EndDate').val();
			}
			if ($('#formAddDemand input#txtAim').val() != null && $('#formAddDemand input#txtAim').val() !="") {
				addDemand['demandMotiv'] = clean($('#formAddDemand input#txtAim').val());
			}
			addDemand['mediaType'] = $('#formAddDemand #ddMediaType').val();
			addDemand['description'] = $('#formAddDemand textarea#txtDescription').val();
			addDemand['contact'] = $('#formAddDemand input#txtContact').val();
			addDemand['submitterUrl'] = $('#formAddDemand input#txtContactURL').val();

			console.log(addDemand);

		  $.ajax({
		      type: 'POST',
		      data: JSON.stringify(addDemand),
		      url: 'demand/add',
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



			//persist(type, url, addDemand);

		}//end if save
}


function validateDemand(event){
	urlcorrect = true;
	save = true;

	//domain
	domainArray = clean($('#formAddDemand input#txtTheme').val());
	if (domainArray.length == 0) {
		save = false;
		$('#formAddDemand input#txtTheme').next().css('border','solid red 2px');
	}else $('#formAddDemand input#txtTheme').next().removeAttr('style');

	//keywords
	keyArray = clean($('#formAddDemand input#txtKeyword').val());
	if (keyArray.length == 0) {
		save = false;
		$('#formAddDemand input#txtKeyword').next().css('border','solid red 2px');
	}else $('#formAddDemand input#txtKeyword').next().removeAttr('style');

	//language
	if ($('#formAddDemand #ddLanguage').val() == null || $('#formAddDemand #ddLanguage').val() ==-1) {
		save = false;
		$('#formAddDemand #ddLanguage').css('border','solid red 2px');
	}else $('#formAddDemand #ddLanguage').removeAttr('style');

	// //license (not enforced)
	// if ($('#formAddDemand #ddLicense').val() == null || $('#formAddDemand #ddLicense').val() =="Select License") {
	// 	save = false;
	// 	$('#formAddDemand #ddLicense').css('border','solid red 2px');
	// }else $('#formAddDemand #ddLicense').removeAttr('style');

	//nature of content (checkbox) not enforced

	// //spatial
	// if ($('#formAddDemand #ddCountry').val() == null || $('#formAddDemand #ddCountry').val() ==-1) {
	// 	save = false;
	// 	$('#formAddDemand #ddCountry').css('border','solid red 2px');
	// }else $('#formAddDemand #ddCountry').removeAttr('style');

	//temporal (datetime) not enforced

	// //motivation
	// if ($('#formAddDemand input#txtAim').val() == null || $('#formAddDemand input#txtAim').val() =="") {
	// 	save = false;
	// 	$('#formAddDemand input#txtAim').css('border','solid red 2px');
	// }else $('#formAddDemand input#txtAim').removeAttr('style');

	//access method (media type)
	if ($('#formAddDemand #ddMediaType').val() == null || $('#formAddDemand #ddMediaType').val() == -1) {
		save = false;
		$('#formAddDemand #ddMediaType').css('border','solid red 2px');
	}else $('#formAddDemand #ddMediaType').removeAttr('style');

	//description
	if ($('#formAddDemand textArea#txtDescription').val() == null || $('#formAddDemand textArea#txtDescription').val() =="") {
		save = false;
		$('#formAddDemand textArea#txtDescription').css('border','solid red 2px');
	}else $('#formAddDemand textArea#txtDescription').removeAttr('style');

	//contact name
	if ($('#formAddDemand input#txtContact').val() == null || $('#formAddDemand input#txtContact').val() =="") {
		save = false;
		$('#formAddDemand input#txtContact').css('border','solid red 2px');
	}else $('#formAddDemand input#txtContact').removeAttr('style');

	//contact uri
	if ($('#formAddDemand input#txtContactURL').val() == null || $('#formAddDemand input#txtContactURL').val() =="") {
		save = false;
		$('#formAddDemand input#txtContactURL').css('border','solid red 2px');
	}else {
		$('#formAddDemand input#txtContactURL').removeAttr('style');

		if(!validateURL($('#formAddDemand input#txtContactURL').val())) {
			urlcorrect = false;
			save = false;
			$('#formAddDemand input#txtContactURL').css('border','solid orange 2px');
			alert("Please enter full URL (including http://)");
		}
	}

	if (!save && urlcorrect){
		alert("Please fill in empty fields");
	}


	return save;

}

//function to open add use case page
function callAddUseCase(theItem){
	id = $(theItem).attr('ex:itemid')
	location.href='addUseCase?id='+id
}

//function to open add distribution page
function callAddDistribution(theItem){
	id = $(theItem).attr('ex:itemid')
	location.href='addDistribution?id='+id
}

//function to open view details page
function callDetails(theItem){
	id = $(theItem).attr('ex:itemid').replace("http://butterbur22.iai.uni-bonn.de/dsaas/dataset/","")
	location.href='dataset/'+id
}


//function to open view details page for demands
function callDemandDetails(theItem){
	id = $(theItem).attr('ex:itemid')
	location.href='demand/'+id
}

function persist(persistType, persistUrl, dataset){
  //Use AJAX to post the object to our adduser service
  $.ajax({
      type: persistType,
      data: JSON.stringify(dataset),
      url: persistUrl,
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
        url: 'dataset/'+id,
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
	        url: 'dataset/'+itemID,
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

//function to assess validity of url
// function validateURL(textval) {
//     var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
//     return urlregex.test(textval);
// }

function validateURL(str) {
 // var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
 //   '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
 //   '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
 //   '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
 //   '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
 //   '(\#[-a-z\d_]*)?$','i'); // fragment locater
 // if(!pattern.test(str)) {
 //   return false;
 // } else {
    return true;
 // }
}

 function validateURL(textval) {
     var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
     return urlregex.test(textval);
 }


function addInterestOnDemand(event){
	save = true;
	if ($('#formAddInterest input#txtContactURL').val() == null || $('#formAddInterest input#txtContactURL').val() =="") {
		save = false;
		$('#formAddInterest input#txtContactURL').css('border','solid red 2px');
	}else {
		$('#formAddInterest input#txtContactURL').removeAttr('style');

		if(!validateURL($('#formAddInterest input#txtContactURL').val())) {
			urlcorrect = false;
			save = false;
			$('#formAddInterest input#txtContactURL').css('border','solid orange 2px');
			alert("Please enter full URL (including http://)");
		}
	}

	console.log(save)
	if (save){
		var addInterest = {};
		addInterest['submitter'] = $('#formAddInterest input#txtContact').val();
		addInterest['submitterUrl'] = $('#formAddInterest input#txtContactURL').val();
		addInterest['demandId'] = $('#formAddInterest input#demandId').val();

		$.ajax({
				type: 'POST',
				data: JSON.stringify(addInterest),
				url: 'demand/add/interest',
				dataType: 'JSON',
				contentType: "application/json",
				traditional: true
		}).done(function( response ) {
				if (response.msg === '') {
					alert("Thank you for your contribution.");
					location.reload();
				}
				else {
						alert('Error: ' + response.msg);
				}
		});
	}
}

//Load all JSON files for adding Dataset or Demand
$(document).ready(function() {

	if (window.location.href.indexOf("add") > -1){
		$.getJSON("languages.json", function(data){
			$.each(data, function(index,value) {
				$('#ddLanguage').append('<option value="'+ value.Code+'">' + value.Language + '</option>');
			})
		});
		$.getJSON("countries.json", function(data){
			$.each(data, function(index,value) {
				$('#ddCountry').append('<option value="'+ value.geonameId+'">' + value.countryName + '</option>');

			})
		});
		$.getJSON("licenses.json", function(data){
			$.each(data, function(index,value) {
				$('#ddLicense').append('<option value="'+ value.URI+'">' + value.License + '</option>');
			})
		});
		$.getJSON("media.json", function(data){
			$.each(data, function(index,value) {
				$('#ddMediaType').append('<option value="'+ value.url+'">' + value.Extension + '</option>');
			})
		});
		$.getJSON("content.json", function(data){
			$.each(data, function(index,value) {
				$('#ddContent').append('<option value="'+ value.content+'">' + value.content + '</option>');
			})
		});
	}
});
