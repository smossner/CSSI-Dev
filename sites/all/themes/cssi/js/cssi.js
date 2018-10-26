jQuery(document).ready(function ($) {
	
	// When the page has loaded show video carousel
	$("#slick-carousel").fadeIn(2000);
	
	// splitter in footer, hides last bar
	$('.footer .menu-block-3 .menu li.leaf:not(:last)').after('<li class="footer-divider">|</li>');
	$('.footer #block-block-4 .menu li.leaf:not(:last)').after('<li class="footer-divider">|</li>');
	
	// toggle function to show/hide
	$(document).ready(function(){
	  $(".toggler").click(function(){
		$(this).next().slideToggle("fast");
		return false;
	  }).next().hide();
	  
	  $(".toggler-show").click(function(){
		$(this).next().slideToggle("fast");
		return false;
	  }).next().show();

	});
	
	
	jQuery(".abstract").hide();
	jQuery(".showhide").click(function(event) {
		event.preventDefault();
		jQuery(this).closest('tr').next().find('.abstract').toggle();
	});
	

	$(".form-item-field-award-type-value input").attr("size","5");
	
    // 508 issue fix
    $(":hidden").attr( "aria-hidden", "true");
    $(".menu-block-wrapper > ul > li > a").attr("aria-haspopup", "true");
    $(".menu-block-wrapper > ul > li > a").attr("aria-controls", "true");
    $(".menu-block-wrapper > ul > li > a").attr("aria-expanded", "false");
	$('.menu-block-wrapper > ul > li > a').focus(function () {
		$('.menu-block-wrapper > ul > li').removeClass('force-show');
		$(this).parent().addClass('force-show');
	});

	$(document).click(function () {
		$('.menu-block-wrapper > ul > li').removeClass('force-show');
	});
	
	// 508 fixes
    $(".menu li a.nolink").attr("href","#");
    $(".md-bullets .bullet").attr("tabindex", "0");
    $(".bottomNavClose").attr("tabindex", "-1");
	
	$('.homepage-movie a').on('click', function(){
		$("#bottomNavClose").focus();
	});
	
});


// shows all items at once
jQuery(function(){
	jQuery('.showall').click(function(){
		jQuery('.abstract').toggle();
	});
});
