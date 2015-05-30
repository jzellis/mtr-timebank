Template.layout.events({
	'click .logout' : function(e){
	Meteor.logout();
	Router.go('/');
	}
});