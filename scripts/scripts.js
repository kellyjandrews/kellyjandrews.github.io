/*global bootstrap, $ */
var $ = jQuery = require('jquery'),
	bootstrap = require('bootstrap'),
	hbs = require('hbsfy/runtime'),
	moment = require('moment');

$(function(){

	$('article.post').on('mouseover', function(){
		$(this).find('header h1').addClass('blurry-text');
		$(this).find('section').removeClass('hidden');
		//$(this).find('.overlay').removeClass('hidden');
	}).on('mouseout', function(){
		$(this).find('header h1').removeClass('blurry-text');
		$(this).find('section').addClass('hidden');
		//$(this).find('.overlay').addClass('hidden');
	});

	if($('#experience').length) {

		//set up templates
		var demographicTmpl = require('../templates/demographics.hbs');
		var educationTmpl = require('../templates/education.hbs');
		var skillsTmpl = require('../templates/skills.hbs');
		var experienceTmpl = require('../templates/experience.hbs');

		$.get('http://private-a1ac-kellyjandrews.apiary-mock.com/demographics', function(data) {
			$('#demographics').html(demographicTmpl(data));
		});

		$.get('http://private-a1ac-kellyjandrews.apiary-mock.com/skills', function(data){
			$('#skills').html(skillsTmpl(data));
		});

		$.get('http://private-a1ac-kellyjandrews.apiary-mock.com/education', function(data){
			$('#education').html(educationTmpl(data));
		});

		$.get('http://private-a1ac-kellyjandrews.apiary-mock.com/experience', function(data){
			$('#employment').html(experienceTmpl(data));
		});


		// $.when(demographics(), skills(), education(), experience()).done(function(demographics, skills, education, experience){
		//
		// 	var viewModel = {
		// 		demographics: map.fromJS(demographics[0]),
		// 		skills: map.fromJS(skills[0]),
		// 		education: map.fromJS(education[0]),
		// 		experience: map.fromJS(experience[0])
		// 	};
		//
		// 	var model = ko.applyBindings(viewModel);
		//
		// });

	};


});


hbs.registerHelper('formatPhone', function(number) {
	text = number.toString();
	return new hbs.SafeString(text.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'));
});

hbs.registerHelper('formatDate', function(date, pattern) {
	date = new Date(date);
	return new hbs.SafeString(moment(date).format(pattern));
});
