// ec2-52-78-28-51.ap-northeast-2.compute.amazonaws.com:12016/users/
// localhost:12016/users/
// 143.248.48.232:12016/users/

var pathPrefix = "/users";
var util=require('util');
var usersReqCount=0;

function reportRequest(msg) {
    require('util').log(util.format('users %d:Receiving request for %s',usersReqCount,msg));
    usersReqCount++;
}

module.exports = function (app, mongoose) {

    var userSchema = mongoose.Schema({
        userid: String,
        nick: String,
        tags: [String],
        kind: String
    });
    var User = mongoose.model('users', userSchema);

    var post = function (relativePath, fun) { app.post(pathPrefix + relativePath, fun); };
    var get = function (relativePath, fun) { app.get(pathPrefix + relativePath, fun); };

    function getUser(userid, req,res,callback) {
        User.findOne({'userid':userid}, function(err, user) {
            if(err) return handleError(err);
            if(user==null) {
                console.log('-> Unknown userid [' + userid +']. sending 404');
                res.writeHead(404);
                res.write('unknown userid ' + userid);
                res.end();
            }
            else
                callback(req,res,user);
        })
    }

    //localhost:12016/users/signin?type=fb&email=gimunlee@kaist.ac.kr
    get('/signin', function (req, res) {
        var type = req.query.type;
        var userid;

        switch (type) {
            case 'fb': userid = req.query.email; break;
        }
        reportRequest('signing in ' + userid);

        getUser(userid,req,res,function(req,res,user) {
            console.log('-> signing in of ' + user.nick);
            res.send('Hello, '+ user.nick);
        })
    });
    post('/signup', function(req, res) {
        var type = req.query.type;
        var userid;
        switch(type) {
            case 'fb': userid= req.body.email; break;
        }
        var kind=req.body.kind;
        var nick=req.body.nick;
        reportRequest('signing up ' + userid);

        User.count({'userid':userid}, function(err, count) {
            if(count>0) {
                console.log('-> userid ' + userid + ' is already exist. Sending 404');
                res.writeHead(404);
                res.write('duplicated userid');
                res.end();
            }
            else {
                console.log('-> signing up {userid:'+userid+', tags: [], kind:'+kind+', nick:'+nick+'}');
                var user = new User({ userid: userid, tags: [], kind:kind, nick:nick});
                user.save();
                res.writeHead(201);
                res.write('signed up');
                res.end();
            }
        });
    })
    get('/nick', function (req, res) {
        var userid = req.query.userid;
        reportRequest('nick of ' + userid);

        getUser(userid,req,res,function(req,res,user) {
            console.log('-> Sending nick ' + user.nick);
            res.send(user.nick);
        });
    });
    get('/tags', function (req, res) {
        var userid = req.query.userid;
        reportRequest('tags of ' + userid);

        getUser(userid,req,res,function(req,res,user) {
            console.log('-> Sending tags of ' + userid);
            res.json(user.tags);
        });
    });
    post('/tags', function (req, res) {
        var userid = req.query.userid;
        reportRequest('posing new tags of ' + userid);
        var newTags = req.body.tags;
        getUser(userid,req,res,function(req,res,user) {
            console.log('-> New tags Posted : ' + JSON.stringify(newTags));
            user.tags=newTags;
            user.save();

            res.writeHead(201);
            res.write('posted');
            res.end();
        });
    });
    get('/add', function (req, res) {
        var userid = req.query.email;
        var nick = req.query.nick;

        var user = new User({ userid: userid, tags: ['test'], kind: 'lazy', nick: nick });
        user.save();
        res.send('added');
    });
}