document.write( (function(){
	var RTN = '';
	RTN += '<style type="text/css">' + "\n";
	RTN += '	@import "./resources/common.css";' + "\n";
	RTN += '	@import "./resources/modules.css";' + "\n";
	RTN += '	@import "./lib/dojo/resources/dojo.css";' + "\n";
	RTN += '	@import "./lib/dijit/themes/tundra/tundra.css";' + "\n";
	RTN += '	@import "./index.files/cont.css";' + "\n";
	RTN += '</style>' + "\n";
	RTN += '' + "\n";
	RTN += '<script type="text/javascript" src="./lib/air/AIRAliases.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="./lib/jquery/jquery-1.4.2.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="./lib/px/jquery.pxLBox.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="./lib/dojo/dojo.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="./resources/main.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="./resources/projMgr.js"></script>' + "\n";
	return RTN;
})() );