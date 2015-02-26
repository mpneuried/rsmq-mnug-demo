var path = require( "path" );
var gm = require( "gm" );

// read the configuration
var CONFIG = require("./config.json");

// create a worker
var RSMQWorker = require( "rsmq-worker" );
var worker = new RSMQWorker( CONFIG.qname, {redisPrefix:"mnug", interval:[0,1,1], invisibletime:3} );


// listen to messages
worker.on( "message", function( filepath, next, msgid ){
	
	// define the output file
	var filename = path.basename( filepath );
	var filepathOut = CONFIG.outputFolder + filename;

	try{
		// read the file
		var gmFile = gm( filepath );
		// convert the image to a grayscale image
		gmFile.type( "Grayscale" );

	}catch(err){
		// possibly not a image
		next( err );
		return;
	}

	// write the file
	gmFile.write( filepathOut, function( err ){
		if(err){
			next( err );
			return;
		}
		console.log("file written", filename);
		// mark this message as done
		next();
	});

});

// handle errors
worker.on('error', function( err, msg ){
  console.log( "ERROR", err, msg.id, msg.rc );
});
worker.on('exceeded', function( msg ){
  console.log( "EXCEEDED", msg );
});
worker.on('timeout', function( msg ){
  console.log( "TIMEOUT", msg.id );
});

// start the worker
worker.start();