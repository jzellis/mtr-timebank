Template.createOrgModal.events({
	
	    'submit form#createOrg' : function(e){
    	e.preventDefault();

        org = {
                        name : $('form#createOrg input[name="name"]').val(),
                        slug: slugify($('form#createOrg input[name="name"]').val()),
            avatar : $('form#createOrg img.avatar').attr('src'),
            url : $('form#createOrg input[name="url"]').val(),
            description: $('form#createOrg textarea[name="description"]').val(),
            balance: 0,
            favoriteUsers: [],
            favoriteOrgs: []
        };

    Meteor.call("createOrg", org, function(err,data){

        $('form#createOrg input, form#createOrg textarea').val('')
        $('#createOrgModal').modal('hide');



    });
    }


})