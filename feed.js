// ec2-52-78-28-51.ap-northeast-2.compute.amazonaws.com:12016/feed/
// localhost:12016/feed/

var pathPrefix="/feed";
var moment=require("moment");

module.exports = function (app, mongoose) {
    var myLogSchema=mongoose.Schema({
        class: String,
        time: String
    });
    var MyLog = mongoose.model('testlogs',myLogSchema);

    var articleSchema=mongoose.Schema({
        userid:String,
        title:String,
        body:String,
        tags:[String],
        time:String
    });
    var Article=mongoose.model('articles',articleSchema);

    var post=function(relativePath, fun) { app.post(pathPrefix+relativePath,fun); };
    var get=function(relativePath, fun) { app.get(pathPrefix+relativePath,fun); };
    
    // localhost:12016/feed/articles
    post("/articles", function(req, res) {
        var userid=req.body.userid;
        var title=req.body.title;
        var body=req.body.body;
        var tags=req.body.tags;
        var time=moment().utc().format('YYYYMMDD HHmmss');
        console.log("-> Receiving post for an article");
        var article = new Article({
            userid:userid,
            title:title,
            body:body,
            tags:tags,
            time:time,
        });
        article.save();

        console.log("-> Sending posted article");
        res.write("userid:"+userid+"\n");
        res.write("title:"+title+"\n");
        res.write("body:"+body+"\n");
        res.write("tags:"+tags+"\n");
        res.write("time:"+time);
        res.end();
    });
    // localhost:12016/feed/posttestarticle
    get("/posttestarticle", function(req, res) {
        var userid=req.query.userid;
        var title=req.query.title;
        var body=req.query.body;
        var tags=req.query.tags.concat(['test']);
        var time=moment().utc().format('YYYYMMDD HHmmss');
        console.log("-> Receiving post for a test article");
        var testArticle = new Article({
            userid:userid,
            title:title,
            body:body,
            tags:tags,
            time:time,
        });
        testArticle.save();
        
        console.log("-> Sending posted article");
        res.write("userid:"+userid+"\n");
        res.write("title:"+title+"\n");
        res.write("body:"+body+"\n");
        res.write("tags:"+tags+"\n");
        res.write("time:"+time);
        res.end();
    });
    // localhost:12016/feed/articles
	get("/articles", function (req, res) {
        var query=Article.find({});
        var outputLog='';

        // console.log(req.query.tags);
        outputLog="-> Receiving request for articles";
        if(req.query.userid!=null) {
            var userid=req.query.userid;
            outputLog=outputLog+" of userid " + userid;
            query=query.where("userid").equals(userid);
        }
        if(req.query.tags!=null) {
            var tags=req.query.tags;
            outputLog=outputLog+" with tags " + tags;
            query=query.where("tags").in(tags);
        }
        if(req.query.after!=null) {
            var after=req.query.after;
            outputLog=outputLog+" after " + after;
            query=query.where("time").gte(after);
        }
        if(req.query.before!=null) {
            var before=req.query.before;
            outputLog=outputLog+" before " + before;
            query=query.where("time").lte(before);
        }
        console.log(outputLog);
        query.then(function(articles) {
            console.log("-> Sending " + articles.length + " articles");
            res.json(articles);
        });
	});
    // localhost:12016/feed/testarticles
    get("/testarticles", function (req, res) {
        console.log("-> Receiving request for test articles");
        Article.find({"tags":'test'}, function(err, articles) {
            console.log("-> Sending " + articles.length + " articles");
            res.json(articles);
        });
    });
    // localhost:12016/feed/time
    get("/time", function(req, res) {
        console.log('now : ' + moment().format('YYYYMMDD HHmmss Z'));
        console.log('utc : ' + moment().utc().format('YYYYMMDD HHmmss Z'));
        console.log("-> Sending UTC time : " + moment().utc().format("YYYYMMDD HHmmss Z"));
        res.send(moment().utc().format("YYYYMMDD HHmmss Z"));
    });
}