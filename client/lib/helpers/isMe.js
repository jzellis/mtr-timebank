Template.registerHelper("isMe", function(id){
	return id == Meteor.userId();
})