
module.exports = function (opts) {
    var that;

    that = Object.create({
        siteParser: require('./siteParser')
    });

    return that;
};
