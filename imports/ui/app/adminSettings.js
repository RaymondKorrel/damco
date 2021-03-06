import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './adminSettings.html'

// Admin helpers
Template.adminSettings.helpers({
	'adminData': function() {
		// Get admin data and return
		var flexEmployees = Meteor.users.find({'profile.desk': 'flex'}).fetch().length;
		var fixedEmployees = Meteor.users.find({'profile.desk': 'fixed'}).fetch().length;
		var flexDesks = Desks.findOne({name: 'desksInfo'}) && Desks.findOne({name: 'desksInfo'}).flexDesks;
		var registrationKey = Desks.findOne({name: 'desksInfo'}) && Desks.findOne({name: 'desksInfo'}).registrationKey;
		return {
			flexEmployees: flexEmployees,
			fixedEmployees: fixedEmployees,
			flexDesks: flexDesks,
			registrationKey: registrationKey
		};
	}
});
// Admin Events
Template.adminSettings.events({
	'submit .admin-form'(event, template) {
		event.preventDefault();
		// Get form data
		var flexDesks = parseInt(template.find('#flexDesks').value);
		var adminPassword = template.find('#adminPassword').value;
		var registrationKey = template.find('#registrationKey').value;

		// Check if field has changed
		if (adminPassword !== '') {
			Session.set('messageVisible', true);
			Session.set('messageConfirmation', true);
			Session.set('messageText', 'Are you sure you want to reset your password?');
			Session.set('messageName', 'change-password');
			Session.set('password', adminPassword);
		};
		// Update username and name
		Meteor.call('updateAdmin', flexDesks, registrationKey);
		// Message
		Session.set('messageVisible', true);
		Session.set('messageConfirmation', false);
		Session.set('messageText', 'Changes saved!');
	},
	'click .logout'(event) {
		event.preventDefault();
		// Log out
		Meteor.logout();
		// Redirect to home
		Router.go('/');
	}
});