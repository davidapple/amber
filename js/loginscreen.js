var LoginScreen = Backbone.View.extend({
  template: _.template($('#login-screen').text()),
  events: {
	'click #generate-button':'generate',
	'click #about-button': 'showAboutData',
	'click .hide-modal': 'hideMDLModal',
	'keyup #passphrase': 'updateEmojis',
	'keyup #email': 'updateEmojis',
	'click #scan': 'scan',
	'click #warp-formula' : 'showWarp',
  },
  initialize: function() {
	var progressBar = $('#progressbar', this.el);
	var progress = $('.progress', this.el);
	var model = this.model;

	this.model.on('generated', function() {
	  progressBar.css('display', 'none');
	  $('.spinner-wrap').hide();
	});
	this.model.on('change:pctCompleted', function() {
	  var progressBar = $('#progressbar', this.el);
	  var pctCompleted = model.getPct();
	  progressBar.css('width', pctCompleted + '%')
	})
  },
  render: function() {
	var master = this;
	this.on('generated', function() {
	  var progressBar = $('#progressbar', this.el);
	  progressBar.css('display', 'none')
	});

	this.$el.html(master.template());
	return this;
  },
  showWarp: function() {
	$('#warp-formula-img', this.el).toggle();
  },
  generate: function() {
	var pass = $('#passphrase', this.el).val();
	var salt = $('#email', this.el).val();
	var master = this;
	var progress = $('#progress', this.el);
	var progressBar = $('#progressbar', this.el);

	progress.css('display', 'block');
	progressBar.css('width', '0%')

	$('#generate-button').hide();
	$('#scan').hide();
	$('.spinner-wrap').show();
	$('.backdrop').show();
	$('input[type="text"], input[type="email"], input[type="password"]').prop('disabled', true);

	master.model.trigger('generating');
	master.model.warp(pass, salt);
  },
  showAboutData: function(title, data) {
	var master = this;
	$('#title-qrcode', this.el).attr('value', data)
	$('#title-qrcode', this.el).html(data);
	$('#account-data-label', this.el).text(title);
	this.showMDLModal();
  },
  showMDLModal: function() {
	var dialog = document.querySelector('#about-dialog');
	if (! dialog.showModal) {
	  dialogPolyfill.registerDialog(dialog);
	}
	dialog.showModal();
	$('#about-dialog', this.el).addClass("open");
  },
  hideMDLModal: function() {
	$('#about-dialog', this.el).removeClass("open");
	setTimeout(function(){
	  document.querySelector('#about-dialog').close();
	}, 300);
  },
  updateEmojis: function() {
	var string = $('#passphrase', this.el).val() + $('#email', this.el).val();
	$('#emojis').html("")
	_.each(["a","z",""], function(a , i) {
	  $('#emojis').append(emojisList[parseInt(sha1(string + a), 16)%(emojisList.length-1)])
	});
  },
  scan: function() {
	var master = this;
	var updateEmojis = this.updateEmojis;
	cordova.plugins.barcodeScanner.scan(function(result) {
	  document.querySelector('#passphrase-area').MaterialTextfield.change(result.text);
	  master.updateEmojis();
	  if (isPkey(result.text)) {
		master.generate();
	  };
	});
  },
});