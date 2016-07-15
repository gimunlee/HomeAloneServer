// ec2-52-78-28-51.ap-northeast-2.compute.amazonaws.com:12016/feed/
var pathPrefix="/feed";

module.exports = function (app, mongoose) {
    var post=function(relativePath, fun) { app.post(pathPrefix+relativePath,fun); };
    var get=function(relativePath, fun) { app.get(pathPrefix+relativePath,fun); };

    post("/post", function(req, res) {
        console.log("post request received");
		console.log("class : " + req.query.class);
        console.log("time : " + req.query.time);
		console.log("userid : " + req.body.userid);
		console.log("title : " + req.body.title);
		console.log("body : " + req.body.body);
		for(var i=0;i<req.body.tags.length;i++) {
			console.log("tags : " + req.body.tags[i]);
		}

        res.writeHead(201);
		res.write("post request done\n");
        res.write("class : " + req.query.class);
        res.write("time : " + req.query.time);
		res.write("userid : " + req.body.userid);
		res.write("title : " + req.body.title);
		res.write("body : " + req.body.body);
		for(var i=0;i<req.body.tags.length;i++) {
			res.write("tags : " + req.body.tags[i]);
		}
        res.end();
    });
    get("/",function(req, res) {
        console.log("req.class, req.time logged in mongodb");
        var myLogSchema=mongoose.Schema({
            class: String,
            time: String
        });
        var MyLog = mongoose.model('MyLog',myLogSchema);
        var first = new MyLog({class:req.query.class, time:req.query.time});
        first.save(function(err, first) {
            if(err) return console.error(err);
            console.log(first.toString() + " sent");
        });
    });
}