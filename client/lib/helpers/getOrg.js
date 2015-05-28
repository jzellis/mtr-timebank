Template.registerHelper("getOrg", function(id){
	return Orgs.findOne({_id: id})
});