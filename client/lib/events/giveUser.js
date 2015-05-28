Template.giveUser.events({
	
'submit form' : function(e){
	e.preventDefault();
	
uId = $('#userId').val();
amount = $('#amount').val();
recipient = Meteor.users.findOne({_id: uId});

Meteor.call("giveUser",uId,amount,function(err,data){

if(err){
	$('#amount').parents('fieldset').addClass('has-error').append("<div class='error'>" + err.reason + "</div>");
	// sAlert.error(err.reason);
}
else{
	$('#giveUser').modal('hide');
	$('#results').html('');
	$('#search').val('');
	sAlert.success("You gave " + recipient.username + " <i class='fa fa-clock-o'></i> " + amount);
}

});

}

});