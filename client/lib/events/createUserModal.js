Template.createUserModal.events({
	
'submit form#createUser' : function(e){
	
	e.preventDefault();

  user = {
    username: $('form#createUser input.username').val(),
    email: $('form#createUser input.email').val(),
    password: $('form#createUser input.password').val(),
    profile: {
      avatar : $('form#createUser img.avatar').attr('src'),
      name: $('form#createUser input.name').val(),
      url: $('form#createUser input.url').val(),
      tags: $('form#createUser input.tagList').tagsinput('items'),
      balance: 0,
      favorites: {
        users: [],
        orgs: []
      }

  }
};

Meteor.call('addUser',user, function(){
$('form#createUser input').val('');
$('#createUserModal').modal('hide');

});
}

})