//FirstView Component Constructor
function FirstView() {

	var values = ['temp', 'light', 'moisture','timestamp'];
	var labels = [];
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createWindow({
		backgroundColor : '#eee',
		layout : 'vertical',
		fullscreen : false,
		exitOnClose : true
	});
	self.orientationModes = [Ti.UI.PORTRAIT];

	//label using localization-ready strings from <app dir>/i18n/en/strings.xml
	var label = Ti.UI.createLabel({
		color : '#000000',
		text : String.format(L('welcome'), 'Titanium'),
		height : 'auto',
		width : 'auto'
	});

	var createPositionDataLabel = function(name, value) {
		var label = Ti.UI.createLabel({
			text : '  ' + name + ': ' + (value === undefined ? 'null' : value),
			color : '#444',
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			width : 'auto',
			left : '5dp'
		});
		label.updatePositionData = function(data) {
			label.text = '  ' + name + ': ' + (data === undefined ? 'null' : data);
		};
		return label;
	};

	for ( i = 0; i < values.length; i++) {
		var label = createPositionDataLabel(values[i]);
		labels.push(label);
		self.add(label);
	}

	//self.add(label);

	//Add behavior for UI
	label.addEventListener('click', function(e) {
		alert(e.source.text);
	});
//	Titanium.API.info('test');

	//var responseData = getRequest();
	//Titanium.API.info('responseData: '+responseData);
	//responseData = JSON.parse(responseData);
	
	
	domain = "c33bc6429f9b5de446c97409e033458c";
	bearer_token = "7hv7NVUXOTVyN4K3J7NIPHBktTfg4VtUoF8Wnu1TZkMp";
	stuff = "things";
	thing = "gardenbot";	

//Titanium.API.info('get request');
	var access_token = "Bearer " + bearer_token;

	var apiUrl = "http://api.m2m.io";
	var url = apiUrl + '/2/account/domain/'+domain+'/stuff/'+stuff+'/thing/'+thing+'/present';

	//var params = dataset;
	//var length = params.length;

//	Titanium.API.info(url);
var loop = 1;
//sleep_until(1);
//while(loop>0) { 
	

	var request = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			Ti.API.info("Received text: " + this.responseText);
			Ti.API.debug(this.status + ': ' + this.statusText);
			data = JSON.parse(this.responseText);
			labels[0].updatePositionData(data['attributes'].temperature);
			labels[1].updatePositionData(data['attributes'].light);
			labels[2].updatePositionData(data['attributes'].moisture);
			labels[3].updatePositionData(getDate());
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			Ti.API.debug(this.status + ': ' + this.statusText);
			Ti.API.debug(this.allResponseHeaders);
		},
		timeout : 10000 // in milliseconds
	});
	request.open('GET', url);
	request.setRequestHeader("Authorization", access_token);
	request.setRequestHeader("Content-Type", "application/json");
	request.send();
//	sleep_until(5);
	
//}
	

	
	return self;
}

module.exports = FirstView;


function sleep_until (seconds) {
   var max_sec = new Date().getTime();
   while (new Date() < max_sec + seconds * 1000) {}
    return true;
}

function getRequest() {
	domain = "c33bc6429f9b5de446c97409e033458c";
	bearer_token = "7hv7NVUXOTVyN4K3J7NIPHBktTfg4VtUoF8Wnu1TZkMp";
	stuff = "things";
	thing = "device01";	

//Titanium.API.info('get request');
	var access_token = "Bearer " + bearer_token;

	var apiUrl = "http://api.m2m.io";
	var url = apiUrl + '/2/account/domain/'+domain+'/stuff/'+stuff+'/thing/'+thing+'/present';

	//var params = dataset;
	//var length = params.length;

//	Titanium.API.info(url);

	var request = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			Ti.API.info("Received text: " + this.responseText);
			Ti.API.debug(this.status + ': ' + this.statusText);
			getResponse = this.responseText;
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			Ti.API.debug(this.status + ': ' + this.statusText);
			Ti.API.debug(this.allResponseHeaders);
		},
		timeout : 10000 // in milliseconds
	});
	request.open('GET', url);
	request.setRequestHeader("Authorization", access_token);
	request.setRequestHeader("Content-Type", "application/json");
	request.send();
	response = request.getResponse;
	
//	Titanium.API.info('end get request');
Titanium.API.info(response);
	return response;

}

function getDate() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
 
    if (hours < 10) { hours = "0" + hours}; 
    if (minutes < 10) { minutes = "0" + minutes};
    if (seconds < 10) { seconds = "0" + seconds};
 
    return month + "/" + day + "/" + year + " -  " + hours + ":" + minutes + ":" + seconds;
 
    }
