/*
 * jQuery Core Functions 
 *
 * Copyright (c) 2006, 2007, 2008 Thomas Garrood
 * 
 * Depends:
 *
 */

function parseParams (url) 
{
	var params = url;
	var pHash = {};
	if (url.indexOf('?') > 0) {
		if (url.match(/\?(.+)$/)) {
			// in case it is a full query string with ?, only take
			// everything after the ?
			params = RegExp.$1;
		}
		var pArray = params.split("&");
		for ( var i = 0; i < pArray.length; i++) {
			var temp = pArray[i].split("=");
			pHash[temp[0]] = unescape(temp[1]);
		}
	}
	return pHash;
}

