Template.registerHelper("isFavoriteUser", function(id){
if(Meteor.user())
return Meteor.user().profile.favoriteUsers.indexOf(id) > -1;

});

Template.registerHelper("isFavoriteOrg", function(id){
	if(Meteor.user())

return Meteor.user().profile.favoriteOrgs.indexOf(id) > -1;

});