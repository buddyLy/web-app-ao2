/* jshint maxlen: 630 */

var express = require('express'),
    app = express();

var bodyParser = require('body-parser');
var multer = require('multer'); 


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer()); // for parsing multipart/form-data

app.use(multer({dest:'./uploads/'}).single('assortment'));
/*
multer({dest:'./uploads/'}).single(...)
multer({dest:'./uploads/'}).array(...)
multer({dest:'./uploads/'}).fields(...)
*/
app.use(express.static(__dirname + ''));

var myData = [];
var product = {'Id':'1','Name':'Yogurt','Department':'123','CreateTime':'2015\/12\/24','LastChangedTime':'2015\/12\/26','Creator':'Bob','Status':'Waiting'};
var product2 = {'Id':'2','Name':'Hair Care','Department':'321','CreateTime':'2015\/11\/22','LastChangedTime':'2015\/12\/30','Creator':'Sagat','Status':'Done'};
myData.push(product);
myData.push(product2);
//addTestData(40, 'TestCdt', 'Cdt');

var projectId = null;

/*
 * get list of available assortments 
 */
app.get('/api/assortmentAnalysis/', function (req, res) {
	console.log('getting assortments');
  	res.send(myData);
});

/*
 * get diagnostics on load up
 */
app.get('/api/diagnostic/:id', function (req, res) {
	console.log('getting diagnostics:' + req.params.id);
	var assortmentId = req.params.id;
	var name = req.params.Name;

/*
	var result = myData.filter(function ( obj ) {
		return obj.Id === assortmentId;
	})[0];

	console.log('found this object: ' + result.Id + 'with status: ' + result.Status);

	var isDownloadAvailable = false;
	if (result.Status === 'Done'){
		isDownloadAvailable = true;
	}	
*/

	var result = findMyAssortment(assortmentId);
	//console.log('the result: ' + JSON.stringify(result));
	var statuscode = getStatusCode(assortmentId);
	var isDownloadAvailable = true;
	
	var myViewModel = {'RollupCode': 1, 'RollupName': 'UPC', 'StartDate': null, 'EndDate': null, 'DiagnosticResultsExists': true, 'CapabilityId': 10, 'AssortmentId': assortmentId, 'AssortmentName': result.Name, 'Department': result.Department, 'StatusCode': statuscode, 'CapabilityTypeCode': 1, 'CreatedBy': result.Creator, 'CreatedOn': '2015-08-07T10:13:45', 'UpdatedBy': result.Creator, 'UpdatedOn': '2015-08-07T10:13:45'};

	//var myViewModel = {'DiagnosticResultsExists': isDownloadAvailable,'RollupLevel': 2,'CapabilityId': 410, 'Name':'Hair Care','Department':'321'};
	res.status(200);
	//var dataVM = [];
	//dataVM.push(diagnosticsvm);
  	res.send(myViewModel);
});

/*
 * get cdt on load up
 */
app.get('/api/decisiontree/:id', function (req, res) {
	console.log('get customer decision tree on load');
	var assortmentId = req.params.id;

	var result = myData.filter(function ( obj ) {
		return obj.Id === assortmentId;
	})[0];
	
	var statuscode = getStatusCode(assortmentId);
	var isYulesQAvailable = true;
	var isItemMetricsAvailable = true;
	var isAssortDescAvailable = true;

	//var myViewModel = {'YulesQMatrixExists':isYulesQAvailable,'ItemMetricsExists':isItemMetricsAvailable,'AssortmentDescriptionExists':isAssortDescAvailable,};
 	var myViewModel = {'YulesQMatrixExists':isYulesQAvailable,'ItemMetricsExists':isItemMetricsAvailable,'AssortmentDescriptionExists':isAssortDescAvailable,'RollupCode': 1, 'RollupName': 'UPC', 'StartDate': null, 'EndDate': null, 'DiagnosticResultsExists': true, 'CapabilityId': 10, 'AssortmentId': assortmentId, 'AssortmentName': 'LYTEST1', 'Department': 3334, 'StatusCode': statuscode, 'CapabilityTypeCode': 1, 'CreatedBy': 'AOSYS', 'CreatedOn': '2015-08-07T10:13:45', 'UpdatedBy': 'AOSYS', 'UpdatedOn': '2015-08-07T10:13:45'};
  	res.send(myViewModel);
  	//res.sendStatus(404);
  	//res.sendStatus(200);
});

