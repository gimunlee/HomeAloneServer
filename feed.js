var pathPrefix="/noti";

module.exports = function (app) {
    var post=function(relativePath, fun) { app.post(pathPrefix+relativePath,fun); };
    var get=function(relativePath, fun) { app.get(pathPrefix+relativePath,fun); };

    post(function(req, res) {
    });
}