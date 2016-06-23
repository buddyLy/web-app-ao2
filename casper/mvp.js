var links = [];
var casper = require('casper').create();

function getLinks() {
	console.log('going to get all the links');
    //var links = document.querySelectorAll('h3.r a');
    var links = document.querySelectorAll('a');
    return Array.prototype.map.call(links, function(e) {
		console.log('link: ' + e.getAttribute('href'));
        return e.getAttribute('href');
    });
}

casper.start('http://localhost:8083/layout.html#/', function() {
    // search for 'casperjs' from google form
   	this.wait(5000, function(){
		this.capture('home.png');
    	this.click('#addData.btn.btn-primary');
	});
   	this.wait(5000, function(){
		this.echo('capture blank modal');
		this.capture('blankmodal.png');
	});
	//this.fill('form[action="/search"]', { q: 'casperjs' }, true);
});

casper.then(function() {
	//this.sendKeys('projectName', 'LyTest');
	this.sendKeys('input[name="projectName"]', 'lytest2');
	this.sendKeys('input[name="deptnbr"]', '19');
	//this.click('input[id="rollupxref"][value="yes"]');
	
	//upload a file
	/* try 1
	this.fill('form',{
	  '[type="file"]':'C:\\test\\Test.ZIP'
	},true);
	*/

	/* try 2
casper.start('http://abc.com/myfile.html', function() {
  this.evaluate(function(fileName) {__utils__.findOne('input[type="file"]').setAttribute('value',fileName)},{fileName:fileName});
    this.echo('Name='+this.evaluate(function() {return __utils__.findOne('input[type="file"]').getAttribute('name')}));
      this.echo('Value='+this.evaluate(function() {return __utils__.findOne('input[type="file"]').getAttribute('value')}));
        this.page.uploadFile('input[type="file"]',fileName);

          this.click('input[name="send"]');

		  });
	   */

	/* try 3 */
var fileName='/Users/lcle/testcode/svn/assortopt/trunk/AssortmentOptimizationSystem/src/Web/casper/test.csv'; //DOUBLE QUOTES ARE REALLY IMPORTANT AND A REAL FILE IN THE PATH TOO!
//casper.start('http://abc.com/myfile.html', function() {
  this.page.uploadFile('input[type="file"]',fileName);
    //this.click('input[name="send"]');
//	});


  	//wait 3 seconds for upload 
	this.wait(3000, function(){
		this.capture('completeform.png');
		this.click('#createProject');
	});

   	this.wait(3000, function(){
		this.echo('capturing modal');
		this.capture('projectcreated.png');
	});
	//fill out form
    // aggregate results for the 'casperjs' search
    //links = this.evaluate(getLinks);
    // now search for 'phantomjs' by filling the form again
    //this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
});

casper.then(function() {
    // aggregate results for the 'phantomjs' search
    //links = links.concat(this.evaluate(getLinks));
});

casper.run(function() {
    // echo results in some pretty fashion
    //this.echo(links.length + ' links found:');
    //this.echo(' - ' + links.join('\n - ')).exit();
    this.exit();
});
