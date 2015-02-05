var fs = require( "fs" );
var path = require( "path" );

var gm = require( "gm" );
var request = require( "request" );
var config = require( "./config.json" )

module.exports = {

	listfiles: function( folder, cb ){
		
		var _path = path.resolve( folder );

		fs.readdir( _path, function( err, files ){
			if( err ){ cb( err ) }

			var _paths = []
			for( var idx = 0; idx < files.length; idx++ ){
				if( files[ idx ].indexOf( "." ) >= 1 ){
 					_paths.push( _path + "/" + files[ idx ] );
 				}
			}
			cb( null, _paths )
		});
	},
	copyFile: function(source, cb) {
		var cbCalled = false;
		var dir = path.dirname( source );
		var filename = path.basename( source );
		var target = dir + "/nosed/" + filename;
		console.log(target);
		var rd = fs.createReadStream(source);
		rd.on("error", done);

		var wr = fs.createWriteStream(target);
		wr.on("error", done);
		wr.on("close", function(ex) {
			done();
		});
		rd.pipe(wr);

		function done(err) {
			if (!cbCalled) {
				cb(err, target);
				cbCalled = true;
			}
		}
	},
	getNoses: function( file, cb ){
		var params = {
			url: "http://api.skybiometry.com/fc/faces/detect.json",
			formData: {
				api_key: config.skybiometry.key,
				api_secret: config.skybiometry.secret,
				file: fs.createReadStream( file )
			}
		}
		request.post( params, function( err, resp, body ){
			if( err ){ cb( err ) }

			var face,
				_data = JSON.parse( body ),
				_photo = _data.photos[0],
				_faces = _photo.tags,
				_noses = [];

			if( !_faces || _faces.length <= 0){
				cb( null, [] )
			}

			for( var idx = 0; idx < _faces.length; idx++ ){
				face = _faces[ idx ];
				_noses.push( { x: ( _photo.width * face.nose.x / 100 ), y:( _photo.height * face.nose.y / 100 ), w: ( _photo.width * face.width / 100 ) }  );
			}
			cb( null, _noses )
		});
	},

	placeNose: function( file, nose, cb ){
		var _placepath = path.resolve( './resources/' );

		var sizePlacement = { x: 100, y: 100 };
		var nosesize = nose.w * 0.5;
		
		gm()
		.in('-page', '+0+0')
		.in(file)
		.in('-resize', nosesize )
		.in('-page', '+' + (nose.x - (nosesize/2)) + '+' + (nose.y - (nosesize/2)) ) // location of smallIcon.jpg is x,y -> 10, 20
		.in(_placepath + "/nose.png")
		.mosaic()
		.write( file, function (err) {
			if (err) console.log(err);
			cb( null )
		});

	}
}