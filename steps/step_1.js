var RSMQWorker = require( "rsmq-worker" );
var worker = new RSMQWorker( "mnug-simple", { redisPrefix: "mnug" } );

worker.on( "message", function( msg, next ){

});

worker.on( "ready", function(){

});
