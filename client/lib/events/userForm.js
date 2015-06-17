Template.userForm.events({
	
	    'click div.userForm img.avatar' : function(e){
        $('div.userForm input[name="avatarUpload"]').trigger('click');
    },
    'change div.userForm input[name="avatarUpload"]': function(e) {
        file = $(e.currentTarget)[0].files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            // do stuff once it's uploaded
            imgData = e.target.result;
            $('div.userForm img.avatar').attr('src', resizeImage(imgData, 1000, 1000));
            // $('.uploadedCover').show();
        }
        reader.readAsDataURL(file);
    },

});