var pathPrefix="/noti";

module.exports = function (app) {
	var post=function(relativePath, fun) { app.post(pathPrefix+relativePath,fun); };
	var get=function(relativePath, fun) { app.get(pathPrefix+relativePath,fun);	};
	post("/post", function(req, res) {
		res.write("Give me data to add");
		res.end();
	});
	get("/", function(req, res) {
		res.write("This is noti");
		res.end();
	});
};