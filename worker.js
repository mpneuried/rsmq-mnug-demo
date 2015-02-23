var path = require( "path" );

var RSMQWorker = require( "rsmq-worker" );
var gm = require( "gm" );

// read the configuration
var CONFIG = require("./config.json");

// create a worker
var worker = new RSMQWorker( CONFIG.qname, {redisPrefix: "mnug", interval:[0,1], invisibletime:3} );


// listen to messages
worker.on( "message", function( filepath, next, msgid ){
	
	// define the output file
	var filepathOut = CONFIG.outputFolder + path.basename( filepath );

	// read the file
	try{
		var gmFile = gm( filepath );
		gmFile.type( "Grayscale" );
	}catch(err){
		// possibly not a image
		next( err );
		return;
	}
	gmFile.write( filepathOut, function( err ){
		if(err){
			next( err );
			return;
		}
		console.log("file written", filepathOut);
		next();
	});

});

// handle errors
worker.on('error', function( err, msg ){
  console.log( "ERROR", err, msg.id, msg.rc );
});
worker.on('exceeded', function( msg ){
  console.log( "EXCEEDED", msg.id );
});
worker.on('timeout', function( msg ){
  console.log( "TIMEOUT", msg.id );
});

// start the worker
worker.start();