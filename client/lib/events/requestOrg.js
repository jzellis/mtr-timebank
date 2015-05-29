Template.requestOrg.events({
	
'submit form' : function(e){
	e.preventDefault();
	
oId = $('#orgId').val();
amount = $('#amount').val();
recipient = Orgs.findOne({_id: oId});

Meteor.call("requestOrg",oId,amount,function(err,data){

if(err){
	$('#amount').parents('fieldset').addClass('has-error').append("<div class='error'>" + err.reason + "</div>");
	// sAlert.error(err.reason);
}
else{
	$('#requestOrg').modal('hide');
	$('#results').html('');
	$('#search').val('');
	sAlert.success("You requested <i class='fa fa-clock-o'></i> " + amount + " from " + recipient.name);
}

});

}

}); 