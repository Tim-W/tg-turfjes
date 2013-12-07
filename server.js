var connect = require('connect'),
	mongoose = require('mongoose');

var mongoose = require('mongoose');
mongoose.connect('mongodb://nodejitsu_tim_w:dgimci30k9vscdc105t9d3ciqi@ds045998.mongolab.com:45998/nodejitsu_tim_w_nodejitsudb9751160156', function(err) {
	if (err) {
		throw err;
	} else {
		console.log('connected to mongodb!');
	}
});

var app = connect().use(connect.static(__dirname));
var server = app.listen(80);
var io = require('socket.io').listen(server);

var naamSchema = mongoose.Schema({
	naam: String,
	turfjes: Number
});

var Naam = mongoose.model('naam', naamSchema);

io.sockets.on('connection', function (socket) {
	socket.on('kom maar op', function(data) {
		Naam.find({}, function(err, docs) {
			if(err) {
				throw err;
			} else {
				var i = 0;
				docs.forEach(function() {
					socket.emit('naam', {
						naam: docs[i].naam,
						turfjes: docs[i].turfjes
					});
					i++;
				});
			}
		});
	});
	socket.on('naam toegevoegd', function(data) {
		var NaamDB = new Naam({
			naam: data.naam,
			turfjes: data.turfjes
		});

		NaamDB.save(function(err) {
			if (err) throw err;
			console.log('naam opgeslagen...')
		});
	});
});