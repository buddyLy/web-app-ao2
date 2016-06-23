var links = [];
var casper = require('casper').create();

function getLinks() {
    var links = document.querySelectorAll('div.ui-grid-cell-contents.ng-binding.ng-scope');
    return Array.prototype.map.call(links, function(e){ 
        //return e.getAttribute('href');
       	return e;
    });
}

function getInfo(){
	//var links = this.getElementInfo('div.ui-grid-cell-contents.ng-binding.ng-scope');
	this.getElementInfo('div.ui-grid-cell-contents.ng-binding.ng-scope');
	/*
	dumpData(links);
    return Array.prototype.map.call(links, function(e){ 
        return e.text;
    });
    */
}

function dumpData(mydata){
	console.log('dumping data');
	//this.echo('echo data');
   	require('utils').dump(mydata); 
}
casper.start('http://localhost:8083/layout.html#/', function() {
    // search for 'casperjs' from google form
    //this.fill('form[action="/search"]', { q: 'casperjs' }, true);
});

casper.then(function() {
    // aggregate results for the 'casperjs' search
    //links = this.evaluate(getInfo());
    //getInfo();
	var links = this.getElementInfo('div.ui-grid-cell-contents.ng-binding.ng-scope');
	//this.getElementsInfo('div.ui-grid-cell-contents.ng-binding.ng-scope');
	dumpData(links);
	console.log('the txt:' + links.text);
	//this.click('div.ui-grid-cell-contents.ng-binding.ng-scope');
	console.log('links.tag' +links.tag);

	//var clickedlink = 'div.ui-grid-cell-contents.ng-binding.ng-scope';
	//var clickedlink = 'div.ui-grid-cell.ng-scope.ui-grid-disable-selection.ui-grid-coluiGrid-007';
	//this.click(clickedlink);
	this.clickLabel('Hair Care', 'div');
   	this.wait(3000, function(){
		this.echo('capturing clicked event');
		this.capture('clickedevent.png');
	});

/*
	//this.clickLabel(' CDT', 'a');
	this.click('ng-binding.ng-scope a');
   	this.wait(3000, function(){
		this.echo('capturing cdt');
		this.capture('cdtevent.png');
	});
*/
	//var mylinks = Array.prototype.map.call(links, function(e){
	//	return e.text;
		//console.log('console data: '+e);
		//this.echo('echo data' + e);
	//});
	//dumpData(mylinks);
    // now search for 'phantomjs' by filling the form again
    //this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
    //require('utils').dump(this.getElementInfo('div.ui-grid-cell-contents.ng-binding.ng-scope').text);
});

casper.run(function() {
    // echo results in some pretty fashion
    //this.echo(links.length + ' links found:');
    //this.echo(' - ' + links.join('\n - ')).exit();
   	require('utils').dump(links); 
    //this.echo(JSON.stringify(links[0]));
    this.exit();
});
