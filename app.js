var express=require("express");
var app=express();

var noti=require("./noti.js");
noti(app);

app.get("/",function(req, res) {
	console.log("Hello");
	res.write("Hello");
	res.end();
});
var port = 12016;
app.listen(12016,function() {
	console.log("Listening " + port);
});
