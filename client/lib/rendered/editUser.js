Template.editUser.rendered = function(){
tags = Meteor.user().profile.tags;
tags.unshift('');	

tags.forEach(function(tag){
	// console.log(tag)
	$('input.tagList').tagsinput('add',tag);
});

}