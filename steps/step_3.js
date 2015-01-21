var RSMQWorker = require( "rsmq-worker" );
var worker = new RSMQWorker( "mnug-simple", { redisPrefix: "mnug" } );

var tasks = require( "./tasks" )

worker.on( "message", function( msg, next ){

	var msgData = JSON.parse( msg );

	switch( msgData.type ){

		case "load":
			tasks.listfiles( "./input", function( err, files ){
				
				next();
			});
			break;


		case "copyFile":
			tasks.copyFile( msgData.file, function( err, file ){
					
				next();
			});
			break


		case "findeNoses":
			tasks.getNoses( msgData.file, function( err, noses ){
				
				next();
			});
			break;


		case "placeNose":
			tasks.placeNose( msgData.file, msgData.nose, function( err ){

				next();
			});
			break;

			
	}
});

worker.on( "ready", function(){
	worker.send( '{ "type": "load" }' );
});

worker.start();