/*
 * get loyalty on load up
 */
app.get('/api/loyalty/:id', function (req, res) {
	console.log('getting loyalty on load');
	var assortmentId = req.params.id;

	var result = myData.filter(function ( obj ) {
		return obj.Id === assortmentId;
	})[0];

	var statuscode = getStatusCode(assortmentId);
	var isLoyaltyAvailable = true;	

	//var myViewModel = {'LoyaltyMetricsExist': isLoyaltyAvailable,'Id':result.Id,'Department':result.Department,'RollupLevel':'UPC'};
	var myViewModel = { 'LoyaltyMetricsExist': true, 'LoyaltyLevel': 'Node', 'UseClustering': false, 'CapabilityId': 22, 'AssortmentId': assortmentId, 'AssortmentName': 'LYTEST1', 'Department': 3334, 'StatusCode': statuscode, 'CapabilityTypeCode': 0, 'CreatedBy': 'AOSYS', 'CreatedOn': '2015-08-10T10:41:08', 'UpdatedBy': 'AOSYS', 'UpdatedOn': '2015-08-10T10:41:08' };
  	res.send(myViewModel);
});

/*
 * get clustering on load up
 */
app.get('/api/storeclustering/:id', function (req, res) {
	console.log('getting clustering on load:'+req.params.id);
	var assortmentId = req.params.id;
	var statuscode = getStatusCode(assortmentId);
	var isReclassifiedStoresAvailable = true;	
	var isSummaryAvailable = false;	

	//var myViewModel = {'ReclassifiedStoresExists': isReclassifiedStoresAvailable, 'ModelSummaryFileExists': isSummaryAvailable};
	var myViewModel={ 'ReclassifiedStoresExists': false, 'ModelSummaryExists': false, 'CapabilityId': 81, 'AssortmentId': assortmentId, 'AssortmentName': 'QA558HC', 'Department': 2, 'StatusCode': statuscode, 'CapabilityTypeCode': 0, 'CreatedBy': 'svcckp', 'CreatedOn': '2015-08-11T00:00:36', 'UpdatedBy': 'svcckp', 'UpdatedOn': '2015-08-11T00:00:36' };
  	res.send(myViewModel);
});

/*
 * get substitution on load
 */
app.get('/api/substitution/:id', function (req, res) {
	console.log('getting substitution on load');
	var assortmentId = req.params.id;

	var result = myData.filter(function ( obj ) {
		return obj.Id === assortmentId;
	})[0];

	var statuscode = getStatusCode(assortmentId);
	var isSubstitutionAvailable = false;	

	//var myViewModel = {'SubstitutionMetricsExist': isSubstitutionAvailable,'Id':result.Id,'Department':result.Department,'RollupLevel':'UPC'};
var myViewModel = { 'SubstitutionMetricsExist': false, 'CapabilityId': 18, 'AssortmentId': assortmentId, 'AssortmentName': 'ROBBY', 'Department': 92, 'StatusCode': statuscode, 'CapabilityTypeCode': 0, 'CreatedBy': 'AOSYS', 'CreatedOn': '2015-08-07T13:56:36', 'UpdatedBy': 'AOSYS', 'UpdatedOn': '2015-08-07T13:56:36' };
  	res.send(myViewModel);
});

/* add new assortments to database */
app.post('/api/assortmentAnalysis/', function (req, res) {	
	console.log('adding new assortment');
	var projectId = myData.length;
	projectId = projectId + 1;
	console.log('current time: ' + getCurrentDate('time'));
	console.log('project name: ' + req.body.Name);
	console.log('department: ' + req.body.Department);
	console.log('RollupCode: ' + req.body.RollUpTypeCode);
	var myitemlist = JSON.stringify(req.body.ItemList);
	console.log('ItemList: ' + myitemlist);
	console.log('ItemList Json: ' + JSON.parse(myitemlist));
	writeBinaryToFile(req.body.ItemList);	
	
	var projectName = req.body.Name;
	var deptNbr = req.body.Department;
	var rollupCode = req.body.RollUpTypeCode;
  	//res.json(req.body);

	var myDate = getCurrentDate('date');
	var myTime = getCurrentDate('time');
	var myStatus = getRandomStatus();
	var myproduct = {'Id':projectId,'Name':projectName,'Department':deptNbr,'CreateTime':myDate,'LastChangedTime':myTime,'Creator':'Pooh','Status':myStatus};
	console.log('adding assortment to string: ' +  JSON.stringify(myproduct));
	myData.push(myproduct);
  	res.status(201);
  	//res.send(myData);
  	res.send('Success');
});

