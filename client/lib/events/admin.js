Template.admin.events({
	
'click .approveOrg' : function(e){
	e.preventDefault();
	orgId = $(e.currentTarget).attr('data-id');
	Orgs.update({_id: orgId}, {$set: {approvedAt: new Date()}});
	Router.go('/admin');
}

});