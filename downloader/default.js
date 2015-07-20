var sa = require('superagent');

exports = function (spec) {
    var that;

    function download(url, done) {
        sa.get(url).end(done);
    }

    that = Object.create({
        download: download
    });

    return that;
};
