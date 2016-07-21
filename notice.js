var pathPrefix = "/notice";

function reportRequest(msg) {
    require('util').log(util.format('users %d:Receiving request for %s', usersReqCount, msg));
    usersReqCount++;
}

module.exports = function (app, mongoose) {
	var post = function (relativePath, fun) { app.post(pathPrefix + relativePath, fun); };
	var get = function (relativePath, fun) { app.get(pathPrefix + relativePath, fun); };

	function getUser(userid, req, res, callback) {
        User.findOne({ 'userid': userid }, function (err, user) {
            if (err) return handleError(err);
            if (user == null) {
                console.log('-> Unknown userid [' + userid + ']. sending 404');
                res.writeHead(404);
                res.write('unknown userid ' + userid);
                res.end();
            }
            else
                callback(req, res, user);
        })
    }

	var noticeSchema = mongoose.Schema({
		name: String, //""
		type: String, //"notype"
		starttime: String,
		weather: String,
		weatherrecomdate: String,
		completed:Boolean
		//"noweater"
		//dry => 0
		//wet => 1
		//sunny => 3
		//Rainy => 4
		// tipkey:String, //"notipkey"
		// memo:String //"nomemo"
	})
	var Notice = mongoose.model('notices', noticeSchema);

	function addDaysToTime(from, delta) {
		var date = Number(from.split(" ")[0]);
		var time = Number(from.split(" ")[1]);
		return (date + delta).toString() + " " + time;
	}
	function subTimesForDays(from, to) {
		var dateTo = Number(to.split(" ")[0]);
		var dateFrom = Number(from.split(" ")[0]);
		return dateTo - dateFrom;
	}
	get("/", function (req, res) {
		var userid = req.query.userid;
		var reqtime = req.query.reqtime;
		var includeDone=true;
		var includeYet=true;

		reportRequest('notices for the time ' + reqtime + ' from userid ' + userid);

		var query = Notice.find({});

		query=query.where("starttime").lte(reqtime); //Occured notices on the past
		query.then(function(notices) {
			var i=notices.count-1;
			for(; i>=0; i--) {
				var notice=notices[i];
				if(includeDone==false && notice.completed) {
					notices.splice(i,1);
					continue;
				}
				if(includeYet== fase && !(notice.completed)) {
					notices.splice(i,1);
					continue;
				}
			}
		});
	});
	post('/completed',function(req, res) {
		var id=req.query.id;
		Notice.findOne({'_id':id}).then(function(notice) {
			notice.completed=true;
			notice.save();
			res.send('completed');
		});
	});
	// post("/newnotice", function(req, res) {
	// 	var name=req.body.name;
	// 	var type=req.body.type;
	// 	var condition;
	// });
	// //http://localhost:12016/notice/testpostwithquery?name=noname&type=notype&condition_day=-1&condition_dayofweek=-1&condition_date=nodate&condition_aftermincount_name=noname&condition_aftermincount_mincount=-1&condition_weather=noweather&tipkey=notipkey&memo=nomemo
	// get("/testpostwithquery", function(req, res) {
	// 	var name=req.query.name;
	// 	var type=req.query.type;
	// 	var condition_day=req.query.condition_day;
	// 	var condition_dayofweek=req.query.condition_dayofweek;
	// 	var condition_date=req.query.condition_date;
	// 	// var condition_aftermincount_name=req.query.condition_aftermincount_name;
	// 	// var condition_aftermincount_mincount=req.query.condition_aftermincount_mincount;
	// 	var condition_weather=req.query.condition_weather;
	// 	var tipkey=req.query.tipkey;
	// 	var memo=req.query.memo;

	// 	var testNotice=new Notice({
	// 		name:name,
	// 		type:type,
	// 		conditions:{
	// 			day:condition_day,
	// 			dayofweek:condition_dayofweek,
	// 			date:condition_date,
	// 			// aftermincount:{
	// 			// 	name:condition_aftermincount_name,
	// 			// 	mincount:condition_aftermincount_mincount
	// 			// },
	// 			weather:condition_weather
	// 		},
	// 		tipkey:tipkey,
	// 		memo:memo
	// 	});
	// 	testNotice.save();

	// 	res.write("name: "+name+"\n");
	// 	res.write("type: "+type+"\n");
	// 	res.write("conditions {\n");
	// 	res.write("\t"+"day:"+condition_day+"\n");
	// 	res.write("\t"+"dayofweek:"+condition_dayofweek+"\n");
	// 	res.write("\t"+"date:"+condition_date+"\n");
	// 	// res.write("\t"+"aftermincount {\n");
	// 	// res.write("\t"+"\t"+"name"+condition_aftermincount_name+"\n");
	// 	// res.write("\t"+"\t"+"mincount"+condition_aftermincount_mincount+"\n");
	// 	// res.write("\t"+"}"+"\n");
	// 	res.write("\t"+"weather:"+condition_weather+"\n");
	// 	res.write("}\n");
	// 	res.write("tipkey:"+tipkey+"\n");
	// 	res.write("memo:"+memo+"\n");
	// 	res.end();
	// });
};