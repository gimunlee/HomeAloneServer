var pathPrefix="/notice";

module.exports = function (app, mongoose) {
	var post=function(relativePath, fun) { app.post(pathPrefix+relativePath,fun); };
	var get=function(relativePath, fun) { app.get(pathPrefix+relativePath,fun);	};

	var noticeSchema=mongoose.Schema({
		name:String, //"noname"
		type:String, //"notype"
		conditions:{
			day:Number, //-1
			dayofweek:Number, //-1
			date:String, //"nodate"
			aftermincount:{
				name:String, //"noname"
				mincount:Number //-1
			},
			weather:String //"noweather"
		},
		tipkey:String, //"notipkey"
		memo:String //"nomemo"
	})
	var Notice=mongoose.model('notices',noticeSchema);

	post("/post", function(req, res) {
		res.write("post what?");
		res.end();
	});
	get("/", function(req, res) {
		res.write("This is notice");
		res.end();
	});
	//http://localhost:12016/notice/testpostwithquery?name=noname&type=notype&condition_day=-1&condition_dayofweek=-1&condition_date=nodate&condition_aftermincount_name=noname&condition_aftermincount_mincount=-1&condition_weather=noweather&tipkey=notipkey&memo=nomemo
	get("/testpostwithquery", function(req, res) {
		var name=req.query.name;
		var type=req.query.type;
		var condition_day=req.query.condition_day;
		var condition_dayofweek=req.query.condition_dayofweek;
		var condition_date=req.query.condition_date;
		var condition_aftermincount_name=req.query.condition_aftermincount_name;
		var condition_aftermincount_mincount=req.query.condition_aftermincount_mincount;
		var condition_weather=req.query.condition_weather;
		var tipkey=req.query.tipkey;
		var memo=req.query.memo;

		var testNotice=new Notice({
			name:name,
			type:type,
			conditions:{
				day:condition_day,
				dayofweek:condition_dayofweek,
				date:condition_date,
				aftermincount:{
					name:condition_aftermincount_name,
					mincount:condition_aftermincount_mincount
				},
				weather:condition_weather
			},
			tipkey:tipkey,
			memo:memo
		});
		testNotice.save();

		res.write("name: "+name+"\n");
		res.write("type: "+type+"\n");
		res.write("conditions {\n");
		res.write("\t"+"day:"+condition_day+"\n");
		res.write("\t"+"dayofweek:"+condition_dayofweek+"\n");
		res.write("\t"+"date:"+condition_date+"\n");
		res.write("\t"+"aftermincount {\n");
		res.write("\t"+"\t"+"name"+condition_aftermincount_name+"\n");
		res.write("\t"+"\t"+"mincount"+condition_aftermincount_mincount+"\n");
		res.write("\t"+"}"+"\n");
		res.write("\t"+"weather:"+condition_weather+"\n");
		res.write("}\n");
		res.write("tipkey:"+tipkey+"\n");
		res.write("memo:"+memo+"\n");
		res.end();
	});
};