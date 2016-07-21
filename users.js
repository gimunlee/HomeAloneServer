// ec2-52-78-28-51.ap-northeast-2.compute.amazonaws.com:12016/users/
// localhost:12016/users/
// 143.248.48.232:12016/users/

var pathPrefix = "/users";
var util = require('util');
var usersReqCount = 0;

function reportRequest(msg) {
    require('util').log(util.format('users %d:Receiving request for %s', usersReqCount, msg));
    usersReqCount++;
}

module.exports = function (app, mongoose) {

    var choreSchema = mongoose.Schema({
        name: String, //"noname"
        choretype: String, //"notype"
        conditions: {
            day: Number, //-1
            dayofweek: Number, //-1
            weather: String //"noweather"
            //dry => 0
            //wet => 1
            //sunny => 3
            //Rainy => 4
        }
    });
    var Chore = mongoose.model('chores', choreSchema);

    var userSchema = mongoose.Schema({
        userid: String,
        nick: String,
        tags: [String],
        chores: [{
            name: String, //"noname"
            choretype: String, //"notype"
            day: Number, //-1
            dayofweek: Number, //-1
            weather: Number, //"noweather"
            lasttime: String
            //dry => 0
            //wet => 1
            //sunny => 3
            //Rainy => 4
        }],
        kind: String
    });
    var User = mongoose.model('users', userSchema);

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

    //localhost:12016/users/signin?type=fb&email=gimunlee@kaist.ac.kr
    get('/signin', function (req, res) {
        var type = req.query.type;
        var userid;

        switch (type) {
            case 'fb': userid = req.query.email; break;
        }
        reportRequest('signing in ' + userid);

        getUser(userid, req, res, function (req, res, user) {
            console.log('-> signing in of ' + user.nick);
            res.json({ "userid": userid });
        })
    });
    post('/signup', function (req, res) {
        var type = req.query.type;
        var userid;
        switch (type) {
            case 'fb': userid = req.body.email; break;
        }
        var kind = req.body.kind;
        var nick = req.body.nick;
        reportRequest('signing up ' + userid);

        User.count({ 'userid': userid }, function (err, count) {
            if (count > 0) {
                console.log('-> userid ' + userid + ' is already exist. Sending 404');
                res.writeHead(404);
                res.write('duplicated userid');
                res.end();
            }
            else {
                console.log('-> signing up {userid:' + userid + ', tags: [], kind:' + kind + ', nick:' + nick + '}');
                var user = new User({ userid: userid, tags: [], kind: kind, nick: nick, chores: [] });
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

        getUser(userid, req, res, function (req, res, user) {
            console.log('-> Sending nick ' + user.nick);
            res.send(user.nick);
        });
    });
    get('/tags', function (req, res) {
        var userid = req.query.userid;
        reportRequest('tags of ' + userid);

        getUser(userid, req, res, function (req, res, user) {
            console.log('-> Sending tags of ' + userid);
            res.json(user.tags);
        });
    });
    post('/tags', function (req, res) {
        var userid = req.query.userid;
        reportRequest('posing new tags of ' + userid);
        var newTags = req.body;
        getUser(userid, req, res, function (req, res, user) {
            console.log('-> New tags Posted : ' + JSON.stringify(newTags));
            user.tags = newTags;
            user.save();

            res.writeHead(201);
            res.write('posted');
            res.end();
        });
    });
    get('/chores', function (req, res) {
        var userid = req.query.userid;
        reportRequest('chores of ' + userid);

        getUser(userid, req, res, function (req, res, user) {
            console.log('-> Sending chores of ' + userid);
            res.json(user.chores);
            console.log(JSON.stringify(user.chores));
        })
    })
    get('/add', function (req, res) {
        var userid = req.query.email;
        var nick = req.query.nick;

        var user = new User({ userid: userid, tags: ['요리'], kind: 'diligent', nick: nick });
        user.save();
        res.send('added');
    });
    get('/chore/add', function(req, res) {
        var userid=req.query.userid;
        var name=req.query.name;
        if(name==null) name='noname';
        var choretype=req.query.choretype;
        if(choretype==null) choretype='notype';
        var day=req.query.day;
        if(day==null) day=-1;
        var dayofweek=req.query.dayofweek;
        if(dayofweek==null) dayofweek=-1;
        var weather=req.query.weather;
        if(weather==null) weather=-1;

        reportRequest('adding test chore into userid ' + userid)

        getUser(userid,req,res, function(req,res,user) {
            console.log('-> saving request values');
            user.chores.push({"name":name,"choretype":choretype,"day":Number(day),"dayofweek":Number(dayofweek),"weather":Number(weather)});
            user.save();
            res.send('saved');
        })
    });
    post('/chore', function(req, res) {
        var userid=req.query.userid;
        reportRequest('updating chore into userid ' + userid);

        getUser(userid, req, res, function(req, res, user) {
            console.log('-> updating request chore');
            var id=req.body.id;
            var foundChores=user.chores.filter(function(chore) {
                return chore._id ==id; 
            });
            if(foundChores.length==0) {
                console.log('new Chore');
                user.chores.push({"name":req.body.name,
                                "choretype":req.body.choretype,
                                "day":req.body.day,
                                "dayofweek":req.body.dayofweek,
                                "weather":req.body.weather});
            }
            else {
                console.log('updating chore');
                var index=user.chores.indexOf(foundChores[0]);
                console.log('indexof foundchore = '+index);
                user.chores[index].name=req.body.name;
                user.chores[index].day=req.body.day;
                user.chores[index].dayofweek=req.body.dayofweek;
                user.chores[index].weather=req.body.weather;
            }
            console.log(JSON.stringify(user.chores));
            user.save();
            res.send('updated');
        });
    })
}