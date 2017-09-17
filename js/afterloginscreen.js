var AfterLoginScreen = Backbone.View.extend({
  template: _.template($('#after-login').text()),
  events: {
	'click #address-button': 'showQRCodeAddress',
	'click #pubkey-button': 'showQRCodePubkey',
	'click #privkey-button': 'showQRCodePrivkey',
	'click #transaction-button': 'scanRawTx',
	'click .show-modal': 'showMDLModal',
	'click #bitcoin-dialog .hide-modal': 'hideMDLModal',
	'click #about-dialog2 .hide-modal': 'hideAbout',
	'click #log-out': 'logOut',
	'click #sign-button': 'signButton',
	'click #about-button': 'showAboutData',
	'click #warp-formula' : 'showWarp',
	'click #close-error' : 'hideErrorModal', 
  },
  initialize: function() {
	var master = this;

	this.model.on('signed', function() {
	  var tx = master.model.getTx();
	  console.log(tx);
	  master.showQRCodeData('signed TX', tx.raw, _.any(tx.remaining, function(t) { return !!t }) ? "no" : "yes");
	  master.showMDLModal();
	});
	window.addEventListener('resize', function(event){
	  $('.bitcoin-address-in-navbar').html(master.model.getAddress());
	  master.resizeTitle();
	});
  },
  resizeTitle: function() {
	var master = this;
	var winSize = $(window).width();
	var addressSize = $('.bitcoin-address-in-navbar').width();
	if ((addressSize + 167 > winSize) && winSize > 200) {
	  var currentAddress = $('.bitcoin-address-in-navbar').html();
	  $('.bitcoin-address-in-navbar').html(currentAddress.substr(0, currentAddress.length - 6 ) + '...');
	  if (addressSize + 167 > winSize) {
		master.resizeTitle();
	  }
	} else if (winSize < 200) {
	  $('.bitcoin-address-in-navbar').html('');
	}
  },
  showWarp: function() {
	$('#warp-formula-img', this.el).toggle();
  },
  showQRCodeData: function(title, data, comment) {
	var master = this;
	var maxLen = 1000;
	qrNumber = Math.ceil(data.length / maxLen);
	qrData = chunkString(data, Math.ceil(data.length / qrNumber));
	$('#data-qrcode', this.el).attr('value', data)
	$('#qrcode', this.el).empty();
	if (qrData.length > 1) {
	  $('#account-data-label', this.el).append(' ' + qrData.length + ' QRCodes');
	};
	_.each(qrData, function(data, i) {
	  $('#qrcode', this.el).append('<div ' + (i ? 'style="margin-top:' + $(window).height()/4 + 'px"' : '') + 'class="form-group qr-code" id="qrcode-' + i + '"></div>');
	  var qrPkey = new QRCode("qrcode-" + i, {width: 360, height: 360,correctLevel : QRCode.CorrectLevel.L, colorDark : 'black'});
	  qrPkey.makeCode(data);
	});
	$('#data-qrcode', this.el).html(data);
	comment && $('#account-data-label').text(title + (comment ? (' ( complete: ' + comment + ')') : '' ));
  },
  showAboutData: function(title, data) {
	var master = this;
	$('#title-qrcode', this.el).attr('value', data)
	$('#title-qrcode', this.el).html(data);
	$('#account-data-label', this.el).text(title);
	//$('input ', this.el).remove();
	//$('#about-data', this.el).html($('#about-page').html)
	var dialog = document.querySelector('#about-dialog2');
	if (! dialog.showModal) {
	  dialogPolyfill.registerDialog(dialog);
	}
	dialog.showModal();
	$('#about-dialog2').addClass("open");
  },
  showQRCodeAddress: function() {
	var address = this.model.getAddress();
	this.showQRCodeData('Address', address)
  },
  showQRCodePubkey: function() {
	var pubKey = this.model.getPubKey();
	this.showQRCodeData('Public Key', pubKey)
  },
  showQRCodePrivkey: function() {
	var privKey = this.model.getWIF();
	this.showQRCodeData('Private Key', privKey);
  },
  showMDLModal: function() {
	var dialog = document.querySelector('#bitcoin-dialog');
	if (! dialog.showModal) {
	  dialogPolyfill.registerDialog(dialog);
	}
	dialog.showModal();
	$('#bitcoin-dialog').addClass("open");
  },
  showErrorModal: function() {
  	var dialog = document.querySelector('#sign-transation-error-dialog');
	if (! dialog.showModal) {
	  dialogPolyfill.registerDialog(dialog);
	}
	dialog.showModal();
	$('#sign-transation-error-dialog').addClass("open");
  },
  hideErrorModal: function() {
	$('#sign-transation-error-dialog', this.el).removeClass("open");
	setTimeout(function(){
	  document.querySelector('#sign-transation-error-dialog').close();
	}, 300);
  },
  hideAbout: function() {
	$('#about-dialog2', this.el).removeClass("open");
	setTimeout(function(){
	  document.querySelector('#about-dialog2').close();
	}, 300);
  },
  hideMDLModal: function() {
	$('#bitcoin-dialog', this.el).removeClass("open");
	setTimeout(function(){
	  document.querySelector('#bitcoin-dialog').close();
	}, 300);
	$('#bitcoin-dialog > .mdl-dialog__content').html('\
	  <input type="text" class="mdl-textfield__input" disabled id="data-qrcode">\
	  <p class="" id="about-data"></p>\
	  <div class="form-group qr-code" id="qrcode"></div>')
  },
  logOut: function() {
	// TODO: Empty the cache
  },
  scanRawTx: function() {
  	var master = this;
	var model = this.model;
	try {
		cordova.plugins.barcodeScanner.scan(function(result) {
			var r = model.signRawTx(result.text);
			if (!r || !r.doneAnything) {
				master.showErrorModal();
			}
		});
	} catch(err) {
	  console.log(err);
	}
  },
  render: function() {
	var master = this;
	var def = $.Deferred();
	var data = master.getData();

	this.$el.html(master.template(data));
	return def.resolve(this);
  },
  getData: function() {
	var master = this;
	return {
	  wif : master.model.getWIF(),
	  pubkey : master.model.getPubKey(),
	  address : master.model.getAddress(),
	};
  },
  signButton: function() {
	var master = this;
	try {
	  cordova.plugins.barcodeScanner.scan(function(result) {
		var sig = master.model.getSig(result.text);
		master.showQRCodeData('Sig', sig)
		master.showMDLModal();
	  });
	} catch(err) {
	  console.log(err);
	}
  },
});