function readCSVFile(binData)
{
	var fs = require('fs');
	var csv = require('csv-something');
//var stream = fs.createReadStream("my.csv");
var stream = fs.createReadStream(binData);
 
csv
 .fromStream(stream)
 .transform(function(data){
     return data.reverse(); //reverse each row. 
 })
 .on('data', function(data){
     console.log(data);
 })
 .on('end', function(){
     console.log('done');
 });
}


function writeBinaryToFile(binData)
{
	var crypto = require('crypto');
	var fs = require('fs');
	var wstream = fs.createWriteStream('myBinaryFile.csv');
	// creates random Buffer of 100 bytes
	var buffer = crypto.randomBytes(100);
	//wstream.write(buffer);
	wstream.write(binData);
	// create another Buffer of 100 bytes and write
	//wstream.write(crypto.randomBytes(100));
	wstream.end();
}

function writeTextToFile()
{
	var fs = require('fs');
	var wstream = fs.createWriteStream('myOutput.txt');
	// Node.js 0.10+ emits finish when complete
	wstream.on('finish', function () {
		console.log('file has been written');
	});
	wstream.write('Hello world!\n');
	wstream.write('Another line');
	wstream.end();
}

function getRandomStatus()
{
	//get numbers between 1 to 3
	var randomNbr = Math.floor((Math.random() * 3) + 1);
	var myStatus = 'Undefine';
	switch(randomNbr) {
		case 1:
			myStatus = 'Done';
			break;
		case 2:
			myStatus = 'Active';	
			break;
		case 3:
			myStatus = 'Waiting';
			break;
		default:
			console.log('status is undefined');
			myStatus = 'Undefined';	
			
	}
	return myStatus;
}

function getCurrentDate(format){
	var d = new Date(); // for now
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDay();
	var hours = d.getHours(); // => 9
	var mins = d.getMinutes(); // =>  30
	var secs = d.getSeconds(); // => 51
	
	if (format === 'date'){
		return year + '/' + month + '/' + day; 
	}else if (format === 'time'){
		return hours + ':' + mins + ':' + secs; 
	}else{
		return Date().toString();
	}
}
/*
 * create yules queue
 */
app.post('/api/decisiontree/:id', function (req, res) {	
	console.log('creating yules q');
	console.log('project id: ' + req.body.AssortmentId);
  	res.sendStatus(201);
  	//res.sendStatus(404);
});

/*
 * create store clustering
 */
app.post('/api/storeclustering/:id', function (req, res) {	
	console.log('create store clustering');
	console.log('project id: ' + req.body.AssortmentId);
  	res.sendStatus(501);
});

/*
 * create loyalty
 */
app.post('/api/loyalty/:id', function (req, res) {	
	console.log('create loyalty');
	console.log('project id: ' + req.body.AssortmentId);
  	res.sendStatus(200);
});

/*
 * create substitution
 */
app.post('/api/substitution/:id', function (req, res) {	
	console.log('create substitution');
	console.log('project id: ' + req.body.AssortmentId);
  	res.sendStatus(200);
});

/*
 * click to download each available files
 */
