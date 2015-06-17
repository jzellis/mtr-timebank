Template.admin.events({

'click span.createOrg' : function(){

$("#modals").html('');
Blaze.render(Template.createOrgModal, $('#modals')[0]);
$('#createOrgModal').modal();
},

'click span.createUser' : function(){

$("#modals").html('');
Blaze.render(Template.createUserModal, $('#modals')[0]);
$('#createUserModal').modal();
},
	
});