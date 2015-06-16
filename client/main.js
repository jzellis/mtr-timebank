

$(document).ready(function(){

// Favorites handlers for users and orgs
$(document.body).on('click', '.toggleFavoriteUser', function(e){

uid = $(e.currentTarget).attr('data-id');
	if(Meteor.user().profile.favorites.users.indexOf(uid) === -1){
	Meteor.users.update({_id: Meteor.userId()},{$push: {"profile.favorites.users": uid}}, function(){
    console.log(arguments);
  })
	}else{
	Meteor.users.update({_id: Meteor.userId()},{$pull: {"profile.favorites.users": uid}})

	}


});

$(document.body).on('click', '.toggleFavoriteOrg', function(e){

id = $(e.currentTarget).attr('data-id');
	if(Meteor.user().profile.favorites.orgs.indexOf(id) === -1){
	Meteor.users.update({_id: Meteor.userId()},{$push: {"profile.favorites.orgs": id}})
	}else{
	Meteor.users.update({_id: Meteor.userId()},{$pull: {"profile.favorites.orgs": id}})

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

// $(document.body).on('click', '.giveOrg', function(e){

// 	if($(e.currentTarget).attr('disabled') != 'disabled'){

// id = $(e.currentTarget).attr('data-id');

// org = Orgs.findOne({_id: id});
// $("#modals").html('');
// Blaze.renderWithData(Template.giveOrg, org, $('#modals')[0]);
// $('#giveOrg').modal();

// }

// });

$(document.body).on('click', '.requestUser', function(e){

	if($(e.currentTarget).attr('disabled') != 'disabled'){

id = $(e.currentTarget).attr('data-id');

user = Meteor.users.findOne({_id: id});
$("#modals").html('');
Blaze.renderWithData(Template.requestUser, user, $('#modals')[0]);
$('#requestUser').modal();

}

});

$(document.body).on('click', '.requestOrg', function(e){

	if($(e.currentTarget).attr('disabled') != 'disabled'){

id = $(e.currentTarget).attr('data-id');

org = Orgs.findOne({_id: id});
$("#modals").html('');
Blaze.renderWithData(Template.requestOrg, org, $('#modals')[0]);
$('#requestOrg').modal();

}

});

$(document.body).on('click', '.approveTransaction', function(e){

id = $(e.currentTarget).attr('data-id');
Meteor.call("approveTransactionUser", id, function(err){



});

});


});

// Configure accounts-ui

Accounts.ui.config({
    requestPermissions: {},
    passwordSignupFields: 'USERNAME_AND_EMAIL',
    extraSignupFields: [{
        fieldName: 'name',
        fieldLabel: 'Name',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please enter your name");
            return false;
          } else {
            return true;
          }
        }
    }]
});

// What happens when the user logs out

accountsUIBootstrap3.logoutCallback = function(error) {
  if(error) console.log("Error:" + error);
  Router.go('/');
}


//On startup

Meteor.subscribe("config");


Meteor.startup(function () {


    sAlert.config({
        html: true,
        onRouteClose: true,
        stack: true,
    });

});
