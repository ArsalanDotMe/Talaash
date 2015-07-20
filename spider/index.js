var _ = require('lodash');
var cheerio = require('cheerio');

exports = function (specs) {
    var that, fieldParsers = new Map();

    var settings = _.defaults(specs, {
        allowQueryParams: false,
        allowedSchemes: ['http', 'https'],
        allowedQueryParams: [],
        obeyNofollow: true,
		constrainToRootDomains: true,
        whitelist: [],
        blacklist: []
    });

    function parseField(fieldName, func) {
        if (!_.isFunction(func)) {
            throw new TypeError('parseField expected parameter of type Function(response, $). Instead got ' + typeof(func));
        }
        fieldParsers.set(fieldName, func);
    }

    function parse(response) {
        var parsedItem = new Map();
        var $ = cheerio.load(response.body);
        fieldParsers.forEach(function (parser, fieldName) {
            var parsedValue = parser(response, $);
            parsedItem[fieldName] = parsedValue;
        });
        return parsedItem;
    }

    that = Object.create({
        settings: settings,
        parseField: parseField,
        parse: parse
    });

    return that;
};
