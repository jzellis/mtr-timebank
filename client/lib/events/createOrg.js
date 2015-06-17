Template.createOrg.events({

    'submit form' : function(e){
    	e.preventDefault();

        org = {
                        name : $('input[name="name"]').val(),
            avatar : $('img.avatar').attr('src'),
            url : $('input[name="url"]').val(),
            description: $('textarea[name="description"]').val(),
            balance: 0,
            favoriteUsers: [],
            favoriteOrgs: []
        };

    Meteor.call("createOrg", org, function(err,data){

        Router.go('/');



    });
    }	

})