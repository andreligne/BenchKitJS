/*
 * Html5Test -- Html5 conformance test
 * https://github.com/NielsLeenheer/html5test/ (2013-11-15)
 * 
 * Description: 
 *  "The HTML5 test score is an indication of how well your browser supports the upcoming 
 *   HTML5 standard and related specifications. Even though the specification isn't finalized yet, 
 *   many features are already supported and all major browser manufacturers are making sure their 
 *   browser is ready for the future."
 *
 */

var Adapter = function() {
    this.config = {
        name : "HTML5test",
        version : "5.0"
    };

    this.runTest();
}

Adapter.prototype.runTest = function() {
    var self = this;
    
    document.getElementById("adapterFrame").src = "test.html";
    
    var iframe = document.getElementById("adapterFrame");
    var contentWindow = iframe.contentWindow;

    iframe.onload = function() {
        //Overwrite the finish function in test.html.
        contentWindow.finish = function(data) {
            self.parseData(data);
	   }
    }

}

function removeResult(result, group, variable, score) {
    result["maximum"] -= score;
    if (result["result"][group + "-" + variable] === "1") {
        result["score"] -= score
    }
    delete result["result"][group + "-" + variable];
    var group_result = result["points"][group].split("/")
    result["points"][group] = group_result[0] + "/" + (group_result[1]-score) 

    return result
}

Adapter.prototype.parseData = function(data) {
    var result = {
        score: data.score,
        maximum: data.maximum,
        points: data.points.split(",").reduce(function(result, kvalue) {
                    kvalue = kvalue.split("=")
                    result[kvalue[0]] = kvalue[1]
                    return result;
                }, {}),
        result: data.results.split(",").reduce(function(result, kvalue) {
                    kvalue = kvalue.split("=")
                    result[kvalue[0]] = kvalue[1]
                    return result; 
                }, {})
    }

    /*
     * Removing csp10 and csp11 since these tests can't be run on a python
     * SimpleHTTP webserver.
     */
    result = removeResult(result, "security", "csp10", 3);
    result = removeResult(result, "security", "csp11", 2);

    /*
     * Removing indexedDB.arraybuffer since this one randomly show true or false
     * even when it should show false.
     */
    result = removeResult(result, "storage", "indexedDB.arraybuffer", 2);

    window.parent.output("- Result: " + result["score"] + "/" + result["maximum"] + " - ", "output-" + this.config.name, false)

    window.parent.adapterDone(result);
}
    
function createAdapter(args) {
    new Adapter()
}
