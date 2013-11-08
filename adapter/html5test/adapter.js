
// Constructor
var Adapter = function() {
    this.config = {
	name : "Sunspider",
	version : "1.0.1"
    };
    this.runTest();
}

Adapter.prototype.runTest = function() {
    var self = this;

    document.getElementById("adapterFrame").src = "test/test.html";
    
    var iframe = document.getElementById("adapterFrame");
    var contentWindow = iframe.contentWindow;

    iframe.onload = function() {
	contentWindow.finish = function(data) {
	    self.parseData(data);
	}
    }

}

Adapter.prototype.parseData = function(data) {
    
    result = {
	score: data.score,
	maximum: data.maximum,
	points: data.points,
	result: data.results
    }
    
    window.parent.adapterDone(result);
}

function createAdapter(args) {
    new Adapter(args)
}
new Adapter();
