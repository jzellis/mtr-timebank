Template.searchForm.helpers({
	'search' : function(){
	return [
	{name: 'users',
	local: function(){ return Meteor.users().find().fetch().map(function(user){return user.username + " (" + user.profile.name + ")"})},
	header: "<h3>Users</h3>"
	},
	{name: 'orgs',
	local: function(){ return Orgs().find().fetch().map(function(org){return org.name})},
	header: "<h3>Orgs</h3>"
	},
	]
	}
});