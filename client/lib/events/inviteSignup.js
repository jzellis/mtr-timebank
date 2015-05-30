Template.inviteSignup.events({

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

    'submit form' : function(e){
    	e.preventDefault();

    	Accounts.createUser({
            username : $('input[name="username"]').val(),
    		email: $('input[name="email"]').val(),
            password: $('input[name="password"]').val(),
    		profile: {
            name : $('input[name="name"]').val(),
    		avatar : $('img.avatar').attr('src'),
            url : $('input[name="url"]').val(),
            balance: 0,
            favoriteUsers: [],
            favoriteOrgs: []
        }


    		

    	}, function(err){
            if(err){ sAlert.error(err.reason);
            }else{
            	Roles.update({_id: $('input[name="token"]').val()}, {$set: {userId: Meteor.userId(), accepted: true}});
                Router.go("/");
            }
        })
    }	

})