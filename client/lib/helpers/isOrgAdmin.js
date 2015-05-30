Template.registerHelper("isOrgAdmin" , function(orgId, id){
    return Roles.find({orgId: orgId, userId: id, admin:true}).count() > 0;
});
