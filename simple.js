var RSMQWorker = require( "rsmq-worker" );
var worker = new RSMQWorker( "mnug-simple", { redisPrefix: "mnug" } );

var tasks = require( "./tasks" )

worker.on( "message", function( msg, next ){

	var msgData = JSON.parse( msg );

	switch( msgData.type ){
		case "load":
			tasks.listfiles( "./input", function( err, files ){
				if( err ){ next( false ); }

				console.log( "found files:", files.length );
				
				for( var idx = 0; idx < files.length; idx++ ){

					worker.send( '{ "type": "copyFile", "file": "' + files[ idx ] + '"}' );

				}
				next();
			});
			break;
		case "copyFile":
			tasks.copyFile( msgData.file, function( err, file ){
				if( err ){ next( false ); }
				console.log( "copy file:", msgData.file );
				worker.send( '{ "type": "findeNoses", "file": "' + file + '"}' );
				next();
			});
			break
		case "findeNoses":
			tasks.getNoses( msgData.file, function( err, noses ){
				if( err ){ next( false ); }

				if( noses.length <= 0 ){
					next();
				}
				console.log( "found noses:", noses.length, msgData.file );
				for( var idx = 0; idx < noses.length; idx++ ){
					worker.send( JSON.stringify( { type: "placeNose", file: msgData.file, nose: noses[ idx ]} ) );
				}
				next();
			});
			break;
		case "placeNose":
			tasks.placeNose( msgData.file, msgData.nose, function( err ){
				if( err ){ next( false ); }
				console.log("placed nose", msgData.file, msgData.nose);
				next();
			});
			break;
	}
});

worker.on( "ready", function(){
	worker.send( '{ "type": "load" }' );
});

worker.start();
