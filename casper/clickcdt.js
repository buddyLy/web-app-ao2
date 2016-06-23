var links = [];
var casper = require('casper').create();

function getLinks() {
    var links = document.querySelectorAll('a.ng-binding.ng-scope');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

casper.start('http://localhost:8083/layout.html#/assortment/2/diagnostics', function() {
    // search for 'casperjs' from google form
    //this.fill('form[action="/search"]', { q: 'casperjs' }, true);
    this.capture('cdtclick.png');
});

casper.then(function() {
    // aggregate results for the 'casperjs' search
    links = this.evaluate(getLinks);
    // now search for 'phantomjs' by filling the form again
    //this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
    //this.click('ul.nav.navbar-nar li.nlightblue.fade-selection-animation.ng-scope a:first-child');
    //this.click('a:first-child');
    //this.click('ul li a.ng-binding.ng-scope:first-child');
   /* 
    this.wait(5000, function(){
		this.echo('capturing cdt click');
		this.capture('cdtclick2.png');
	});
	*/
	
	var count = 1;

	casper.each(links, function(self, link) {
    	//this.thenOpen(link, function() {
   		//this.thenOpen('#/assortment/2/cdt', function() {
    	this.thenOpen('www.google.com', function() {
    	//this.thenOpen(link, function() {
			this.echo(this.getTitle() + ' - ' + link);
    	});
		this.wait(3000, function(){
			this.echo('capturing link'+link);
			this.capture('link'+count+'.png');
			count = count + 1;
		});
 	});

/*
	casper.open('www.google.com', function(){
			this.wait(5000, function(){
				this.echo('capturing cdt link');
				this.capture('link3.png');
			});
	});
*/

/*
casper.open('http://www.google.com/').then(function() {
    this.echo('GOT it.');
});
*/
	
});

casper.run(function() {
    // echo results in some pretty fashion
    this.echo(links.length + ' links found:');
    this.echo(' - ' + links.join('\n - ')).exit();
});
