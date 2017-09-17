var wallet = new Wallet();
var loginScreen = new LoginScreen({model: wallet});
var afterLoginScreen = new AfterLoginScreen({model: wallet});

loginScreen.render().$el.appendTo($('#generateCard'));

wallet.on('generated', function() {
  afterLoginScreen.render().done(function(res) {
	res.$el.appendTo($('#menuCard'));
	$('#amber-menu-card').css({'width': $( window ).width(), 'margin-left': $( window ).width(), 'transition-duration': '0s'});
	afterLoginScreen.resizeTitle();
  })
});

afterAnimation = function() {
  $('#amber-menu-card').css({'width': 'auto', 'margin-left': 'auto', 'transition-duration': '0.7s'});
  $('#amber-generate-card').css({'margin-left': 'auto'}).hide();
  $('.backdrop').hide();
}

wallet.on('generated', function() {
  $('#progress').css('display','none');
  $('#amber-generate-card').css('margin-left', '-' + $( window ).width());
  $('#amber-menu-card').css({'margin-left': '0', 'transition-duration': '0.7s'});
  setTimeout(afterAnimation, 700);
});










