Template.editUser.rendered = function(){
	
$('input.tagList').tagsinput();
// $('input.tagList').removeAttr('style');
Meteor.user().profile.tags.forEach(function(tag){
	$('input.tagList').tagsinput('add',tag);
});

}