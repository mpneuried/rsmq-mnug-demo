var RSMQueue = require("rsmq");
var fs = require("fs");

// read the configuration
var CONFIG = require("./config.json");

// init RSMQ
var rsmq = new RSMQueue( { ns: "mnug" } );

var fnStart = function(){

	// read the files from the input folder
	fs.readdir( CONFIG.inputFolder, function( err, files ){
		var idx, filepath;

		if( err ){
			console.log("read folder", err);
			return;
		}

		// create a message for each file
		for( idx = 0; idx < files.length; idx++ ){
			
			filepath = CONFIG.inputFolder + files[idx];

			// send the file to the queue
			rsmq.sendMessage( {qname:CONFIG.qname, message:filepath}, function (err) {
			
				if ( err ) {
					console.log("send message", err );
					return;
				}
			
				console.log("FILE QUEUED", filepath);
			});
		}
	});
};


// Try to create the queue
rsmq.createQueue( {qname: CONFIG.qname}, function( err ){

	// the queue possibily already exists
	if(err && err.name !== "queueExists"){
		console.log("create queue", err);
		return;
	}

	// start writing queue messages
	fnStart();
});