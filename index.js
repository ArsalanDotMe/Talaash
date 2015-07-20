var async = require('async');
var tld = require('url');
var defaultDownloader = require('./downloader/default');
module.exports = function (opts) {
    var that, registeredSpiders = {}, registeredPipelines = [];

    var settings = _.defaults(specs, {
        concurrentSpiders: 1,
        downloader: defaultDownloader
    });


    function crawl() {
        async.eachLimit(_.values(registeredSpiders), settings.concurrentSpiders,
            function (spider, done) {
                var downloader = settings.downloader;
                // download the starting url for each spider
                async.waterfall([
                    function (callback) {
                        // download the webpage
                        downloader.download(spider.settings.startUrl, callback);
                    },
                    function (response, callback) {
                        // send it to be parsed
                        var parsedItem = registeredSpiders[spider.settings.domain].parse(response);
                        callback(null, parsedItem);
                    },
                    function (parsedItem, callback) {
                        // execute all pipelines on it one by one
                        async.each(registeredPipelines,
                            function (pipeline, callback) {
                                pipeline.execute(parsedItem, callback);
                            },
                            callback
                        );
                    }
                ], done);
            }, function (err) {
                // log errors
                console.error(err);
            }
        );
    };

    function addSpider(spider) {
        registeredSpiders[spider.settings.domain] = spider;
    }

    function addPipeline(pipeline) {
        registeredPipelines.push(pipeline);
    }

    that = Object.create({
        spider: require('./spider'),
        addSpider: addSpider
        crawl: crawl
    });

    return that;
};
