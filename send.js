var fs = require("fs");
var async = require("async");

// read the configuration
var CONFIG = require("./config.json");

// init RSMQ
var RSMQueue = require("rsmq");
var rsmq = new RSMQueue( { ns: "mnug" } );

// read the files from the input folder
fs.readdir( CONFIG.inputFolder, function( err, files ){
	var idx, filepath;

	if( err ){
		console.log("read folder", err);
		return;
	}

	// call fnWriteMessage for each file
	async.each( files, fnWriteMessage, function( err, results ){
		if ( err ) {
			console.log("send message", err );
			return;
		}
		console.log( files.length + " FILES SEND" );

		// exit the script on end
		rsmq.quit();
	});
});

// method to send a message to RSMQ
var fnWriteMessage = function( file, cb ){
	console.log( "send file", file );

	// define the filepath
	filepath = CONFIG.inputFolder + file;

	// write a message to RSMQ. Assuming the queue exists!
	rsmq.sendMessage( {qname:CONFIG.qname, message:filepath}, cb)	
};