//app.get('/api/file/:capability', function (req, res){
//app.get('/api/file/capabilityId/:capabilityId/fileType/:fileType', function (req, res){
//api/file?capabilityId='+capabilityId+'&fileType='+fileType;
app.get('/api/file', function (req, res){
	console.log('downloading diagnostics');	
	var capabilityId = Number(req.query.capabilityId);
	var fileType = Number(req.query.fileType); 
	console.log('id:'+capabilityId + ' filetype:' +fileType);	

	var homepath = '/Users/lcle/git/workspace/assortment-optimization-ui/src/main/webapp/AssortmentOptimization/files/';
	var fileName = 'undefined';

	switch(fileType){
		case 101:	//assortment diagnostic
			fileName = homepath + 'diagnostics.csv';
			break;	
		case 200: //cdt
			fileName = homepath + 'yulesq.csv';
			break;
		case 201:
			fileName = homepath + 'itemmetrics.csv';
			break;
		case 202:
			fileName = homepath + 'assortdesc.csv';
			break;
		case 301: //reclassified stores
			fileName = homepath + 'ReclassifiedStores.csv';
			break;
		case 302: //model summary
			fileName = homepath + 'ModelSummary.csv';
			break;
		case 402: //loyalty
			fileName = homepath + 'loyaltymetrics.csv';
			break;
		case 501: //substitution metrics
			fileName = homepath + 'substitutionmetrics.csv';
			break;		
		default:
			console.log('Filetype not recognized');	
	}

	console.log('file name: ' + fileName);
	//var capabilityFile = req.query.capabilityFile;
	//res.sendStatus(401);
	res.sendFile(fileName, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
		else{
			console.log('Sent:', fileName);
		}
	});
});

//app.get('/api', function (req, res){ -> may not need to specify template
app.get('/api/:Template', function (req, res){
	console.log('getting template');
	//var fileName = req.params.name;
	var templateName = req.query.templateName;
	//res.send('id: ' + req.query.id);
	var fileName = '/Users/lcle/git/workspace/assortment-optimization-ui/src/main/webapp/AssortmentOptimization/files/'+templateName;
	//var fileName = '/Users/lcle/git/workspace/assortment-optimization-ui/src/main/webapp/AssortmentOptimization/ItemListTemplate.csv';
	//var fileName = '/Users/lcle/git/workspace/assortment-optimization-ui/src/main/webapp/'+fileName;
  	res.sendFile(fileName, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
});

/*
app.get('/api/template/', function (req, res){
	res.header('Content-Disposition', 'attachment;filename=phone.csv'); 
	res.type('text/csv');
	res.send(200, csvString);
});
*/

/* SAMPLE CODE TO LOOP THROUGH ARRAY OF OBJECTS
function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}

var array = [
    { name:'string 1', value:'this', other: 'that' },
    { name:'string 2', value:'this', other: 'that' }
];

var resultObject = search('string 1', array);
*/

function parseStatus(mystatus) {
	switch (mystatus.substring(mystatus.indexOf('-') + 1)){
		case 'Waiting':
			return 2;
		case 'Done':
			return 4;
		case 'Active':
			return 3;
		case 'Error':
			return 1;
		default:
			break;
	}
}

function getStatusCode(assortmentId){
	/*
	var result = myData.filter(function ( obj ) {
		//return obj.Id === assortmentId;
		if (obj.Id === assortmentId){
			console.log('found assortment');
			return obj;
		}
		else{
			console.log('assortment not found');
		}
	})[0];
	*/

	var result = findMyAssortment(assortmentId);

	var statuscode = parseStatus(result.Status);
	console.log('parsed status: '+result.Status + ' status code: ' + statuscode);
	return statuscode;
}

function findMyAssortment(assortmentId)
{
	return myData.filter(function ( obj ) {
		//return obj.Id === assortmentId;
		if (obj.Id === assortmentId){
			console.log('found assortment');
			return obj;
		}
		else{
			console.log('assortment not found');
		}
	})[0];
}

function addTestData(startId, name, capstatus){
	var max=startId + 4;
	var mystatus = null;
	for (var i=startId; i<max; i++){
		if (i === startId){
			mystatus = capstatus + '-Error';
		}else if(i === startId + 1){
			mystatus = capstatus + '-Waiting';
		}else if(i === startId + 2){
			mystatus = capstatus + '-Active';
		}else if(i === startId + 3){
			mystatus = capstatus + '-Done';
		}
		var assortment = {'Id':i, 'Name': name, 'Department': 2, 'Creator': 'syama1', 'CreateTime': '8/6/2015', 'LastChangedBy': 'mmoha2', 'LastChangedTime': '2015-08-10T18:55:31', 'Status': mystatus};
		myData.push(assortment);
	}
}

app.listen(8083);
