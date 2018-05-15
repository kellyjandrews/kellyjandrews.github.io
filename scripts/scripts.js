/*global $ */
var $ = jQuery = require('jquery'),
	hbs = require('hbsfy/runtime'),
	moment = require('moment');
console.log(window.data);
$(function(){

	if($('#experience').length) {

		//set up templates
		var demographicTmpl = require('../templates/demographics.hbs');
		var educationTmpl = require('../templates/education.hbs');
		var skillsTmpl = require('../templates/skills.hbs');
		var experienceTmpl = require('../templates/experience.hbs');

		$('#demographics').html(demographicTmpl(window.data.demographics));
		$('#education').html(educationTmpl(window.data.education));
		$('#employment').html(experienceTmpl(window.data.experience));
		$('#skills').html(skillsTmpl(window.data.skills));
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
