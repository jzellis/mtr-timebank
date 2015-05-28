Template.registerHelper("isFavoriteUser", function(id){
	
return Meteor.user().profile.favoriteUsers.indexOf(id) > -1;

});

Template.registerHelper("isFavoriteOrg", function(id){
	
return Meteor.user().profile.favoriteOrgs.indexOf(id) > -1;

});