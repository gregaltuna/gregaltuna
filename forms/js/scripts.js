jQuery(window).load(function() {
  jQuery('.imagefit').imagefit();
	jQuery('.fitvid').fitVids();
});

//$(document).ready(function(){
//  // Target your .container, .wrapper, .post, etc.
//  $('.fitvid').fitVids();
//});

//jQuery(document).ready(function(){
//	jQuery('a[href^="#"]').on('click',function (e) {
//    e.preventDefault();
//
//    var target = this.hash;
//    var $target = jQuery(target);
//
//    jQuery('html, body').stop().animate({
//	    'scrollTop': $target.offset().top
//    }, 1000, 'swing', function () {
//	    window.location.hash = target;
//    });
//	});
//});