var RSMQWorker = require( "rsmq-worker" );
var worker = new RSMQWorker( "mnug-simple", { redisPrefix: "mnug" } );

worker.on( "message", function( msg, next ){

	var msgData = JSON.parse( msg );

	switch( msgData.type ){
		case "load":
			
			break;


		case "copyFile":
			
			break


		case "findeNoses":
			
			break;


		case "placeNose":
			
			break;

	}
});

worker.on( "ready", function(){
	worker.send( '{ "type": "load" }' );
});

worker.start();
