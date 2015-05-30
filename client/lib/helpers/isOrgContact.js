Template.registerHelper("isOrgContact" , function(orgId, id){
    return Roles.find({orgId: orgId, userId: id, contact:true}).count() > 0;
});
