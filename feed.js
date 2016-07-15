var pathPrefix="/feed";

module.exports = function (app) {
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
			console.log("tags : " + req.body.tags);
		}

        res.writeHead(201);
		res.write("post request done\n");
        res.write("class : " + req.query.class);
        res.write("time : " + req.body.time);
		res.write("userid : " + req.body.userid);
		res.write("title : " + req.body.title);
		res.write("body : " + req.body.body);
		for(var i=0;i<req.body.tags.length;i++) {
			res.write("tags : " + req.body.tags);
		}
        res.end();
    });
    get("/post", function(req, res) {
        console.log("post request received");
		console.log("class : " + req.query.class);
        console.log("time : " + req.query.time);
		// console.log("userid : " + req.body.userid);
		// console.log("title : " + req.body.title);
		// console.log("body : " + req.body.body);
		// for(var i=0;i<req.body.tags.length;i++) {
		// 	console.log("tags : " + req.body.tags);
		// }

        res.writeHead(200);
		res.write("post request done\n");
        res.write("class : " + req.query.class);
        res.write("time : " + req.query.time);
		// res.write("userid : " + req.body.userid);
		// res.write("title : " + req.body.title);
		// res.write("body : " + req.body.body);
		// for(var i=0;i<req.body.tags.length;i++) {
		// 	res.write("tags : " + req.body.tags);
		// }
        res.end();
    });
}