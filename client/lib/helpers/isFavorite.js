Template.registerHelper("isFavoriteUser", function(id){
if(Meteor.user())
return Meteor.user().profile.favorites.users.indexOf(id) > -1;

});

Template.registerHelper("isFavoriteOrg", function(id){
	if(Meteor.user())

return Meteor.user().profile.favorites.orgs.indexOf(id) > -1;

});