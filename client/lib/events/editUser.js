Template.editUser.events({

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

    	user = {
    		"emails.0.address": $('input[name="email"]').val(),
    		"profile.name" : $('input[name="name"]').val(),
    		"profile.avatar" : $('img.avatar').attr('src'),
    		"profile.url" : $('input[name="url"]').val()
    		

    	};

    	if($('input[name="newPassword"]').val() !="") user.newPassword = $('input[name="newPassword"]').val();
 
    	Meteor.call("updateUser", user, function(err,data){
    		if(err) sAlert.error(err.reason);
    	});

    }	

})