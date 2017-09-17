var Wallet = Backbone.Model.extend({
	defaults: {
		wif : null,
		pctCompleted: 0,
		tx: null,
	},
	getWIF: function() {
		return this.get('wif');
	},
	getAddress : function() {
		var wif = this.getWIF();
		return wif ? bitcoin.ECPair.fromWIF(wif).getAddress() : null;
	 },
	getPubKey: function() {
		var wif = this.getWIF();
		return wif ? bitcoin.ECPair.fromWIF(wif).getPublicKeyBuffer().toString('hex') : null;
	},
	getPct: function() {
		return this.get('pctCompleted');
	},
	setPct: function(pct) {
		this.set('pctCompleted', pct);
 	},
	setWIF: function(wif) {
		this.set('wif', wif);
	},
	getTx: function() {
		return this.get('tx');
 	},
	setTx: function(tx) {
		this.set('tx', tx);
	},
	warp: function(pass, salt) {
		var master = this;
		var then = function(res) {
			master.setPct(0);
			master.setWIF(res)
			master.trigger('generated');
		};
		if (isPkey(pass)) {
			then(pass);
		};
		var hook = function(pct) {
			var value = (Math.floor(100 * (((pct.what == 'pbkdf2' ? 524288 : 0) + pct.i) / (524288 + 65536))));
			master.setPct(value);
		};

		warp(hook, pass, salt, then)
	},
  signRawTx: function(rawTx) {
	var pkey = this.getWIF();
	var signedTx = signRawTx(rawTx, pkey);
	if (signedTx.doneAnything && signedTx.raw != rawTx) {
		this.setTx(signedTx);
		this.trigger('signed');
		return true
	} else {
		if (!signedTx.doneAnything) {
			return false
		}
	}
  },
  getSignature(message) {
	var wif = this.getWIF();
	var keyPair = bitcoin.ECPair.fromWIF(wif);
	var privateKey = keyPair.d.toBuffer(32);
	var messagePrefix = bitcoin.networks.bitcoin.messagePrefix;
	var signature = bitcoinMessage.sign(message, messagePrefix, privateKey, keyPair.compressed)
	return signature.toString('base64');
  }
});
