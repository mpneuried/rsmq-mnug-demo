// read the configuration
var CONFIG = require("./config.json");

// init RSMQ
var RSMQueue = require("rsmq");
var rsmq = new RSMQueue( { ns: "mnug" } );

// CREATE Queue
rsmq.createQueue( {qname: CONFIG.qname}, function( err ){

	// the queue possibily already exists
	if(err && err.name !== "queueExists"){
		console.log("create queue", err);
		return;
	}

	// get the current message count
	rsmq.getQueueAttributes( {qname: CONFIG.qname}, function( err, meta ){
		if( err ){
			console.log("get queue attributes", err);
			return;
		}
		console.log("Message-count: ", meta.msgs, "\nMessage-hidden: ", meta.hiddenmsgs );

		// exit the script on end
		rsmq.quit();
	});	
});