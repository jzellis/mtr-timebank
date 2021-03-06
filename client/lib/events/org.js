Template.org.events({

    'click img.avatar' : function(e){
        $('input[name="avatarUpload"]').trigger('click');
    },
    'change input[name="avatarUpload"]': function(e) {
        file = $(e.currentTarget)[0].files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            // do stuff once it's uploaded
            imgData = e.target.result;
            $('img.avatar').attr('src', resizeImage(imgData, 1000, 1000));
            // $('.uploadedCover').show();
        }
        reader.readAsDataURL(file);
    },

    'submit form#updateOrg' : function(e){
    	e.preventDefault();

    	org = {
    		name : $('input[name="name"]').val(),
    		avatar : $('img.avatar').attr('src'),
    		url : $('input[name="url"]').val(),
            description: $('textarea[name="description"]').val()
    		

    	};
 
    	Meteor.call("updateOrg", $('input[name="orgId"]').val(), org, function(err,data){
    		if(err) sAlert.error(err.reason);
            sAlert.success("Org updated");
    	});

    },

    'change .userList .isAdmin' : function(e){
    uid = $(e.currentTarget).attr('data-id');
    rid = Roles.findOne({orgId: $('input[name="orgId"]').val(), userId: $(e.currentTarget).attr('data-id')})._id;
    Roles.update({_id: rid}, {$set: {admin: $(e.currentTarget).is(":checked")}});
    },
    'change .userList .isContact' : function(e){
    uid = $(e.currentTarget).attr('data-id');
    rid = Roles.findOne({orgId: $('input[name="orgId"]').val(), userId: $(e.currentTarget).attr('data-id')})._id;
    Roles.update({_id: rid}, {$set: {contact: $(e.currentTarget).is(":checked")}});

    },

        'click .removeFromOrg' : function(e){
            if(confirm("Are you sure you want to remove this user from your org?")){
                Meteor.call("removeUserFromOrg", $('input[name="orgId"]').val(), $(e.currentTarget).attr('data-id'));
            }
    },


    'submit form#inviteUser' : function(e){
        e.preventDefault();
        newUser = {
            email: $('input.inviteEmail').val(),
            isAdmin: $('form#inviteUser input.isAdmin').is(':checked'),
            isContact: $('form#inviteUser input.isContact').is(':checked')

        }
        // e.preventDefault();
        Meteor.call("inviteUserToOrg", $('input[name="orgId"]').val(),newUser, function(err){
            if(err) sAlert.error(err.reason);
            sAlert.success("User invited!");
        })
    }
})