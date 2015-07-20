var talaash = require('../../lib/talaash');

var HNSpider = talaash.spider({
    domain: 'HNSpider.pk',
    startUrl: 'http://HNSpider.pk'
});

HNSpider.parseField('title', function (resonse, $) {
    var title = $('meta[property="og:title"]').attr('content');
	return title;
});

HNSpider.parseField('description', function(response, $) {
	var desc = $('meta[property="og:description"]').attr('content');
	return desc;
});

HNSpider.parseField('price', function(response, $) {
    var price = $('[itemprop="price"]').text();
	return price;
});

HNSpider.parseField('image', function(response, $) {
	var fullUrl, img;
	img = $('meta[property="og:image"]').attr('content');
	if (img) {
		fullUrl = url.resolve(homePage, img);
		return fullUrl;
	}
});

exports = HNSpider;
