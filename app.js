var express=require("express");
var app=express();
var body_parser=require("body-parser");

app.use(body_parser.urlencoded({extended:true}));
app.use(body_parser.json());

var notice=require("./notice.js");
var feed=require("./feed.js");
noti(app);
feed(app);

app.get("/",function(req, res) {
	console.log("Hello");
	res.write("Hello");
	res.end();
});
var port = 12016;
app.listen(12016,function() {
	console.log("Listening " + port);
});