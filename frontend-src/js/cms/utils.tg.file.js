

	Tg.FileUtils = {};
	Tg.FileUtils.getExtension = function (filename) {
		//c(filename);
		var ext = /^.+\.([^.]+)$/.exec(filename);
		return ext == null ? "" : new String(ext[1]).toLowerCase();
	};