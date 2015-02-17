/*global bootstrap, $ */
var $ = jQuery = require('jquery'),
	bootstrap = require('bootstrap');


$(function(){

	$('article.post').on('mouseover', function(){
		$(this).find('header h1').addClass('blurry-text');
		$(this).find('section').removeClass('hidden');
		//$(this).find('.overlay').removeClass('hidden');
	}).on('mouseout', function(){
		$(this).find('header h1').removeClass('blurry-text');
		$(this).find('section').addClass('hidden');
		//$(this).find('.overlay').addClass('hidden');
	})

});
