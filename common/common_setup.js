document.write( (function(){
	var RTN = '';
	RTN += '<style type="text/css">' + "\n";
	RTN += '	@import "app:/common/common.css";' + "\n";
	RTN += '	@import "app:/common/modules.css";' + "\n";
	RTN += '	@import "app:/lib/dojo/resources/dojo.css";' + "\n";
	RTN += '	@import "app:/lib/dijit/themes/tundra/tundra.css";' + "\n";
	RTN += '</style>' + "\n";
	RTN += '' + "\n";
	RTN += '<script type="text/javascript" src="app:/lib/air/AIRAliases.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="app:/lib/jquery/jquery-1.4.2.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="app:/lib/px/jquery.pxLBox.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="app:/lib/dojo/dojo.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="app:/common/main.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="app:/common/projMgr.js"></script>' + "\n";
	RTN += '<script type="text/javascript" src="app:/common/modMgr.js"></script>' + "\n";
	return RTN;
})() );