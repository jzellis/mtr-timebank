

$(document).ready(function(){

// Favorites handlers for users and orgs
$(document.body).on('click', '.toggleFavoriteUser', function(e){

uid = $(e.currentTarget).attr('data-id');
	if(Meteor.user().profile.favoriteUsers.indexOf(uid) === -1){
	Meteor.users.update({_id: Meteor.userId()},{$push: {"profile.favoriteUsers": uid}})
	}else{
	Meteor.users.update({_id: Meteor.userId()},{$pull: {"profile.favoriteUsers": uid}})

	}


});

$(document.body).on('click', '.toggleFavoriteOrg', function(e){

id = $(e.currentTarget).attr('data-id');
	if(Meteor.user().profile.favoriteOrgs.indexOf(id) === -1){
	Meteor.users.update({_id: Meteor.userId()},{$push: {"profile.favoriteOrgs": id}})
	}else{
	Meteor.users.update({_id: Meteor.userId()},{$pull: {"profile.favoriteOrgs": id}})

	}


});

// Give time to users and orgs

$(document.body).on('click', '.giveUser', function(e){

	if($(e.currentTarget).attr('disabled') != 'disabled'){

id = $(e.currentTarget).attr('data-id');

user = Meteor.users.findOne({_id: id});
$("#modals").html('');
Blaze.renderWithData(Template.giveUser, user, $('#modals')[0]);
$('#giveUser').modal();

}

});

$(document.body).on('click', '.giveOrg', function(e){

	if($(e.currentTarget).attr('disabled') != 'disabled'){

id = $(e.currentTarget).attr('data-id');

org = Orgs.findOne({_id: id});
$("#modals").html('');
Blaze.renderWithData(Template.giveOrg, org, $('#modals')[0]);
$('#giveOrg').modal();

}

});

});


Meteor.startup(function () {

    sAlert.config({
        html: true,
        onRouteClose: true,
        stack: true,
    });

});
