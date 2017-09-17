scan = function(f) {
	var text = window.prompt('text');
	var result = {
		text: text
	};
	return f(result)
};

var cordova = {
	plugins: {
		barcodeScanner: {
			scan: scan
		}
	}
}

warpwallet.run = function(params, then) {
	var pct = {
		i: 300000
	};
	params.progress_hook(pct)

	var f = function() {
		var pct = {
		i: 500000
		};
		params.progress_hook(pct)
	};
	var f2 = function() {
		var res = {private: '5JaxtfLpwu2htdswVqTPHLa9sX6CxxFPSbiD3kHh5HfuwA9Xewa'}
		return then(res)
	}
	setTimeout(f, 1000);
	setTimeout(f2, 2000);
};
