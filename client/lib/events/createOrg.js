Template.createOrg.events({

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