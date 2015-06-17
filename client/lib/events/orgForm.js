Template.orgForm.events({
	
    'click div.orgForm img.avatar' : function(e){
        $('div.orgForm input[name="avatarUpload"]').trigger('click');
    },
    'change div.orgForm input[name="avatarUpload"]': function(e) {
        file = $(e.currentTarget)[0].files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            // do stuff once it's uploaded
            imgData = e.target.result;
            $('div.orgForm img.avatar').attr('src', resizeImage(imgData, 1000, 1000));
            // $('.uploadedCover').show();
        }
        reader.readAsDataURL(file);
    },


});